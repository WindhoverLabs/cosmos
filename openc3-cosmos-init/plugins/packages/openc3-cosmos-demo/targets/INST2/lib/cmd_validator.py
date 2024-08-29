# Copyright 2024 OpenC3, Inc.
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

# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.

from openc3.packets.command_validator import CommandValidator


class CmdValidator(CommandValidator):
    def pre_check(self, command):
        self.cmd_acpt_cnt = tlm("INST HEALTH_STATUS CMD_ACPT_CNT")
        return [True, None]

    def post_check(self, command):
        if command.packet_name == "CLEAR":
            wait_check("INST HEALTH_STATUS CMD_ACPT_CNT == 0", 10)
        else:
            wait_check(f"INST HEALTH_STATUS CMD_ACPT_CNT > {self.cmd_acpt_cnt}", 10)
        return [True, None]
