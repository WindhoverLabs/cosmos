"use strict";(self.webpackChunkdocs_openc3_com=self.webpackChunkdocs_openc3_com||[]).push([[6001],{7604:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>c,metadata:()=>r,toc:()=>l});var i=t(5893),s=t(1151);const c={title:"COSMOS and NASA cFS"},o=void 0,r={id:"guides/cfs",title:"COSMOS and NASA cFS",description:"Working configuration",source:"@site/docs/guides/cfs.md",sourceDirName:"guides",slug:"/guides/cfs",permalink:"/docs/guides/cfs",draft:!1,unlisted:!1,editUrl:"https://github.com/OpenC3/cosmos/tree/main/docs.openc3.com/docs/guides/cfs.md",tags:[],version:"current",frontMatter:{title:"COSMOS and NASA cFS"},sidebar:"defaultSidebar",previous:{title:"Bridges",permalink:"/docs/guides/bridges"},next:{title:"Custom Widgets",permalink:"/docs/guides/custom-widgets"}},a={},l=[{value:"Working configuration",id:"working-configuration",level:2},{value:"Setting up COSMOS",id:"setting-up-cosmos",level:2},{value:"Configuring COSMOS",id:"configuring-cosmos",level:3},{value:"Setting up cFS",id:"setting-up-cfs",level:2},{value:"Clone cFS",id:"clone-cfs",level:3},{value:"Create Dockerfile in cFS dir",id:"create-dockerfile-in-cfs-dir",level:3},{value:"Build and run cFS",id:"build-and-run-cfs",level:3},{value:"Creating a COSMOS plugin for TM/TC interface with cFS",id:"creating-a-cosmos-plugin-for-tmtc-interface-with-cfs",level:2},{value:"Creating TM/TC definitions",id:"creating-tmtc-definitions",level:2},{value:"Uploading the plugin",id:"uploading-the-plugin",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h2,{id:"working-configuration",children:"Working configuration"}),"\n",(0,i.jsx)(n.p,{children:"This tutorial has been tested using the following components:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["COSMOS v5 release ",(0,i.jsx)(n.a,{href:"https://github.com/OpenC3/cosmos/releases/tag/v5.0.6",children:"5.0.6"})]}),"\n",(0,i.jsx)(n.li,{children:"cFS master-branch commit: 561b128 (June 1, 2022)"}),"\n",(0,i.jsx)(n.li,{children:"Docker Desktop 4.9.0 on Windows"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Replace all ",(0,i.jsx)(n.code,{children:"<xxxxxx>"})," with your matching paths and names. Example: ",(0,i.jsx)(n.code,{children:"<USERNAME>"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"setting-up-cosmos",children:"Setting up COSMOS"}),"\n",(0,i.jsxs)(n.p,{children:["Install COSMOS according to the official ",(0,i.jsx)(n.a,{href:"/docs/getting-started/installation",children:"installation"})," instructions."]}),"\n",(0,i.jsx)(n.h3,{id:"configuring-cosmos",children:"Configuring COSMOS"}),"\n",(0,i.jsxs)(n.p,{children:["Change the Docker configuration for the interoperability with NASA cFS. For\nsubscribing to the telemetry, you have to append a port binding in the file\n",(0,i.jsx)(n.code,{children:"compose.yaml"})," under the section ",(0,i.jsx)(n.code,{children:"openc3-operator"}),". The port number has to\nmatch with the port number cFS is sending the telemetry on."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'openc3-operator:\n  ports:\n    - "1235:1235/udp"\n'})}),"\n",(0,i.jsx)(n.p,{children:"Run COSMOS, the first run takes a while (~15 min)."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"openc3.sh start\n"})}),"\n",(0,i.jsxs)(n.p,{children:["When started, connect with a browser to ",(0,i.jsx)(n.a,{href:"http://localhost:2900",children:"http://localhost:2900"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"For shutting down COSMOS:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"openc3.sh stop\n"})}),"\n",(0,i.jsx)(n.h2,{id:"setting-up-cfs",children:"Setting up cFS"}),"\n",(0,i.jsxs)(n.p,{children:["To run ",(0,i.jsx)(n.a,{href:"https://github.com/nasa/cFS",children:"NASA cFS"})," as a Docker container do the following:"]}),"\n",(0,i.jsx)(n.h3,{id:"clone-cfs",children:"Clone cFS"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git clone --recurse-submodules https://github.com/nasa/cFS.git\n"})}),"\n",(0,i.jsx)(n.h3,{id:"create-dockerfile-in-cfs-dir",children:"Create Dockerfile in cFS dir"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-docker",children:'FROM ubuntu:22.10 AS builder\n\nARG DEBIAN_FRONTEND=noninteractive\nARG SIMULATION=native\nENV SIMULATION=${SIMULATION}\nARG BUILDTYPE=debug\nENV BUILDTYPE=${BUILDTYPE}\nARG OMIT_DEPRECATED=true\nENV OMIT_DEPRECATED=${OMIT_DEPRECATED}\n\nRUN \\\n  apt-get update && \\\n  apt-get -y upgrade && \\\n  apt-get install -y build-essential git cmake && \\\n  rm -rf /var/lib/apt/lists/*\n\nWORKDIR /cFS\nCOPY . .\n\nRUN git submodule init \\\n  && git submodule update \\\n  && cp cfe/cmake/Makefile.sample Makefile \\\n  && cp -r cfe/cmake/sample_defs .\n\nRUN make prep\nRUN make\nRUN make install\n\nFROM ubuntu:22.10\nCOPY --from=builder /cFS/build /cFS/build\nWORKDIR /cFS/build/exe/cpu1\nENTRYPOINT [ "./core-cpu1" ]\n'})}),"\n",(0,i.jsx)(n.h3,{id:"build-and-run-cfs",children:"Build and run cFS"}),"\n",(0,i.jsxs)(n.p,{children:["Note we're connecting to the COSMOS network (",(0,i.jsx)(n.code,{children:"docker network ls"}),") and exposing the cFS ports."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"docker build -t cfs .\ndocker run --cap-add CAP_SYS_RESOURCE --net=openc3-cosmos-network --name cfs -p1234:1234 -p1235:1235 cfs\n"})}),"\n",(0,i.jsx)(n.h2,{id:"creating-a-cosmos-plugin-for-tmtc-interface-with-cfs",children:"Creating a COSMOS plugin for TM/TC interface with cFS"}),"\n",(0,i.jsxs)(n.p,{children:["The detailed instructions how to create a plugin, can be found\n",(0,i.jsx)(n.a,{href:"/docs/getting-started/gettingstarted",children:"here"}),', in the chapter "Interfacing with Your Hardware".']}),"\n",(0,i.jsxs)(n.p,{children:["Create a new plugin with the name ",(0,i.jsx)(n.code,{children:"CFS"}),". ",(0,i.jsx)(n.code,{children:"CFS"})," is the name of the plugin and\nmust be in capital letters according to the COSMOS documentation. This command\nshould create the plugin structure."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# cd .. to the location of the cfs dir\n$PATH_TO_OPENC3/openc3.sh cli generate plugin CFS\n"})}),"\n",(0,i.jsx)(n.p,{children:"If you're on Linux, change the rights of this newly created plugin, because the COSMOS script\ncreates the plugin to be owned by the root user."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"sudo chown -R <USERNAME>:<USERGROUP> openc3-cfs\n"})}),"\n",(0,i.jsxs)(n.p,{children:["In this newly created plugin, change the ",(0,i.jsx)(n.code,{children:"plugin.txt"})," file, so that the\ncommunication happens over UDP. ",(0,i.jsx)(n.code,{children:"port_tm"})," is the port number on which cFS\nsends the telemetry messages. ",(0,i.jsx)(n.code,{children:"port_tc"})," indicates the port on which cFS listens to the\ntelecommands."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ruby",children:"VARIABLE ip 127.0.0.1\nVARIABLE port_tm 1235\nVARIABLE port_tc 1234\nVARIABLE cfs_target_name CFS\n\nTARGET CFS <%= cfs_target_name %>\n# hostname   write_dest_port   read_port   write_src_port   interface_address   ttl   write_timeout   read_timeout   bind_address\nINTERFACE <%= cfs_target_name %>_INT udp_interface.rb <%= ip %> <%= port_tc %> <%= port_tm %> nil nil 128 nil nil\n  MAP_TARGET <%= cfs_target_name %>\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Note that the two arguments to the ",(0,i.jsx)(n.code,{children:"TARGET"})," parameter are:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["the physical target name that should match the name of the plugin, i.e. ",(0,i.jsx)(n.code,{children:"CFS"}),".\nThis name must match the folder name in the ",(0,i.jsx)(n.code,{children:"targets"})," folder. Example: for the\n",(0,i.jsx)(n.code,{children:"CFS"})," plugin, the target specifications must be under\n",(0,i.jsx)(n.code,{children:"openc3-cfs/targets/CFS"}),". If you don't follow this\nconvention, the server will refuse to install your plugin at the following steps."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"the name of your target and how it is shown in the user interface."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["In this example, we keep both names to be ",(0,i.jsx)(n.code,{children:"CFS"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"creating-tmtc-definitions",children:"Creating TM/TC definitions"}),"\n",(0,i.jsx)(n.p,{children:"Change to the target folder and remove the existing files and create own files."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"cd openc3-cfs/targets/CFS/cmd_tlm\nrm *\ntouch cfs_cmds.txt\ntouch cfs_tlm.txt\ntouch to_lab_cmds.txt\n"})}),"\n",(0,i.jsx)(n.p,{children:"Open these newly created files in a text editor and fill them with following\ncontent."}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"to_lab_cmds.txt"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ruby",children:'COMMAND CFS TO_LAB_ENABLE BIG_ENDIAN "Enable telemetry"\n  #                   NAME      BITS TYPE   min VAL     max VAL    init VAL  DESCRIPTION\n  APPEND_ID_PARAMETER STREAM_ID  16  UINT   0x1880      0x1880     0x1880    "Stream ID"\n    FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER    SEQUENCE   16  UINT   0xC000      MAX_UINT16 0xC000    ""\n    FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER    PKT_LEN    16  UINT   0x0001      0xFFFF     0x0012    "length of the packet"\n  APPEND_PARAMETER    CMD_ID      8  UINT   6           6          6         ""\n  APPEND_PARAMETER    CHECKSUM    8  UINT   MIN_UINT8   MAX_UINT8  0x98      ""\n    FORMAT_STRING "0x%2X"\n  APPEND_PARAMETER    DEST_IP   144  STRING "127.0.0.1"                      "Destination IP, i.e. 172.16.9.112, pc-57"\n'})}),"\n",(0,i.jsx)(n.admonition,{title:"Enabling Telemetry",type:"info",children:(0,i.jsxs)(n.p,{children:["The command ",(0,i.jsx)(n.code,{children:"0x1880"})," is needed to enable telemetry. When the cFS receives\nthis command, it starts sending telemetry to the IP address provided via the\n",(0,i.jsx)(n.code,{children:"DEST_IP"})," field."]})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"cfs_cmds.txt"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ruby",children:'COMMAND CFS NOOP BIG_ENDIAN "NOOP Command"\n  # cFS primary header\n  APPEND_ID_PARAMETER    STREAM_ID   16   UINT   0x1882      0x1882      0x1882      "Packet Identification"\n      FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER       SEQUENCE    16   UINT   MIN_UINT16  MAX_UINT16  0xC000      ""\n      FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER       PKT_LEN     16   UINT   0x0001      0x0001      0x0001      "Packet length"\n  # cFS CMD secondary header\n  APPEND_PARAMETER       CMD_ID       8   UINT   0           0           0           ""\n  APPEND_PARAMETER       CHECKSUM     8   UINT   MIN_UINT8   MAX_UINT8   MIN_UINT8   ""\n\nCOMMAND CFS RESET BIG_ENDIAN "Reset Counters Command"\n  APPEND_ID_PARAMETER    STREAM_ID   16   UINT   0x1882      0x1882      0x1882      "Packet Identification"\n      FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER       SEQUENCE    16   UINT   MIN_UINT16  MAX_UINT16  0xC000      ""\n      FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER       PKT_LEN     16   UINT   0x0001      0x0001      0x0001      "Packet length"\n  APPEND_PARAMETER       CMD_ID       8   UINT   1           1           1           ""\n  APPEND_PARAMETER       CHECKSUM     8   UINT   MIN_UINT8   MAX_UINT8   MIN_UINT8   ""\n\nCOMMAND CFS PROCESS BIG_ENDIAN "Process Command"\n  APPEND_ID_PARAMETER    STREAM_ID   16   UINT   0x1882      0x1882      0x1882      "Packet Identification"\n      FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER       SEQUENCE    16   UINT   MIN_UINT16  MAX_UINT16  0xC000      ""\n      FORMAT_STRING "0x%04X"\n  APPEND_PARAMETER       PKT_LEN     16   UINT   0x0001      0x0001      0x0001      "Packet length"\n  APPEND_PARAMETER       CMD_ID       8   UINT   2           2           2           ""\n  APPEND_PARAMETER       CHECKSUM     8   UINT   MIN_UINT8   MAX_UINT8   MIN_UINT8   ""\n'})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"cfs_tlm.txt"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ruby",children:'TELEMETRY CFS HK BIG_ENDIAN "housekeeping telemetry"\n  #                NAME       BITS  TYPE    ID      DESCRIPTION\n  APPEND_ID_ITEM   STREAM_ID   16   UINT    0x0883  "Stream ID"\n    FORMAT_STRING "0x%04X"\n  APPEND_ITEM      SEQUENCE    16   UINT            "Packet Sequence"\n    FORMAT_STRING "0x%04X"\n  APPEND_ITEM      PKT_LEN     16   UINT            "Length of the packet"\n  # telemetry secondary header\n  APPEND_ITEM      SECONDS     32   UINT            ""\n        UNITS Seconds sec\n  APPEND_ITEM      SUBSECS     16   UINT            ""\n        UNITS Milliseconds ms\n  # some bytes not known for what\n  APPEND_ITEM      SPARE2ALIGN 32   UINT            "Spares"\n  # payload\n  APPEND_ITEM      CMD_ERRS     8   UINT            "Command Error Counter"\n  APPEND_ITEM      CMD_CNT      8   UINT            "Command Counter"\n  # spare / alignment\n  APPEND_ITEM      SPARE       16   UINT            "Spares"\n'})}),"\n",(0,i.jsx)(n.p,{children:"Build the plugin from the base of your plugin folder:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# cd openc3-cfs\n$PATH_TO_OPENC3/openc3.sh cli rake build VERSION=1.0.0\n"})}),"\n",(0,i.jsx)(n.admonition,{title:"Plugin versioning",type:"info",children:(0,i.jsx)(n.p,{children:"Do not forget to change the version number with every build if you want to\nbetter distinguish between the versions of the plugin. When the version is\nseen in the plugin's .gem file name, it is easier to visualize the existing\nversions and the newly uploaded versions."})}),"\n",(0,i.jsx)(n.admonition,{title:"Plugin parameters",type:"info",children:(0,i.jsxs)(n.p,{children:["Multiple parameters are available for the plugin configuration. See the ",(0,i.jsx)(n.a,{href:"/docs/configuration/plugins",children:"plugin"})," page."]})}),"\n",(0,i.jsx)(n.h2,{id:"uploading-the-plugin",children:"Uploading the plugin"}),"\n",(0,i.jsx)(n.p,{children:"After the plugin has been built, you can import the plugin in the admin area of\nthe page."}),"\n",(0,i.jsxs)(n.p,{children:["Connect with a browser to\n",(0,i.jsx)(n.a,{href:"http://localhost:2900/tools/admin",children:"http://localhost:2900/tools/admin"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["Click on the clip icon and navigate to where your plugin is stored and select\nthe ",(0,i.jsx)(n.code,{children:"openc3-cfs-1.0.0.xxx.gem"})," file. Right of the selection line click on ",(0,i.jsx)(n.code,{children:"UPLOAD"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Determine the IP address the cFS container and COSMOS operator container are running at:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'docker network ls\nNETWORK ID     NAME             DRIVER    SCOPE\nd842f813f1c7   openc3-cosmos-network   bridge    local\n\ndocker network inspect openc3-cosmos-network\n[\n    {\n        "Name": "openc3-cosmos-network",\n        ...\n        "Containers": {\n            "03cb6bf1b27c631fad1366e9342aeaa5b80f458a437195e4a95e674bb5f5983d": {\n                "Name": "cfs",\n                "IPv4Address": "172.20.0.9/16",\n            },\n            "ceb9ea99b00849fd8867dcd1646838fef3471f7d64b69014703dbedbcc8147fc": {\n                "Name": "openc3_openc3-operator_1",\n                "IPv4Address": "172.20.0.8/16",\n            }\n        }\n        ...\n    }\n]\n'})}),"\n",(0,i.jsxs)(n.p,{children:["When using this plugin, make sure to change the ",(0,i.jsx)(n.code,{children:"ip"})," variable during uploading\nto match where cFS is running. In the example above you would set it to 172.20.0.9.\n",(0,i.jsx)(n.code,{children:"port_tm"})," is the port number on which cFS is sending the telemetry messages.\n",(0,i.jsx)(n.code,{children:"port_tc"})," indicates the port on cFS is listening for telecommands."]}),"\n",(0,i.jsxs)(n.p,{children:["Under ",(0,i.jsx)(n.code,{children:"cfs_target_name"})," you can change the target name of this plugin. This\nstep is optional as long as you are fine with your plugin showing up as ",(0,i.jsx)(n.code,{children:"CFS"}),"."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Plugin Variable Settings",src:t(569).Z+"",width:"392",height:"500"})}),"\n",(0,i.jsx)(n.admonition,{title:"Port subscription",type:"warning",children:(0,i.jsx)(n.p,{children:"The last uploaded plugin on COSMOS will subscribe to TM on port 1235.\nOther plugins will not receive any TM anymore."})}),"\n",(0,i.jsx)(n.admonition,{title:"Typo errors",type:"info",children:(0,i.jsx)(n.p,{children:"Presence of typos in one of the plugin files can cause problems when uploading and installing\nthe plugin's .gem file. Make sure your configuration is typo-free."})}),"\n",(0,i.jsxs)(n.p,{children:["In the example above, the operator image is running at 172.20.0.8. To enable telemetry, go to the browser and connect to\n",(0,i.jsx)(n.a,{href:"http://localhost:2900/tools/cmdsender/CFS/TO_LAB_ENABLE",children:"http://localhost:2900/tools/cmdsender/CFS/TO_LAB_ENABLE"}),". Change the ",(0,i.jsx)(n.code,{children:"DEST_IP"})," to the IP address of the operator image (172.20.0.8) and send the command."]}),"\n",(0,i.jsxs)(n.p,{children:["Under ",(0,i.jsx)(n.a,{href:"http://localhost:2900/tools/cmdtlmserver/tlm-packets",children:"http://localhost:2900/tools/cmdtlmserver/tlm-packets"}),", you should see the incoming packets. Note in the CmdTlmServer you will also see CFS_INT UNKNOWN packets because we did not define the full cFS packet set. That exercise is left to the reader."]})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},569:(e,n,t)=>{t.d(n,{Z:()=>i});const i=t.p+"assets/images/plugin-variables-5bc00c744182c9a9591e84cb3bbb1c4deb53ff22e05f62ce1b807c26bed782e5.png"},1151:(e,n,t)=>{t.d(n,{Z:()=>r,a:()=>o});var i=t(7294);const s={},c=i.createContext(s);function o(e){const n=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(c.Provider,{value:n},e.children)}}}]);