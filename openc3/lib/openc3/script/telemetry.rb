# encoding: ascii-8bit

# Copyright 2022 OpenC3, Inc.
# All Rights Reserved.
#
# This program is free software; you can modify and/or redistribute it
# under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation; version 3 with
# attribution addendums as found in the LICENSE.txt
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.

require 'openc3/script/extract'

module OpenC3
  module Script
    private

    # Get packets based on ID returned from subscribe_packet.
    # @param id [String] ID returned from subscribe_packets or last call to get_packets
    # @param block [Float] Time in seconds to wait for packets to be received
    # @param block_delay [Float] Time in seconds to sleep between polls
    # @param count [Integer] Maximum number of packets to return from EACH packet stream
    # @return [Array<String, Array<Hash>] Array of the ID and array of all packets found
    def get_packets(id, block: nil, block_delay: 0.1, count: 1000, scope: $openc3_scope, token: $openc3_token)
      start_time = Time.now
      end_time = start_time + block if block
      while true
        id, packets = $api_server.public_send(:get_packets, id, count: count, scope: scope, token: token)
        if block and Time.now < end_time and packets.empty?
          openc3_script_sleep(block_delay)
        else
          break
        end
      end
      return id, packets
    end

    # inject_tlm, set_tlm, override_tlm, and normalize_tlm are implemented here simply to add a puts
    # these methods modify the telemetry so the user should be notified in the Script Runner log messages

    def inject_tlm(target_name, packet_name, item_hash = nil, type: :CONVERTED, scope: $openc3_scope, token: $openc3_token)
      puts "inject_tlm(#{target_name} #{packet_name} #{item_hash}, type: #{type})"
      $api_server.method_missing(:inject_tlm, target_name, packet_name, item_hash, type: type, scope: scope, token: token)
    end

    def set_tlm(*args, type: :ALL, scope: $openc3_scope, token: $openc3_token)
      if args.length == 1
        puts "set_tlm(\"#{args.join('')}\", type: #{type})"
      else
        puts "set_tlm(\"#{args.join('", "')}\", type: #{type})"
      end
      $api_server.method_missing(:override_tlm, *args, type: type, scope: scope, token: token)
    end

    def override_tlm(*args, type: :ALL, scope: $openc3_scope, token: $openc3_token)
      if args.length == 1
        puts "override_tlm(\"#{args.join('')}\", type: #{type})"
      else
        puts "override_tlm(\"#{args.join('", "')}\", type: #{type})"
      end
      $api_server.method_missing(:override_tlm, *args, type: type, scope: scope, token: token)
    end

    def normalize_tlm(*args, type: :ALL, scope: $openc3_scope, token: $openc3_token)
      if args.length == 1
        puts "normalize_tlm(\"#{args.join('')}\", type: #{type})"
      else
        puts "normalize_tlm(\"#{args.join('", "')}\", type: #{type})"
      end
      $api_server.method_missing(:normalize_tlm, *args, type: type, scope: scope, token: token)
    end
  end
end
