# encoding: ascii-8bit

# Copyright 2020 Ball Aerospace & Technologies Corp.
# All Rights Reserved.
#
# This program is free software; you can modify and/or redistribute it
# under the terms of the GNU General Public License
# as published by the Free Software Foundation; version 3 with
# attribution addendums as found in the LICENSE.txt

require 'redis'
require 'json'
require 'thread'
require 'connection_pool'
require 'cosmos/config/config_parser'
require 'cosmos/io/json_rpc'

module Cosmos
  class Store
    # Variable that holds the singleton instance
    @@instance = nil

    # Mutex used to ensure that only one instance is created
    @@instance_mutex = Mutex.new

    # Get the singleton instance
    def self.instance(pool_size = 10)
      return @@instance if @@instance
      @@instance_mutex.synchronize do
        @@instance ||= self.new(pool_size)
        return @@instance
      end
    end

    def initialize(pool_size = 10)
      Redis.exists_returns_integer = true
      @redis_pool = ConnectionPool.new(size: pool_size) { Redis.new(url: "redis://localhost:6379/0") }
      @topic_offsets = {}
      @overrides = {}
    end

    def get_interfaces()
      result = []
      @redis_pool.with do |redis|
        interfaces = redis.hgetall("cosmos_interfaces")
        interfaces.each do |interface_name, interface_json|
          result << JSON.parse(interface_json)
        end
      end
      result
    end

    def get_interface(interface_name)
      @redis_pool.with do |redis|
        if redis.hexists("cosmos_interfaces", interface_name)
          return JSON.parse(redis.hget("cosmos_interfaces", interface_name))
        else
          raise "Interface '#{interface_name}' does not exist"
        end
      end
    end

    def set_interface(interface, initialize: false)
      @redis_pool.with do |redis|
        if initialize || redis.hexists("cosmos_interfaces", interface.name)
          return redis.hset("cosmos_interfaces", interface.name, JSON.generate(interface.as_json))
        else
          raise "Interface '#{interface.name}' does not exist"
        end
      end
    end

    def write_interface(interface_name, hash)
      @redis_pool.with do |redis|
        if redis.hexists("cosmos_interfaces", interface_name)
          write_topic("CMDINTERFACE__#{interface_name}", hash)
        else
          raise "Interface '#{interface_name}' does not exist"
        end
      end
    end

    # TODO: Is this used anywhere?
    # def cmd_interface(interface_name, target_name, cmd_name, cmd_params, range_check, hazardous_check, raw)
    #   write_topic("CMDINTERFACE__#{interface_name}", { 'target_name' => target_name, 'cmd_name' => cmd_name, 'cmd_params' => JSON.generate(cmd_params.as_json), 'range_check' => range_check, 'hazardous_check' => hazardous_check, 'raw' => raw })
    # end

    def cmd_target(target_name, cmd_name, cmd_params, range_check, hazardous_check, raw, timeout_ms: 5000)
      cmd_packet_exist?(target_name, cmd_name)
      topic = "CMDTARGET__#{target_name}"
      ack_topic = "ACKCMDTARGET__#{target_name}"
      cmd_id = write_topic(topic, { 'target_name' => target_name, 'cmd_name' => cmd_name, 'cmd_params' => JSON.generate(cmd_params.as_json), 'range_check' => range_check, 'hazardous_check' => hazardous_check, 'raw' => raw })
      (timeout_ms / 100).times do
        read_topics([ack_topic], nil, 100) do |topic, msg_id, msg_hash, redis|
          if msg_id == cmd_id
            Logger.info "Ack Received: #{msg_id}: #{msg_hash.inspect}"
            if msg_hash["result"] == "SUCCESS"
              return
            else
              raise msg_hash["result"]
            end
          end
        end
      end
      raise "Timeout waiting for cmd ack"
    end

    def receive_commands(interface)
      topics = []
      topics << "CMDINTERFACE__#{interface.name}"
      interface.target_names.each do |target_name|
        topics << "CMDTARGET__#{target_name}"
      end
      while true
        read_topics(topics) do |topic, msg_id, msg_hash, redis|
          result = yield topic, msg_hash
          write_topic("ACK" + topic, { 'result' => result }, msg_id)
        end
      end
    end

    def get_tlm_values(item_array, value_types = :CONVERTED)
      items = []
      states = []
      settings = []

      if !item_array.is_a?(Array) || (!item_array[0].is_a?(Array) and !item_array.empty?)
        raise ArgumentError, "item_array must be nested array: [['TGT','PKT','ITEM'],...]"
      end
      return [[], []] if item_array.empty?
      raise(ArgumentError, "Passed #{item_array.length} items but only #{value_types.length} value types") if (Array === value_types) and item_array.length != value_types.length

      # Convert value_types into an Array length of item_array to make thing easier
      unless value_types.is_a?(Array)
        value_types = [value_types] * item_array.length
      end

      # Validate value_types. Due to JSON round tripping from scripts, value_types can be a String or Symbol
      value_types.each do |type|
        if !type.is_a?(Symbol) && !type.is_a?(String)
          raise ArgumentError, "value_types must be a single symbol or array of symbols specifying the conversion method (:RAW, :CONVERTED, :FORMATTED, :WITH_UNITS)"
        end
        type = type.intern
        unless %i(RAW CONVERTED FORMATTED WITH_UNITS).include?(type)
          raise ArgumentError, "Unknown value type: #{type}"
        end
      end

      @redis_pool.with do |redis|
        promises = []
        redis.pipelined do
          item_array.length.times do |index|
            target_name, packet_name, item_name = item_array[index]
            value_type = value_types[index]
            promises[index] = tlm_variable_with_limits_state_gather(redis, target_name, packet_name, item_name, value_type)
          end
        end
        promises.each_with_index do |promise, index|
          value_type = value_types[index]
          result = promise.value
          if result[0]
            if value_type == :FORMATTED or value_type == :WITH_UNITS
              items << JSON.parse(result[0]).to_s
            else
              items << JSON.parse(result[0])
            end
          elsif result[1]
            if value_type == :FORMATTED or value_type == :WITH_UNITS
              items << JSON.parse(result[1]).to_s
            else
              items << JSON.parse(result[1])
            end
          elsif result[2]
            items << JSON.parse(result[2]).to_s
          elsif result[3]
            items << JSON.parse(result[3]).to_s
          else
            raise "Item '#{item_array[0].join(' ')}' does not exist"
          end
          if result[-1]
            states << JSON.parse(result[-1]).intern
          else
            states << nil
          end
        end
      end

      return items, states
    end

    def cmd_packet_exist?(target_name, packet_name)
      _packet_exist?(target_name, packet_name, type: 'cmd')
    end
    def tlm_packet_exist?(target_name, packet_name)
      _packet_exist?(target_name, packet_name, type: 'tlm')
    end
    def _packet_exist?(target_name, packet_name, type:)
      @redis_pool.with do |redis|
        # TODO: pipeline
        if redis.exists("cosmos#{type}__#{target_name}") != 0
          if redis.hexists("cosmos#{type}__#{target_name}", packet_name)
            true
          else
            raise "Packet '#{target_name} #{packet_name}' does not exist"
          end
        else
          raise "Target '#{target_name}' does not exist"
        end
      end
    end

    def get_target_names
      @redis_pool.with do |redis|
        return redis.hkeys("cosmos_targets")
      end
    end

    def get_target(target_name)
      @redis_pool.with do |redis|
        if redis.hexists("cosmos_targets", target_name)
          return JSON.parse(redis.hget("cosmos_targets", target_name))
        else
          raise "Target '#{target_name}' does not exist"
        end
      end
    end

    def set_target(target)
      @redis_pool.with do |redis|
        if redis.hexists("cosmos_targets", target.name)
          return redis.hset("cosmos_targets", target.name, JSON.generate(target.as_json))
        else
          raise "Target '#{target_name}' does not exist"
        end
      end
    end

    def get_packet(target_name, packet_name, type: 'tlm')
      @redis_pool.with do |redis|
        # TODO: pipeline
        if redis.exists("cosmos#{type}__#{target_name}") != 0
          if redis.hexists("cosmos#{type}__#{target_name}", packet_name)
            return JSON.parse(redis.hget("cosmos#{type}__#{target_name}", packet_name))
          else
            raise "Packet '#{target_name} #{packet_name}' does not exist"
          end
        else
          raise "Target '#{target_name}' does not exist"
        end
      end
    end

    # TODO: Is this needed?
    # def set_packet(packet, type: 'tlm')
    #   @redis_pool.with do |redis|
    #     if redis.exists("cosmos#{type}__#{packet.target_name}") != 0
    #       if redis.hexists("cosmos#{type}__#{packet.target_name}", packet.packet_name)
    #         return redis.hset("cosmos#{type}__#{packet.target_name}", packet.packet_name, JSON.generate(packet.as_json))
    #       else
    #         raise "Packet '#{packet.target_name} #{packet.packet_name}' does not exist"
    #       end
    #     else
    #       raise "Target '#{packet.target_name}' does not exist"
    #     end
    #   end
    # end

    def get_item_from_packet_hash(packet, item_name)
      item = packet['items'].find {|item| item['name'] == item_name.to_s }
      raise "Item '#{packet['target_name']} #{packet['packet_name']} #{item_name}' does not exist" unless item
      item
    end

    def get_item(target_name, packet_name, item_name, type: 'tlm')
      packet = get_packet(target_name, packet_name, type: type)
      get_item_from_packet_hash(packet, item_name)
    end

    def get_commands(target_name)
      _get_cmd_tlm(target_name, type: 'cmd')
    end

    def get_telemetry(target_name)
      _get_cmd_tlm(target_name, type: 'tlm')
    end

    # Helper method for get_commands and get_telemetry
    def _get_cmd_tlm(target_name, type:)
      result = []
      @redis_pool.with do |redis|
        if redis.exists("cosmos#{type}__#{target_name}") != 0
          packets = redis.hgetall("cosmos#{type}__#{target_name}")
          packets.each do |packet_name, packet_json|
            result << JSON.parse(packet_json)
          end
        else
          raise "Target '#{target_name}' does not exist"
        end
      end
      result
    end

    # TODO: This can't take a Packet but this is how the interface_microservice works
    # def inject_packet(packet)
    #   # Test to make sure this is a valid packet
    #   get_packet(packet.target_name, packet.packet_name)

    #   # Write new packet to stream
    #   msg_hash = { time: packet.received_time.to_nsec_from_epoch,
    #                stored: packet.stored,
    #                target_name: packet.target_name,
    #                packet_name: packet.packet_name,
    #                received_count: packet.received_count, # TODO: Plus one?
    #                buffer: packet.buffer(false) }
    #   write_topic("TELEMETRY__#{packet.target_name}__#{packet.packet_name}", msg_hash)
    # end

    def tlm_variable_with_limits_state_gather(redis, target_name, packet_name, item_name, value_type)
      case value_type
      when :RAW
        secondary_keys = [item_name, "#{item_name}__L"]
      when :CONVERTED
        secondary_keys = ["#{item_name}__C", item_name, "#{item_name}__L"]
      when :FORMATTED
        secondary_keys = ["#{item_name}__F", "#{item_name}__C", item_name, "#{item_name}__L"]
      else
        secondary_keys = ["#{item_name}__U", "#{item_name}__F", "#{item_name}__C", item_name, "#{item_name}__L"]
      end
      result = redis.hmget("tlm__#{target_name}__#{packet_name}", *secondary_keys)
    end

    def get_tlm_item(target_name, packet_name, item_name, type: :WITH_UNITS)
      if @overrides["#{target_name}__#{packet_name}__#{item_name}__#{type}"]
        return @overrides["#{target_name}__#{packet_name}__#{item_name}__#{type}"]
      end

      types = []
      case type
      when :WITH_UNITS
        types = ["#{item_name}__U", "#{item_name}__F", "#{item_name}__C", item_name]
      when :FORMATTED
        types = ["#{item_name}__F", "#{item_name}__C", item_name]
      when :CONVERTED
        types = ["#{item_name}__C", item_name]
      when :RAW
        types = [item_name]
      end

      @redis_pool.with do |redis|
        results = redis.hmget("tlm__#{target_name}__#{packet_name}", *types)
        results.each do |result|
          return JSON.parse(result) if result
        end
        return nil
      end
    end

    def set_tlm_item(target_name, packet_name, item_name, value, type: :CONVERTED)
      case type
      when :WITH_UNITS
        field = "#{item_name}__U"
      when :FORMATTED
        field = "#{item_name}__F"
      when :CONVERTED
        field = "#{item_name}__C"
      when :RAW
        field = item_name
      end

      @redis_pool.with do |redis|
        redis.hset("tlm__#{target_name}__#{packet_name}", field, value)
      end
    end

    def override(target_name, packet_name, item_name, value, type:)
      @overrides["#{target_name}__#{packet_name}__#{item_name}__#{type}"] = value
    end

    def normalize(target_name, packet_name, item_name)
      %w(RAW CONVERTED FORMATTED WITH_UNITS).each do |type|
        @overrides.delete("#{target_name}__#{packet_name}__#{item_name}__#{type}")
      end
    end

    def get_oldest_message(topic)
      @redis_pool.with do |redis|
        result = redis.xrange(topic, count: 1)
        return result[0]
      end
    end

    def get_almost_last_offset(topic)
      @redis_pool.with do |redis|
        result = redis.xrevrange(topic, count: 1)
        if result and result[0] and result[0][0]
          # Decrement the offset by a single sequence number
          # to ensures we include this ID in the call to xread
          decrement_id(result[0][0])
        else
          "0-0"
        end
      end
    end

    def read_topics(topics, offsets = nil, timeout_ms = 1000)
      # puts "read_topics:#{topics}"
      @redis_pool.with do |redis|
        unless offsets
          offsets = []
          topics.each do |topic|
            # Normally we will just be grabbing the topic offset
            # this allows xread to get everything past this point
            last_id = @topic_offsets[topic]
            if last_id
              offsets << last_id
            else
              # If there is no topic offset this is the first call.
              # Calculate an offset ID which is just prior to the last
              # in the stream and set the topic offset. By creating and ID
              # just prior to the last we include the last ID in the xread results.
              offsets << get_almost_last_offset(topic)
              @topic_offsets[topic] = offsets[-1]
            end
          end
        end
        # puts "offsets:#{offsets}"
        result = redis.xread(topics, offsets, block: timeout_ms)
        if result and result.length > 0
          result.each do |topic, messages|
            messages.each do |msg_id, msg_hash|
              @topic_offsets[topic] = msg_id
              yield topic, msg_id, msg_hash, redis if block_given?
            end
          end
        end
        # puts "result:#{result}"
        return result
      end
    end

    # cur_time = (Time.now.to_f * 1000).to_i
    # result = redis.xrevrange(topic, cur_time , cur_time, count: 1)

    def read_topic_last(topic)
      @redis_pool.with do |redis|
        result = redis.xrevrange(topic, '+', '-', count: 1)
        if result and result.length > 0
          return result[0]
        else
          return nil
        end
      end
    end

    def initialize_streams(topics)
      @redis_pool.with do |redis|
        topics.each do |topic|
          # Create empty stream with maxlen 0
          redis.xadd(topic, { a: 'b' }, maxlen: 0)
        end
      end
    end

    def write_topic(topic, msg_hash, id = nil, maxlen = 1000, approximate = true)
      # puts "write_topic topic:#{topic} hash:#{msg_hash}"
      @redis_pool.with do |redis|
        if id
          return redis.xadd(topic, msg_hash, id: id, maxlen: maxlen, approximate: approximate)
        else
          return redis.xadd(topic, msg_hash, maxlen: maxlen, approximate: approximate)
        end
      end
    end

    def decrement_id(id)
      time, sequence = id.split('-')
      if sequence == '0'
        "#{time.to_i - 1}-18446744073709551615"
      else
        "#{time}-#{sequence.to_i - 1}"
      end
    end

    # These are low level methods that should only be used as a last resort or for testing

    def hget(key, field)
      @redis_pool.with { |redis| return redis.hget(key, field) }
    end
    def hset(key, field, value)
      @redis_pool.with { |redis| redis.hset(key, field, value) }
    end
    def del(key)
      @redis_pool.with { |redis| redis.del(key) }
    end
    def exists?(*keys)
      @redis_pool.with { |redis| redis.exists?(*keys) }
    end
    def scan(count, **options)
      @redis_pool.with { |redis| redis.scan(count, **options) }
    end
  end
end