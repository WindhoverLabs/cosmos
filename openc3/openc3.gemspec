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

require 'rbconfig'

# Create the overall gemspec
spec = Gem::Specification.new do |s|
  s.name = 'openc3'
  s.summary = 'OpenC3'
  s.description =  <<-EOF
    OpenC3 provides all the functionality needed to send
    commands to and receive data from one or more embedded systems
    referred to as "targets". Out of the box functionality includes:
    Telemetry Display, Telemetry Graphing, Operational and Test Scripting,
    Command Sending, Logging, and more.
  EOF
  s.authors = ['Ryan Melton', 'Jason Thomas']
  s.email = ['ryan@openc3.com', 'jason@openc3.com']
  s.homepage = 'https://github.com/OpenC3/openc3'

  if RUBY_ENGINE == 'ruby'
    s.platform = Gem::Platform::RUBY
  elsif RUBY_ENGINE == 'jruby'
    s.platform = "java"
  else
    s.platform = Gem::Platform::CURRENT
  end

  s.version = '5.0.9.pre.beta0'
  s.licenses = ['AGPL-3.0-only', 'Nonstandard']

  # Executables
  s.executables << 'openc3cli'
  s.executables << 'rubysloc'
  s.executables << 'cstol_converter'

  if RUBY_ENGINE == 'ruby'
    # Ruby C Extensions - MRI Only
    s.extensions << 'ext/openc3/ext/array/extconf.rb'
    s.extensions << 'ext/openc3/ext/buffered_file/extconf.rb'
    s.extensions << 'ext/openc3/ext/config_parser/extconf.rb'
    s.extensions << 'ext/openc3/ext/openc3_io/extconf.rb'
    s.extensions << 'ext/openc3/ext/crc/extconf.rb'
    s.extensions << 'ext/openc3/ext/packet/extconf.rb'
    s.extensions << 'ext/openc3/ext/platform/extconf.rb'
    s.extensions << 'ext/openc3/ext/polynomial_conversion/extconf.rb'
    s.extensions << 'ext/openc3/ext/string/extconf.rb'
    s.extensions << 'ext/openc3/ext/tabbed_plots_config/extconf.rb'
    s.extensions << 'ext/openc3/ext/telemetry/extconf.rb'
    s.extensions << 'ext/mkrf_conf.rb'
  end

  # Files are defined in Manifest.txt
  s.files = Dir.glob("{bin,data,ext,lib,spec,tasks,templates,test}/**/*") + %w(Gemfile Guardfile LICENSE.txt Rakefile README.md)

  s.required_ruby_version = '>= 2.7'

  # Runtime Dependencies
  s.add_runtime_dependency 'bundler',   '~> 2.1'
  s.add_runtime_dependency 'rdoc',      '~> 6.4'
  s.add_runtime_dependency 'rake',      '~> 13.0'
  s.add_runtime_dependency 'json',      '~> 2.6'
  s.add_runtime_dependency 'yard',      '~> 0.9'
  s.add_runtime_dependency 'uuidtools', '~> 2.1'
  s.add_runtime_dependency 'snmp',      '~> 1.3'
  s.add_runtime_dependency 'rubyzip',   '~> 2.3'
  s.add_runtime_dependency 'nokogiri',  '~> 1.13'
  s.add_runtime_dependency 'puma',      '~> 5.5'
  s.add_runtime_dependency 'rack',      '~> 2.2.3.1'
  s.add_runtime_dependency 'redis',     '~> 4.5'
  s.add_runtime_dependency 'psych',     '~> 4.0'
  s.add_runtime_dependency 'matrix',    '~> 0.4' # bundled gem in Ruby 3.1
  s.add_runtime_dependency 'httpclient', '~> 2.8'
  s.add_runtime_dependency 'aws-sdk-s3', '~> 1.109'
  s.add_runtime_dependency 'tzinfo-data', '~> 1.2021'
  s.add_runtime_dependency 'ffi', '~> 1.15' # Required by childprocess on Windows
  s.add_runtime_dependency 'childprocess', '~> 4.1'
  s.add_runtime_dependency 'connection_pool', '~> 2.2'
  s.add_runtime_dependency 'rufus-scheduler', '~> 3.8'

  # Development Dependencies
  s.add_development_dependency 'dead_end', '~> 4.0'
  s.add_development_dependency 'diff-lcs', '~> 1.4' if RUBY_ENGINE == 'ruby' # Get latest for MRI
  s.add_development_dependency 'rspec', '~> 3.10'
  s.add_development_dependency 'flog', '~> 4.6'
  s.add_development_dependency 'flay', '~> 2.12'
  s.add_development_dependency 'reek', '~> 6.0'
  s.add_development_dependency 'listen', '~> 3.7'
  s.add_development_dependency 'mock_redis', '~> 0.29'
  # s.add_development_dependency 'guard', '~> 2.0'
  # s.add_development_dependency 'guard-bundler', '~> 2.0'
  # s.add_development_dependency 'guard-rspec', '~> 4.0'
  s.add_development_dependency 'simplecov', '~> 0.21'
  s.add_development_dependency 'codecov', '~> 0.6'
  s.add_development_dependency 'benchmark-ips', '~> 2.9'
  s.add_development_dependency 'ruby-prof', '~> 1.4' if RUBY_ENGINE == 'ruby' # MRI Only
  s.add_development_dependency 'rspec_junit_formatter', '~> 0.4'

  s.post_install_message = "Thanks for installing OpenC3!\n"
end