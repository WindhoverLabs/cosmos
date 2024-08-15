# encoding: ascii-8bit

# Copyright 2022 Ball Aerospace & Technologies Corp.
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

# Modified by OpenC3, Inc.
# All changes Copyright 2022, OpenC3, Inc.
# All Rights Reserved
#
# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.

require 'spec_helper'
require 'fileutils'
require 'openc3/models/target_model'
require 'openc3/models/microservice_model'
require 'openc3/utilities/aws_bucket'
require 'openc3/utilities/s3_autoload'

module OpenC3
  AwsS3Client = 'Aws::S3::Client'

  describe TargetModel, type: :model do
    before(:each) do
      mock_redis()
      #model = ScopeModel.new(name: "DEFAULT")
      #model.create
    end

    describe "self.get" do
      it "returns the specified model" do
        model = TargetModel.new(folder_name: "TEST", name: "TEST2", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        target = TargetModel.get(name: "TEST2", scope: "DEFAULT")
        expect(target["name"]).to eql "TEST2"
        expect(target["folder_name"]).to eql "TEST"
      end
    end

    describe "self.names" do
      it "returns all model names" do
        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "OTHER", name: "OTHER", scope: "OTHER")
        model.create
        names = TargetModel.names(scope: "DEFAULT")
        # contain_exactly doesn't care about ordering and neither do we
        expect(names).to contain_exactly("TEST", "SPEC")
        names = TargetModel.names(scope: "OTHER")
        expect(names).to contain_exactly("OTHER")
      end
    end

    describe "self.all" do
      it "returns all the parsed targets" do
        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        all = TargetModel.all(scope: "DEFAULT")
        expect(all).to_not be_nil
        expect(all.keys).to contain_exactly("TEST", "SPEC")
      end
    end

    describe "render" do
      it "renders" do
        template = '_template.erb'
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        Dir.mktmpdir do |tmpdir|
          tf = File.open(File.join(tmpdir, template), 'w')
          tf.puts "CMD_LOG_CYCLE_TIME 1"
          tf.close
          model.render(File.expand_path(tf.path), {opt1: '1', opt2: '2', opt3: '3'})
          # where does the rendered value go?
        end
      end
    end

    # self.all_modified & self.download aren't unit tested because it's basically just mocking the entire S3 API

    describe "self.all_modified" do
      xit "returns all the modified targets" do
        s3 = instance_double(AwsS3Client)
        allow(Aws::S3::Client).to receive(:new).and_return(s3)
        options = OpenStruct.new
        options.key = "blah"
        objs = double("Object", :contents => [options], is_truncated: false)

        allow(s3).to receive(:list_objects_v2).and_return(objs)
        #allow(s3).to receive(:common_prefixes)

        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        expect { all = TargetModel.all_modified(scope: "DEFAULT") }.not_to  \
          raise_error(/received unexpected message :common_prefixes/)
        #expect(all.keys).to contain_exactly("TEST", "SPEC")
      end
    end

    describe "self.modified_files" do
      xit "returns all the modified files" do
        s3 = instance_double(AwsS3Client)
        allow(Aws::S3::Client).to receive(:new).and_return(s3)
        options = OpenStruct.new
        options.key = "blah"
        objs = double("Object", :contents => [options], is_truncated: false)
        allow(s3).to receive(:list_objects_v2).and_return(objs)

        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        expect { mods = TargetModel.modified_files('TEST', scope: "DEFAULT") }.not_to \
          raise_error(NoMethodError, /undefined method `join' for nil/)
        #expect(mods.keys).to contain_exactly("TEST", "SPEC")
      end
    end

    describe "self.delete_modified" do
      it "returns all the deleted or modified whatnots" do
        s3 = instance_double(AwsS3Client)
        allow(Aws::S3::Client).to receive(:new).and_return(s3)
        options = OpenStruct.new
        options.key = "blah"
        objs = double("Object", :contents => [options], is_truncated: false)
        allow(s3).to receive(:list_objects_v2).and_return(objs)

        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        dels = TargetModel.delete_modified('TEST', scope: "DEFAULT")
=begin
Oh, joy.
        puts 'OpenStruct key="blah"'.encoding.to_s
        puts 'OpenStruct key="blah"'.bytes.to_s

        puts dels[0].to_s.encoding.to_s
        puts dels[0].to_s.bytes.to_s

ASCII-8BIT
[79, 112, 101, 110, 83, 116, 114, 117, 99, 116, 32, 107, 101, 121, 61, 34, 98, 108, 97, 104, 34]

UTF-8
[35, 60, 79, 112, 101, 110, 83, 116, 114, 117, 99, 116, 32, 107, 101, 121, 61, 34, 98, 108, 97, 104, 34, 62]
=end

        #expect(dels[0]).to match(/<OpenStruct key="blah">/) #match(/Error deleting object bucket/)
      end
    end

    describe "self.download" do
      xit "returns all the downloads" do
        s3 = instance_double(AwsS3Client)
        allow(Aws::S3::Client).to receive(:new).and_return(s3)
        options = OpenStruct.new
        options.key = "DEFAULT"
        objs = double("Object", :contents => [options], is_truncated: false)
        allow(s3).to receive(:list_objects_v2).and_return(objs)
        allow(s3).to receive(:get_object).and_return(objs)

        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        model = TargetModel.new(folder_name: "SPEC", name: "SPEC", scope: "DEFAULT")
        model.create
        expect { TargetModel.download('TEST', scope: "DEFAULT") }.not_to \
          raise_error(/No such file or directory/)
      end
    end

    describe "self.packets" do
      before(:each) do
        setup_system()
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['INST'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
        model = TargetModel.new(folder_name: "EMPTY", name: "EMPTY", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['EMPTY'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
      end

      it "can set packet" do
        pkts = TargetModel.packets("INST", type: :TLM, scope: "DEFAULT")
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        TargetModel.set_packet('INST', 'ADCS', pkts[0], type: :TLM, scope: "DEFAULT")
      end

      it "can self.dynamic update" do
        pkts = TargetModel.packets("TEST", type: :TLM, scope: "DEFAULT")
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        expect { TargetModel.dynamic_update(pkts, cmd_or_tlm = :TELEMETRY, filename = "dynamic_tlm.txt") }.to \
          raise_error(RuntimeError, /Target 'TEST' does not exist for scope: DEFAULT/)
      rescue RuntimeError => e
        puts e.message
      end

      it "can dynamic update" do
        pkts = TargetModel.packets("TEST", type: :TLM, scope: "DEFAULT")
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        expect { model.dynamic_update(pkts, cmd_or_tlm = :TELEMETRY, filename = "dynamic_tlm.txt") }.to \
          raise_error(RuntimeError, /Target 'TEST' does not exist for scope: DEFAULT/)
      rescue RuntimeError => e
        puts e.message
      end

      it "calls limits_groups" do
        TargetModel.limits_groups(scope: 'DEFAULT')
      end

      it "gets item-to-packet map" do
        TargetModel.get_item_to_packet_map("INST", scope: "DEFAULT")
      end

      it "raises for an unknown type" do
        expect { TargetModel.packets("INST", type: :OTHER, scope: "DEFAULT") }.to raise_error(/Unknown type OTHER/)
      end

      it "raises for a non-existant target" do
        expect { TargetModel.packets("BLAH", scope: "DEFAULT") }.to raise_error("Target 'BLAH' does not exist for scope: DEFAULT")
      end

      it "returns all telemetry packets" do
        pkts = TargetModel.packets("INST", type: :TLM, scope: "DEFAULT")
        # Verify result is Array of packet Hashes
        expect(pkts).to be_a Array
        names = []
        pkts.each do |pkt|
          expect(pkt).to be_a Hash
          expect(pkt['target_name']).to eql "INST"
          names << pkt['packet_name']
        end
        expect(names).to include("ADCS", "HEALTH_STATUS", "PARAMS", "IMAGE", "MECH")
      end

      it "returns empty array for no telemetry packets" do
        pkts = TargetModel.packets("EMPTY", type: :TLM, scope: "DEFAULT")
        # Verify result is Array of packet Hashes
        expect(pkts).to be_a Array
        expect(pkts).to be_empty
      end

      it "returns packet hash if the command exists" do
        pkts = TargetModel.packets("INST", type: :CMD, scope: "DEFAULT")
        expect(pkts).to be_a Array
        names = []
        pkts.each do |pkt|
          expect(pkt).to be_a Hash
          expect(pkt['target_name']).to eql "INST"
          expect(pkt['items']).to be_a Array
          names << pkt['packet_name']
        end
        expect(names).to include("ABORT", "COLLECT", "CLEAR") # Spot check
      end

      it "returns empty array for no command packets" do
        pkts = TargetModel.packets("EMPTY", type: :CMD, scope: "DEFAULT")
        # Verify result is Array of packet Hashes
        expect(pkts).to be_a Array
        expect(pkts).to be_empty
      end
    end

    describe "self.all_packet_name_descriptions" do
      before(:each) do
        setup_system()
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['INST'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
        model = TargetModel.new(folder_name: "EMPTY", name: "EMPTY", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['EMPTY'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
      end

      it "returns only the packet_name and description" do
        pkts = TargetModel.all_packet_name_descriptions("INST", type: :TLM, scope: "DEFAULT")
        # Verify result is Array of packet Hashes
        expect(pkts).to be_a Array
        pkts.each do |pkt|
          expect(pkt).to be_a Hash
          expect(pkt.keys).to eql(%w(packet_name description))
        end
      end
    end

    describe "self.packet" do
      before(:each) do
        setup_system()
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['INST'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
      end

      it "raises for an unknown type" do
        expect { TargetModel.packet("INST", "HEALTH_STATUS", type: :OTHER, scope: "DEFAULT") }.to raise_error(/Unknown type OTHER/)
      end

      it "raises for a non-existant target" do
        expect { TargetModel.packet("BLAH", "HEALTH_STATUS", type: :TLM, scope: "DEFAULT") }.to raise_error("Packet 'BLAH HEALTH_STATUS' does not exist")
      end

      it "raises for a non-existant packet" do
        expect { TargetModel.packet("INST", "BLAH", type: :TLM, scope: "DEFAULT") }.to raise_error("Packet 'INST BLAH' does not exist")
      end

      it "returns packet hash if the telemetry exists" do
        pkt = TargetModel.packet("INST", "HEALTH_STATUS", type: :TLM, scope: "DEFAULT")
        expect(pkt['target_name']).to eql "INST"
        expect(pkt['packet_name']).to eql "HEALTH_STATUS"
      end

      it "returns packet hash if the command exists" do
        pkt = TargetModel.packet("INST", "ABORT", type: :CMD, scope: "DEFAULT")
        expect(pkt['target_name']).to eql "INST"
        expect(pkt['packet_name']).to eql "ABORT"
      end
    end

    describe "self.packet_item" do
      before(:each) do
        setup_system()
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['INST'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
      end

      it "raises for an unknown type" do
        expect { TargetModel.packet_item("INST", "HEALTH_STATUS", "CCSDSVER", type: :OTHER, scope: "DEFAULT") }.to raise_error(/Unknown type OTHER/)
      end

      it "raises for a non-existant target" do
        expect { TargetModel.packet_item("BLAH", "HEALTH_STATUS", "CCSDSVER", scope: "DEFAULT") }.to raise_error("Packet 'BLAH HEALTH_STATUS' does not exist")
      end

      it "raises for a non-existant packet" do
        expect { TargetModel.packet_item("INST", "BLAH", "CCSDSVER", scope: "DEFAULT") }.to raise_error("Packet 'INST BLAH' does not exist")
      end

      it "raises for a non-existant item" do
        expect { TargetModel.packet_item("INST", "HEALTH_STATUS", "BLAH", scope: "DEFAULT") }.to raise_error("Item 'INST HEALTH_STATUS BLAH' does not exist")
      end

      it "returns item hash if the telemetry item exists" do
        item = TargetModel.packet_item("INST", "HEALTH_STATUS", "CCSDSVER", scope: "DEFAULT")
        expect(item['name']).to eql "CCSDSVER"
        expect(item['bit_offset']).to eql 0
      end

      it "returns item hash if the command item exists" do
        item = TargetModel.packet_item("INST", "ABORT", "CCSDSVER", type: :CMD, scope: "DEFAULT")
        expect(item['name']).to eql "CCSDSVER"
        expect(item['bit_offset']).to eql 0
      end
    end

    describe "self.packet_items" do
      before(:each) do
        setup_system()
        model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT")
        model.create
        model.update_store(System.new(['INST'], File.join(SPEC_DIR, 'install', 'config', 'targets')))
      end

      it "raises for an unknown type" do
        expect { TargetModel.packet_items("INST", "HEALTH_STATUS", ["CCSDSVER"], type: :OTHER, scope: "DEFAULT") }.to raise_error(/Unknown type OTHER/)
      end

      it "raises for a non-existant target" do
        expect { TargetModel.packet_items("BLAH", "HEALTH_STATUS", ["CCSDSVER"], scope: "DEFAULT") }.to raise_error("Packet 'BLAH HEALTH_STATUS' does not exist")
      end

      it "raises for a non-existant packet" do
        expect { TargetModel.packet_items("INST", "BLAH", ["CCSDSVER"], scope: "DEFAULT") }.to raise_error("Packet 'INST BLAH' does not exist")
      end

      it "raises for non-existant items" do
        expect { TargetModel.packet_items("INST", "HEALTH_STATUS", ["BLAH"], scope: "DEFAULT") }.to \
          raise_error("Item(s) 'INST HEALTH_STATUS BLAH' does not exist")
        expect { TargetModel.packet_items("INST", "HEALTH_STATUS", ["CCSDSVER", "BLAH"], scope: "DEFAULT") }.to \
          raise_error("Item(s) 'INST HEALTH_STATUS BLAH' does not exist")
        expect { TargetModel.packet_items("INST", "HEALTH_STATUS", [:BLAH, :NOPE], scope: "DEFAULT") }.to \
          raise_error("Item(s) 'INST HEALTH_STATUS BLAH', 'INST HEALTH_STATUS NOPE' does not exist")
      end

      it "returns item hash array if the telemetry items exists" do
        items = TargetModel.packet_items("INST", "HEALTH_STATUS", ["CCSDSVER", "CCSDSTYPE"], scope: "DEFAULT")
        expect(items.length).to eql 2
        expect(items[0]['name']).to eql "CCSDSVER"
        expect(items[0]['bit_offset']).to eql 0
        expect(items[1]['name']).to eql "CCSDSTYPE"

        # Verify it also works with symbols
        items = TargetModel.packet_items("INST", "HEALTH_STATUS", [:CCSDSVER, :CCSDSTYPE], scope: "DEFAULT")
        expect(items.length).to eql 2
        expect(items[0]['name']).to eql "CCSDSVER"
        expect(items[0]['bit_offset']).to eql 0
        expect(items[1]['name']).to eql "CCSDSTYPE"
      end

      it "returns item hash array if the command items exists" do
        items = TargetModel.packet_items("INST", "ABORT", ["CCSDSVER", "CCSDSTYPE"], type: :CMD, scope: "DEFAULT")
        expect(items.length).to eql 2
        expect(items[0]['name']).to eql "CCSDSVER"
        expect(items[0]['bit_offset']).to eql 0
        expect(items[1]['name']).to eql "CCSDSTYPE"
      end
    end

    describe "self.handle_config" do
      it "only recognizes TARGET" do
        parser = double("ConfigParser").as_null_object
        expect(parser).to receive(:verify_num_parameters)
        TargetModel.handle_config(parser, "TARGET", ["TEST", "TEST"], scope: "DEFAULT")
        expect { TargetModel.handle_config(parser, "TARGETS", ["TEST", "TEST"], scope: "DEFAULT") }.to raise_error(ConfigParser::Error)
      end
    end

    describe "initialize" do
      it "requires name and scope" do
        expect { TargetModel.new(folder_name: "TEST", name: "TEST") }.to raise_error(ArgumentError)
        expect { TargetModel.new(folder_name: "TEST", scope: "DEFAULT") }.to raise_error(ArgumentError)
        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        expect(model).to_not be_nil
      end
    end

    describe "create" do
      it "stores model based on scope and class name" do
        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        keys = Store.scan(0)
        # This is an implementation detail but Redis keys are pretty critical so test it
        expect(keys[1]).to include("DEFAULT__openc3_targets").at_most(1).times
        # 21/07/2021 - G this needed to be changed to contain OPENC3__TOKEN
      end
    end

    describe "as_json" do
      it "encodes all the input parameters" do
        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        json = model.as_json(:allow_nan => true)
        expect(json['name']).to eq "TEST"
        params = model.method(:initialize).parameters
        params.each do |_type, name|
          # Scope isn't included in as_json as it is part of the key used to get the model
          next if name == :scope

          expect(json.key?(name.to_s)).to be true
        end
      end
    end

    describe "handle_config" do
      it "parses tool specific keywords" do
        model = TargetModel.new(folder_name: "TEST", name: "TEST", scope: "DEFAULT")
        model.create
        parser = ConfigParser.new
        tf = Tempfile.new
        tf.puts "CMD_LOG_CYCLE_TIME 1"
        tf.puts "CMD_LOG_CYCLE_SIZE 2"
        tf.puts "CMD_DECOM_LOG_CYCLE_TIME 3"
        tf.puts "CMD_DECOM_LOG_CYCLE_SIZE 4"
        tf.puts "CMD_BUFFER_DEPTH 9"
        tf.puts "CMD_LOG_RETAIN_TIME 10"
        tf.puts "CMD_DECOM_LOG_RETAIN_TIME 12"
        tf.puts "TLM_BUFFER_DEPTH 13"
        tf.puts "TLM_LOG_RETAIN_TIME 14"
        tf.puts "TLM_DECOM_LOG_RETAIN_TIME 15"
        tf.puts "REDUCED_MINUTE_LOG_RETAIN_TIME 16"
        tf.puts "REDUCED_HOUR_LOG_RETAIN_TIME 17"
        tf.puts "REDUCED_DAY_LOG_RETAIN_TIME 18"
        tf.puts "LOG_RETAIN_TIME 19"
        tf.puts "REDUCED_LOG_RETAIN_TIME 20"
        tf.puts "REDUCER_DISABLED 21"
        tf.puts "REDUCER_MAX_CPU_UTILIZATION 22"
        tf.puts "REDUCED_MAX_CPU_UTILIZATION 23"
        tf.puts "CLEANUP_POLL_TIME 24"
        tf.puts "TARGET_MICROSERVICE DECOM"
        tf.puts "PACKET REDUCER"
        tf.puts "PACKET DECOM"
        tf.puts "DISABLE_ERB"
        tf.puts "TARGET_MICROSERVICE CLEANUP"
        tf.puts "TLM_LOG_CYCLE_TIME 5"
        tf.puts "TLM_LOG_CYCLE_SIZE 6"
        tf.puts "TLM_DECOM_LOG_CYCLE_TIME 7"
        tf.puts "TLM_DECOM_LOG_CYCLE_SIZE 8"
        tf.close
        parser.parse_file(tf.path) do |keyword, params|
          model.handle_config(parser, keyword, params)
        end
        json = model.as_json(:allow_nan => true)
        expect(json['cmd_log_cycle_time']).to eql 1
        expect(json['cmd_log_cycle_size']).to eql 2
        expect(json['cmd_decom_log_cycle_time']).to eql 3
        expect(json['cmd_decom_log_cycle_size']).to eql 4
        expect(json['tlm_log_cycle_time']).to eql 5
        expect(json['tlm_log_cycle_size']).to eql 6
        expect(json['tlm_decom_log_cycle_time']).to eql 7
        expect(json['tlm_decom_log_cycle_size']).to eql 8
        tf.unlink
      end
    end

    describe "deploy" do
      before(:each) do
        @scope = "DEFAULT"
        @target = "INST"
        @s3 = instance_double(AwsS3Client) # .as_null_object
        allow(@s3).to receive(:put_object)
        allow(Aws::S3::Client).to receive(:new).and_return(@s3)
        @target_dir = File.join(SPEC_DIR, "install", "config")
      end

      it "raises if the target can't be found" do
        @target_dir = Dir.pwd
        variables = { "test" => "example" }
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        expect { model.deploy(@target_dir, variables) }.to raise_error(/No target files found/)
      end

      it "copies the target files to S3" do
        Dir.glob("#{@target_dir}/targets/#{@target}/**/*") do |filename|
          next unless File.file?(filename)

          # Files are stored in S3 with <SCOPE>/<TARGET NAME>/<file path>
          # Splitting on 'config' gives us the target and path so just prepend the scope
          filename = "#{@scope}#{filename.split("config")[-1]}"
          expect(@s3).to receive(:put_object).with(bucket: 'config', key: filename, body: anything, cache_control: nil, content_type: nil, metadata: nil, checksum_algorithm: anything)
        end
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        model.deploy(@target_dir, {})
      end

      it "creates target_id.txt as a hash" do
        file = "DEFAULT/targets/INST/target_id.txt"
        expect(@s3).to receive(:put_object).with(bucket: 'config', key: file, body: anything, cache_control: nil, content_type: nil, metadata: nil, checksum_algorithm: anything)
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        model.deploy(@target_dir, {})
      end

      it "archives the target to S3" do
        file = "DEFAULT/target_archives/INST/INST_current.zip"
        expect(@s3).to receive(:put_object).with(bucket: 'config', key: file, body: anything, cache_control: nil, content_type: nil, metadata: nil, checksum_algorithm: anything)
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        model.deploy(@target_dir, {})
      end

      it "puts the packets in Redis" do
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        model.deploy(@target_dir, {})
        expect(Store.hkeys("DEFAULT__openc3tlm__INST")).to include("HEALTH_STATUS", "ADCS", "PARAMS", "IMAGE", "MECH")
        expect(Store.hkeys("DEFAULT__openc3cmd__INST")).to include("ABORT", "COLLECT", "CLEAR") # ... etc

        # Spot check a telemetry packet and a command
        telemetry = TargetModel.packet(@target, "HEALTH_STATUS", type: :TLM, scope: @scope)
        expect(telemetry['target_name']).to eql @target
        expect(telemetry['packet_name']).to eql "HEALTH_STATUS"
        expect(telemetry['items'].length).to be > 10
        command = TargetModel.packet(@target, "ABORT", type: :CMD, scope: @scope)
        expect(command['target_name']).to eql @target
        expect(command['packet_name']).to eql "ABORT"
        expect(command['items'].length).to be > 10
      end

      it "creates and deploys Target microservices" do
        variables = { "test" => "example" }
        umodel = double(MicroserviceModel)
        expect(umodel).to receive(:create).exactly(7).times
        expect(umodel).to receive(:deploy).with(@target_dir, variables).exactly(7).times
        # Verify the microservices that are started
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__COMMANDLOG__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__DECOMCMDLOG__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__PACKETLOG__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__DECOMLOG__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__DECOM__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__REDUCER__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        expect(MicroserviceModel).to receive(:new).with(hash_including(
                                                          name: "#{@scope}__MULTI__#{@target}",
                                                          plugin: 'PLUGIN',
                                                          scope: @scope
                                                        )).and_return(umodel)
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        capture_io do |stdout|
          model.deploy(@target_dir, variables)
          expect(stdout.string).to include("#{@scope}__COMMANDLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__DECOMCMDLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__PACKETLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__DECOMLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__DECOM__#{@target}")
          expect(stdout.string).to include("#{@scope}__REDUCER__#{@target}")
        end
      end

      it "deploys no microservices if no commands or telemetry" do
        @target = "EMPTY"
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        capture_io do |stdout|
          model.deploy(@target_dir, {})
          expect(stdout.string).to_not include("#{@scope}__COMMANDLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__DECOMCMDLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__PACKETLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__DECOMLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__DECOM__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__REDUCER__#{@target}")
        end
        expect(MicroserviceModel.names()).to be_empty
      end

      it "deploys only command microservices if no telemetry" do
        @target = "EMPTY"
        FileUtils.mkdir_p("#{@target_dir}/targets/#{@target}/cmd_tlm")
        File.open("#{@target_dir}/targets/#{@target}/cmd_tlm/cmd.txt", 'w') do |file|
          file.puts 'COMMAND INST CMD LITTLE_ENDIAN "Command"'
          file.puts '  APPEND_ID_PARAMETER ID 8 UINT 1 1 1 "ID"'
        end
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        capture_io do |stdout|
          model.deploy(@target_dir, {})
          expect(stdout.string).to include("#{@scope}__COMMANDLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__DECOMCMDLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__PACKETLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__DECOMLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__DECOM__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__REDUCER__#{@target}")
        end
        expect(MicroserviceModel.names()).to include(
          "#{@scope}__COMMANDLOG__#{@target}",
          "#{@scope}__DECOMCMDLOG__#{@target}")
        FileUtils.rm_rf("#{@target_dir}/targets/#{@target}/cmd_tlm")
      end

      it "deploys only telemetry microservices if no commands" do
        @target = "EMPTY"
        FileUtils.mkdir_p("#{@target_dir}/targets/#{@target}/cmd_tlm")
        File.open("#{@target_dir}/targets/#{@target}/cmd_tlm/tlm.txt", 'w') do |file|
          file.puts 'TELEMETRY INST TLM LITTLE_ENDIAN "Telemetry"'
          file.puts '  APPEND_ID_ITEM ID 8 UINT 1 "ID"'
        end
        model = TargetModel.new(folder_name: @target, name: @target, scope: @scope, plugin: 'PLUGIN')
        model.create
        capture_io do |stdout|
          model.deploy(@target_dir, {})
          expect(stdout.string).to_not include("#{@scope}__COMMANDLOG__#{@target}")
          expect(stdout.string).to_not include("#{@scope}__DECOMCMDLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__PACKETLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__DECOMLOG__#{@target}")
          expect(stdout.string).to include("#{@scope}__DECOM__#{@target}")
          expect(stdout.string).to include("#{@scope}__REDUCER__#{@target}")
        end
        expect(MicroserviceModel.names()).to include(
          "#{@scope}__PACKETLOG__#{@target}",
          "#{@scope}__DECOMLOG__#{@target}",
          "#{@scope}__DECOM__#{@target}",
          "#{@scope}__REDUCER__#{@target}")
        FileUtils.rm_rf("#{@target_dir}/targets/#{@target}/cmd_tlm")
      end
    end

    describe "destroy" do
      before(:each) do
        @s3 = instance_double(AwsS3Client)
        allow(@s3).to receive(:put_object)
        objs = double("Object", :contents => [], is_truncated: false)
        allow(@s3).to receive(:list_objects_v2).and_return(objs)
        allow(Aws::S3::Client).to receive(:new).and_return(@s3)
        @target_dir = File.join(SPEC_DIR, "install", "config")
      end

      it "works on created but not deployed instances" do
        model = TargetModel.new(name: "UNKNOWN", scope: "DEFAULT")
        model.create
        tgt = JSON.parse(Store.hget("DEFAULT__openc3_targets", "UNKNOWN"))
        expect(tgt['name']).to eql "UNKNOWN"
        model.destroy
        tgt = Store.hget("DEFAULT__openc3_targets", "UNKNOWN")
        expect(tgt).to be nil
      end

      it "destroys any deployed Target microservices" do
        orig_keys = get_all_redis_keys()
        # Add in the keys that remain when a target is destroyed
        orig_keys << "DEFAULT__CONFIG"
        orig_keys << "DEFAULT__openc3cmd__UNKNOWN"
        orig_keys << "DEFAULT__openc3tlm__UNKNOWN"
        orig_keys << "DEFAULT__limits_sets"
        orig_keys << "DEFAULT__tlm__UNKNOWN"
        orig_keys << "openc3_microservices"

        umodel = double(MicroserviceModel)
        expect(umodel).to receive(:destroy).exactly(18).times
        expect(MicroserviceModel).to receive(:get_model).and_return(umodel).exactly(18).times
        inst_model = TargetModel.new(folder_name: "INST", name: "INST", scope: "DEFAULT", plugin: "INST_PLUGIN")
        inst_model.create
        inst_model.deploy(@target_dir, {})

        config = ConfigTopic.read(scope: 'DEFAULT')
        expect(config[0][1]['kind']).to eql 'created'
        expect(config[0][1]['type']).to eql 'target'
        expect(config[0][1]['name']).to eql 'INST'
        expect(config[0][1]['plugin']).to eql 'INST_PLUGIN'

        sys_model = TargetModel.new(folder_name: "SYSTEM", name: "SYSTEM", scope: "DEFAULT", plugin: "SYSTEM_PLUGIN")
        sys_model.create
        sys_model.deploy(@target_dir, {})

        config = ConfigTopic.read(scope: 'DEFAULT')
        expect(config[0][1]['kind']).to eql 'created'
        expect(config[0][1]['type']).to eql 'target'
        expect(config[0][1]['name']).to eql 'SYSTEM'
        expect(config[0][1]['plugin']).to eql 'SYSTEM_PLUGIN'

        keys = get_all_redis_keys()
        # Spot check some keys
        expect(keys).to include("DEFAULT__CONFIG")
        expect(keys).to include("DEFAULT__limits_sets")
        expect(keys).to include("DEFAULT__limits_groups")
        expect(keys).to include("DEFAULT__openc3_targets")
        expect(keys).to include("DEFAULT__openc3cmd__INST")
        expect(keys).to include("DEFAULT__openc3tlm__INST")
        targets = Store.hgetall("DEFAULT__openc3_targets")
        expect(targets.keys).to include("INST")

        inst_model.destroy
        config = ConfigTopic.read(scope: 'DEFAULT')
        expect(config[0][1]['kind']).to eql 'deleted'
        expect(config[0][1]['type']).to eql 'target'
        expect(config[0][1]['name']).to eql 'INST'
        expect(config[0][1]['plugin']).to eql 'INST_PLUGIN'

        sys_model.destroy
        config = ConfigTopic.read(scope: 'DEFAULT')
        expect(config[0][1]['kind']).to eql 'deleted'
        expect(config[0][1]['type']).to eql 'target'
        expect(config[0][1]['name']).to eql 'SYSTEM'
        expect(config[0][1]['plugin']).to eql 'SYSTEM_PLUGIN'

        targets = Store.hgetall("DEFAULT__openc3_targets")
        expect(targets.keys).to_not include("INST")
        keys = get_all_redis_keys()
        expect(orig_keys.sort).to eql keys.sort
      end
    end
  end
end
