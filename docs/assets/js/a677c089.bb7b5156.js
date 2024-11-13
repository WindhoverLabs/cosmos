"use strict";(self.webpackChunkdocs_openc3_com=self.webpackChunkdocs_openc3_com||[]).push([[7452],{8617:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"configuration/interfaces","title":"Interfaces","description":"Built-in COSMOS interfaces including how to create one","source":"@site/docs/configuration/interfaces.md","sourceDirName":"configuration","slug":"/configuration/interfaces","permalink":"/docs/configuration/interfaces","draft":false,"unlisted":false,"editUrl":"https://github.com/OpenC3/cosmos/tree/main/docs.openc3.com/docs/configuration/interfaces.md","tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6,"title":"Interfaces","description":"Built-in COSMOS interfaces including how to create one","sidebar_custom_props":{"myEmoji":"\ud83d\udca1"}},"sidebar":"defaultSidebar","previous":{"title":"Telemetry","permalink":"/docs/configuration/telemetry"},"next":{"title":"Protocols","permalink":"/docs/configuration/protocols"}}');var i=n(4848),o=n(8453);const s={sidebar_position:6,title:"Interfaces",description:"Built-in COSMOS interfaces including how to create one",sidebar_custom_props:{myEmoji:"\ud83d\udca1"}},c=void 0,a={},d=[{value:"Provided Interfaces",id:"provided-interfaces",level:2},{value:"TCPIP Client Interface",id:"tcpip-client-interface",level:3},{value:"TCPIP Server Interface",id:"tcpip-server-interface",level:3},{value:"UDP Interface",id:"udp-interface",level:3},{value:"Serial Interface",id:"serial-interface",level:3},{value:"Streams",id:"streams",level:2},{value:"Protocols",id:"protocols",level:2}];function l(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:["Interfaces are the connection to the external embedded systems called targets. Interfaces are defined by the top level ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface-1",children:"INTERFACE"})," keyword in the plugin.txt file."]}),"\n",(0,i.jsxs)(t.p,{children:["Interface classes provide the code that COSMOS uses to receive real-time telemetry from targets and to send commands to targets. The interface that a target uses could be anything (TCP/IP, serial, GPIB, Firewire, etc.), therefore it is important that this is a customizable portion of any reusable Command and Telemetry System. Fortunately the most common form of interfaces are over TCP/IP sockets, and COSMOS provides interface solutions for these. This guide will discuss how to use these interface classes, and how to create your own. Note that in most cases you can extend interfaces with ",(0,i.jsx)(t.a,{href:"/docs/configuration/protocols",children:"Protocols"})," rather than implementing a new interface."]}),"\n",(0,i.jsx)(t.admonition,{title:"Interface and Routers Are Very Similar",type:"info",children:(0,i.jsx)(t.p,{children:"Note that Interfaces and Routers are very similar and share the same configuration parameters. Routers are simply Interfaces which route an existing Interface's telemetry data out to the connected target and routes the connected target's commands back to the original Interface's target."})}),"\n",(0,i.jsx)(t.p,{children:"Interfaces have the following methods that must be implemented:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"connect"})," - Open the socket or port or somehow establish the connection to the target. Note: This method may not block indefinitely. Be sure to call super() in your implementation."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"connected?"})," - Return true or false depending on the connection state. Note: This method should return immediately."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"disconnect"})," - Close the socket or port of somehow disconnect from the target. Note: This method may not block indefinitely. Be sure to call super() in your implementation."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"read_interface"})," - Lowest level read of data on the interface. Note: This method should block until data is available or the interface disconnects. On a clean disconnect it should return nil."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"write_interface"})," - Lowest level write of data on the interface. Note: This method may not block indefinitely."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"Interfaces also have the following methods that exist and have default implementations. They can be overridden if necessary but be sure to call super() to allow the default implementation to be executed."}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"read_interface_base"})," - This method should always be called from read_interface(). It updates interface specific variables that are displayed by CmdTLmServer including the bytes read count, the most recent raw data read, and it handles raw logging if enabled."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"write_interface_base"})," - This method should always be called from write_interface(). It updates interface specific variables that are displayed by CmdTLmServer including the bytes written count, the most recent raw data written, and it handles raw logging if enabled."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"read"})," - Read the next packet from the interface. COSMOS implements this method to allow the Protocol system to operate on the data and the packet before it is returned."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"write"})," - Send a packet to the interface. COSMOS implements this method to allow the Protocol system to operate on the packet and the data before it is sent."]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"write_raw"})," - Send a raw binary string of data to the target. COSMOS implements this method by basically calling write_interface with the raw data."]}),"\n"]}),"\n",(0,i.jsx)(t.admonition,{title:"Naming Conventions",type:"warning",children:(0,i.jsx)(t.p,{children:'When creating your own interfaces, in most cases they will be subclasses of one of the built-in interfaces described below. It is important to know that both the filename and class name of the interface files must match with correct capitalization or you will receive "class not found" errors when trying to load your new interface. For example, an interface file called labview_interface.rb must contain the class LabviewInterface. If the class was named, LabVIEWInterface, for example, COSMOS would not be able to find the class because of the unexpected capitalization.'})}),"\n",(0,i.jsx)(t.h2,{id:"provided-interfaces",children:"Provided Interfaces"}),"\n",(0,i.jsxs)(t.p,{children:["COSMOS provides the following interfaces for use: TCPIP Client, TCPIP Server, UDP, and Serial. The interface to use is defined by the ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface",children:"INTERFACE"})," and ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#router",children:"ROUTER"})," keywords."]}),"\n",(0,i.jsx)(t.h3,{id:"tcpip-client-interface",children:"TCPIP Client Interface"}),"\n",(0,i.jsx)(t.p,{children:"The TCPIP client interface connects to a TCPIP socket to send commands and receive telemetry. This interface is used for targets which open a socket and wait for a connection. This is the most common type of interface."}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Parameter"}),(0,i.jsx)(t.th,{children:"Description"}),(0,i.jsx)(t.th,{children:"Required"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Host"}),(0,i.jsx)(t.td,{children:"Machine name to connect to"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Port"}),(0,i.jsx)(t.td,{children:"Port to write commands to (can be the same as read port). Pass nil / None to make the interface read only."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Port"}),(0,i.jsx)(t.td,{children:"Port to read telemetry from (can be the same as write port). Pass nil / None to make the interface write only."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the write"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the read. Pass nil / None to block on read."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Protocol Type"}),(0,i.jsx)(t.td,{children:"See Protocols."}),(0,i.jsx)(t.td,{children:"No"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Protocol Arguments"}),(0,i.jsx)(t.td,{children:"See Protocols for the arguments each stream protocol takes."}),(0,i.jsx)(t.td,{children:"No"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Ruby Examples:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8081 10.0 nil LENGTH 0 16 0 1 BIG_ENDIAN 4 0xBA5EBA11\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil FIXED 6 0 nil true\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil PREIDENTIFIED 0xCAFEBABE\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 10.0 # no built-in protocol\n"})}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Python Examples:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8081 10.0 None LENGTH 0 16 0 1 BIG_ENDIAN 4 0xBA5EBA11\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 None BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 None FIXED 6 0 None true\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 None PREIDENTIFIED 0xCAFEBABE\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 10.0 # no built-in protocol\n"})}),"\n",(0,i.jsxs)(t.p,{children:["See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface",children:"INTERFACE"})," for a description of the INTERFACE keyword. See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface-modifiers",children:"Interface Modifiers"})," for a description of the keywords which can follow the INTERFACE keyword."]}),"\n",(0,i.jsx)(t.h3,{id:"tcpip-server-interface",children:"TCPIP Server Interface"}),"\n",(0,i.jsx)(t.p,{children:"The TCPIP server interface creates a TCPIP server which listens for incoming connections and dynamically creates sockets which communicate with the target. This interface is used for targets which open a socket and try to connect to a server."}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Parameter"}),(0,i.jsx)(t.th,{children:"Description"}),(0,i.jsx)(t.th,{children:"Required"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Port"}),(0,i.jsx)(t.td,{children:"Port to write commands to (can be the same as read port)"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Port"}),(0,i.jsx)(t.td,{children:"Port to read telemetry from (can be the same as write port)"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the write"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the read. Pass nil / None to block on read."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Protocol Type"}),(0,i.jsx)(t.td,{children:"See Protocols."}),(0,i.jsx)(t.td,{children:"No"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Protocol Arguments"}),(0,i.jsx)(t.td,{children:"See Protocols for the arguments each stream protocol takes."}),(0,i.jsx)(t.td,{children:"No"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Ruby Examples:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME tcpip_server_interface.rb 8080 8081 10.0 nil LENGTH 0 16 0 1 BIG_ENDIAN 4 0xBA5EBA11\nINTERFACE INTERFACE_NAME tcpip_server_interface.rb 8080 8080 10.0 nil BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME tcpip_server_interface.rb 8080 8080 10.0 nil FIXED 6 0 nil true\nINTERFACE INTERFACE_NAME tcpip_server_interface.rb 8080 8080 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb 8080 8080 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME tcpip_server_interface.rb 8080 8080 10.0 nil PREIDENTIFIED 0xCAFEBABE\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb 8080 8080 10.0 10.0 # no built-in protocol\n"})}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Python Examples:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME openc3/interfaces/tcpip_server_interface.py 8080 8081 10.0 None LENGTH 0 16 0 1 BIG_ENDIAN 4 0xBA5EBA11\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_server_interface.py 8080 8080 10.0 None BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_server_interface.py 8080 8080 10.0 None FIXED 6 0 None true\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_server_interface.py 8080 8080 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py 8080 8080 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_server_interface.py 8080 8080 10.0 None PREIDENTIFIED 0xCAFEBABE\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py 8080 8080 10.0 10.0 # no built-in protocol\n"})}),"\n",(0,i.jsxs)(t.p,{children:["See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface",children:"INTERFACE"})," for a description of the INTERFACE keyword. See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface-modifiers",children:"Interface Modifiers"})," for a description of the keywords which can follow the INTERFACE keyword. Note, TcpipServerInterface processes the ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#option",children:"OPTION"})," modifier."]}),"\n",(0,i.jsx)(t.h3,{id:"udp-interface",children:"UDP Interface"}),"\n",(0,i.jsx)(t.p,{children:"The UDP interface uses UDP packets to send and receive telemetry from the target."}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Parameter"}),(0,i.jsx)(t.th,{children:"Description"}),(0,i.jsx)(t.th,{children:"Required"}),(0,i.jsx)(t.th,{children:"Default"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Host"}),(0,i.jsx)(t.td,{children:"Host name or IP address of the machine to send and receive data with"}),(0,i.jsx)(t.td,{children:"Yes"}),(0,i.jsx)(t.td,{})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Dest Port"}),(0,i.jsx)(t.td,{children:"Port on the remote machine to send commands to"}),(0,i.jsx)(t.td,{children:"Yes"}),(0,i.jsx)(t.td,{})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Port"}),(0,i.jsx)(t.td,{children:"Port on the remote machine to read telemetry from"}),(0,i.jsx)(t.td,{children:"Yes"}),(0,i.jsx)(t.td,{})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Source Port"}),(0,i.jsx)(t.td,{children:"Port on the local machine to send commands from"}),(0,i.jsx)(t.td,{children:"No"}),(0,i.jsx)(t.td,{children:"nil (socket is not bound to an outgoing port)"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Interface Address"}),(0,i.jsx)(t.td,{children:"If the remote machine supports multicast the interface address is used to configure the outgoing multicast address"}),(0,i.jsx)(t.td,{children:"No"}),(0,i.jsx)(t.td,{children:"nil (not used)"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"TTL"}),(0,i.jsx)(t.td,{children:"Time to Live. The number of intermediate routers allowed before dropping the packet."}),(0,i.jsx)(t.td,{children:"No"}),(0,i.jsx)(t.td,{children:"128 (Windows)"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the write"}),(0,i.jsx)(t.td,{children:"No"}),(0,i.jsx)(t.td,{children:"10.0"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the read"}),(0,i.jsx)(t.td,{children:"No"}),(0,i.jsx)(t.td,{children:"nil (block on read)"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Ruby Example:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME udp_interface.rb host.docker.internal 8080 8081 8082 nil 128 10.0 nil\n"})}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Python Example:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME openc3/interfaces/udp_interface.py host.docker.internal 8080 8081 8082 None 128 10.0 None\n"})}),"\n",(0,i.jsxs)(t.p,{children:["See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface",children:"INTERFACE"})," for a description of the INTERFACE keyword. See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface-modifiers",children:"Interface Modifiers"})," for a description of the keywords which can follow the INTERFACE keyword."]}),"\n",(0,i.jsx)(t.h3,{id:"serial-interface",children:"Serial Interface"}),"\n",(0,i.jsx)(t.p,{children:"The serial interface connects to a target over a serial port. COSMOS provides drivers for both Windows and POSIX drivers for UNIX based systems. The Serial Interface is currently only implemented in Ruby."}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Parameter"}),(0,i.jsx)(t.th,{children:"Description"}),(0,i.jsx)(t.th,{children:"Required"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Port"}),(0,i.jsx)(t.td,{children:"Name of the serial port to write, e.g. 'COM1' or '/dev/ttyS0'. Pass nil / None to disable writing."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Port"}),(0,i.jsx)(t.td,{children:"Name of the serial port to read, e.g. 'COM1' or '/dev/ttyS0'. Pass nil / None to disable reading."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Baud Rate"}),(0,i.jsx)(t.td,{children:"Baud rate to read and write"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Parity"}),(0,i.jsx)(t.td,{children:"Serial port parity. Must be 'NONE', 'EVEN', or 'ODD'."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Stop Bits"}),(0,i.jsx)(t.td,{children:"Number of stop bits, e.g. 1."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Write Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the write"}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Read Timeout"}),(0,i.jsx)(t.td,{children:"Number of seconds to wait before aborting the read. Pass nil / None to block on read."}),(0,i.jsx)(t.td,{children:"Yes"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Protocol Type"}),(0,i.jsx)(t.td,{children:"See Protocols."}),(0,i.jsx)(t.td,{children:"No"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:"Protocol Arguments"}),(0,i.jsx)(t.td,{children:"See Protocols for the arguments each stream protocol takes."}),(0,i.jsx)(t.td,{children:"No"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:"plugin.txt Ruby Examples:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME serial_interface.rb COM1 COM1 9600 NONE 1 10.0 nil LENGTH 0 16 0 1 BIG_ENDIAN 4 0xBA5EBA11\nINTERFACE INTERFACE_NAME serial_interface.rb /dev/ttyS1 /dev/ttyS1 38400 ODD 1 10.0 nil BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME serial_interface.rb COM2 COM2 19200 EVEN 1 10.0 nil FIXED 6 0 nil true\nINTERFACE INTERFACE_NAME serial_interface.rb COM4 COM4 115200 NONE 1 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME serial_interface.rb COM4 COM4 115200 NONE 1 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME serial_interface.rb /dev/ttyS0 /dev/ttyS0 57600 NONE 1 10.0 nil PREIDENTIFIED 0xCAFEBABE\nINTERFACE INTERFACE_NAME serial_interface.rb COM4 COM4 115200 NONE 1 10.0 10.0 # no built-in protocol\n"})}),"\n",(0,i.jsxs)(t.p,{children:["See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface",children:"INTERFACE"})," for a description of the INTERFACE keyword. See ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#interface-modifiers",children:"Interface Modifiers"})," for a description of the keywords which can follow the INTERFACE keyword. Note, SerialInterface processes the ",(0,i.jsx)(t.a,{href:"/docs/configuration/plugins#option",children:"OPTION"})," modifier."]}),"\n",(0,i.jsx)(t.h2,{id:"streams",children:"Streams"}),"\n",(0,i.jsx)(t.p,{children:"Streams are low level classes that implement read, read_nonblock, write, connect, connected? and disconnect methods. The built-in Stream classes are SerialStream, TcpipSocketStream and TcpipClientStream and they are automatically used when creating a Serial Interface, TCP/IP Server Interface, or TCP/IP Client Interface."}),"\n",(0,i.jsx)(t.h2,{id:"protocols",children:"Protocols"}),"\n",(0,i.jsx)(t.p,{children:"Protocols define the behaviour of an Interface, including differentiating packet boundaries and modifying data as necessary. COSMOS defines the following built-in protocols which can be used with the above interfaces:"}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Name"}),(0,i.jsx)(t.th,{children:"Description"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#burst-protocol",children:"Burst"})}),(0,i.jsx)(t.td,{children:"Reads as much data as possible from the interface"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#fixed-protocol",children:"Fixed"})}),(0,i.jsx)(t.td,{children:"Processes fixed length packets with a known ID position"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#length-protocol",children:"Length"})}),(0,i.jsx)(t.td,{children:"Processes a length field at a fixed location and then reads the remainder of the data"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#terminated-protocol",children:"Terminated"})}),(0,i.jsx)(t.td,{children:"Delineates packets uses termination characters at the end of each packet"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#template-protocol",children:"Template"})}),(0,i.jsx)(t.td,{children:"Processes text based command / response data such as SCPI interfaces"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#preidentified-protocol",children:"Preidentified"})}),(0,i.jsx)(t.td,{children:"Internal COSMOS protocol used by COSMOS tools"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:"These protocols are declared directly after the interface:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil FIXED 6 0 nil true\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8081 10.0 nil LENGTH 0 16 0 1 BIG_ENDIAN 4\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil PREIDENTIFIED 0xCAFEBABE\n"})}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 None BURST 4 0xDEADBEEF\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 None FIXED 6 0 None true\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8081 10.0 None LENGTH 0 16 0 1 BIG_ENDIAN 4\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 10.0 TERMINATED 0x0D0A 0x0D0A true 0 0xF005BA11\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 10.0 TEMPLATE 0xA 0xA\nINTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.py host.docker.internal 8080 8080 10.0 None PREIDENTIFIED 0xCAFEBABE\n"})}),"\n",(0,i.jsx)(t.p,{children:"COSMOS also defines the following helper protocols:"}),"\n",(0,i.jsxs)(t.table,{children:[(0,i.jsx)(t.thead,{children:(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.th,{children:"Name"}),(0,i.jsx)(t.th,{children:"Description"})]})}),(0,i.jsxs)(t.tbody,{children:[(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#crc-protocol",children:"CRC"})}),(0,i.jsx)(t.td,{children:"Adds CRCs to outgoing packets and verifies CRCs on incoming packets"})]}),(0,i.jsxs)(t.tr,{children:[(0,i.jsx)(t.td,{children:(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#ignore-packet-protocol",children:"Ignore"})}),(0,i.jsx)(t.td,{children:"Ignores the specified packet by dropping it"})]})]})]}),"\n",(0,i.jsx)(t.p,{children:"These protocols are declared after the INTERFACE:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 nil BURST 4 0xDEADBEEF\n  TARGET TGT\n  PROTOCOL WRITE CrcProtocol CRC # See the documentation for parameters\n"})}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-ruby",children:"INTERFACE INTERFACE_NAME openc3/interfaces/tcpip_client_interface.rb host.docker.internal 8080 8080 10.0 None BURST 4 0xDEADBEEF\n  TARGET TGT\n  PROTOCOL WRITE CrcProtocol CRC # See the documentation for parameters\n"})}),"\n",(0,i.jsx)(t.p,{children:"Note the first parameter after the PROTOCOL keyword is how to apply the protocol: READ, WRITE, or READ_WRITE. Read applies the protocol on incoming packets (telemetry) and write on outgoing packets (commands). The next parameter is the protocol filename or class name. All other parameters are protocol specific."}),"\n",(0,i.jsxs)(t.p,{children:["In addition, you can define your own protocols which are declared like the COSMOS helper protocols after your interface. See the ",(0,i.jsx)(t.a,{href:"/docs/configuration/protocols#custom-protocols",children:"Custom Protocols"})," documentation for more information."]}),"\n",(0,i.jsx)(t.admonition,{title:"Protocol Run Order",type:"info",children:(0,i.jsx)(t.p,{children:"Read protocols execute in the order specified (First specified runs first). Write protocols execute in the reverse order (Last specified executes first)."})})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>c});var r=n(6540);const i={},o=r.createContext(i);function s(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);