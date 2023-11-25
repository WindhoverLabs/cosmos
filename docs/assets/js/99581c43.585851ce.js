"use strict";(self.webpackChunkdocs_openc3_com=self.webpackChunkdocs_openc3_com||[]).push([[1513],{9839:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>n,metadata:()=>d,toc:()=>r});var s=t(5893),o=t(1151);const n={title:"Custom Widgets"},l=void 0,d={id:"guides/custom-widgets",title:"Custom Widgets",description:"COSMOS allows you to build custom widgets which can be deployed with your plugin and used in Telemetry Viewer. Building custom widgets can utilitize any javascript frameworks but since COSMOS is written with Vue.js, we will use that framework in this tutorial.",source:"@site/docs/guides/custom-widgets.md",sourceDirName:"guides",slug:"/guides/custom-widgets",permalink:"/docs/guides/custom-widgets",draft:!1,unlisted:!1,editUrl:"https://github.com/OpenC3/cosmos/tree/main/docs.openc3.com/docs/guides/custom-widgets.md",tags:[],version:"current",frontMatter:{title:"Custom Widgets"},sidebar:"defaultSidebar",previous:{title:"COSMOS and NASA cFS",permalink:"/docs/guides/cfs"},next:{title:"Little Endian Bitfields",permalink:"/docs/guides/little-endian-bitfields"}},c={},r=[{value:"Custom Widgets",id:"custom-widgets",level:2},{value:"Helloworld Widget",id:"helloworld-widget",level:3}];function a(e){const i={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",img:"img",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(i.p,{children:["COSMOS allows you to build custom widgets which can be deployed with your ",(0,s.jsx)(i.a,{href:"/docs/configuration/plugins",children:"plugin"})," and used in ",(0,s.jsx)(i.a,{href:"/docs/tools/tlm-viewer",children:"Telemetry Viewer"}),". Building custom widgets can utilitize any javascript frameworks but since COSMOS is written with Vue.js, we will use that framework in this tutorial."]}),"\n",(0,s.jsx)(i.h2,{id:"custom-widgets",children:"Custom Widgets"}),"\n",(0,s.jsxs)(i.p,{children:["We're basically going to follow the COSMOS ",(0,s.jsx)(i.a,{href:"https://github.com/OpenC3/cosmos/tree/main/openc3-cosmos-init/plugins/packages/openc3-cosmos-demo",children:"Demo"})," and explain how that custom widget was created."]}),"\n",(0,s.jsxs)(i.p,{children:["If you look at the bottom of the Demo's ",(0,s.jsx)(i.a,{href:"https://github.com/OpenC3/cosmos/blob/main/openc3-cosmos-init/plugins/packages/openc3-cosmos-demo/plugin.txt",children:"plugin.txt"})," file you'll see we declare the widgets:"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-ruby",children:"WIDGET BIG\nWIDGET HELLOWORLD\n"})}),"\n",(0,s.jsxs)(i.p,{children:["When the plugin is deployed this causes COSMOS to look for the as-built widgets. For the BIG widget it will look for the widget at ",(0,s.jsx)(i.code,{children:"tools/widgets/BigWidget/BigWidget.umd.min.js"}),". Similarly it looks for HELLOWORLD at ",(0,s.jsx)(i.code,{children:"tools/widgets/HelloworldWidget/HelloworldWidget.umd.min.js"}),". These directories and file names may seem mysterious but it's all about how the widgets get built."]}),"\n",(0,s.jsx)(i.h3,{id:"helloworld-widget",children:"Helloworld Widget"}),"\n",(0,s.jsxs)(i.p,{children:["The Helloworld Widget source code is found in the plugin's src directory and is called ",(0,s.jsx)(i.a,{href:"https://github.com/OpenC3/cosmos/blob/main/openc3-cosmos-init/plugins/packages/openc3-cosmos-demo/src/HelloworldWidget.vue",children:"HelloworldWidget.vue"}),". The basic structure is as follows:"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-vue",children:'<template>\n  \x3c!-- Implement widget here --\x3e\n</template>\n\n<script>\nimport Widget from "@openc3/tool-common/src/components/widgets/Widget";\nexport default {\n  mixins: [Widget],\n  data() {\n    return {\n      // Reactive data items\n    };\n  },\n};\n<\/script>\n<style scoped>\n/* widget specific style */\n</style>\n'})}),"\n",(0,s.jsx)(i.admonition,{title:"Vue & Vuetify",type:"info",children:(0,s.jsxs)(i.p,{children:["For more information about how the COSMOS frontend is built (including all the Widgets) please check out ",(0,s.jsx)(i.a,{href:"https://vuejs.org",children:"Vue.js"})," and ",(0,s.jsx)(i.a,{href:"https://vuetifyjs.com",children:"Vuetify"}),"."]})}),"\n",(0,s.jsxs)(i.p,{children:["To build this custom widget we changed the Demo ",(0,s.jsx)(i.a,{href:"https://github.com/OpenC3/cosmos/blob/main/openc3-cosmos-init/plugins/packages/openc3-cosmos-demo/Rakefile",children:"Rakefile"})," to call ",(0,s.jsx)(i.code,{children:"yarn run build"})," when the plugin is built. ",(0,s.jsx)(i.code,{children:"yarn run XXX"})," looks for 'scripts' to run in the ",(0,s.jsx)(i.a,{href:"https://github.com/OpenC3/cosmos/blob/main/openc3-cosmos-init/plugins/packages/openc3-cosmos-demo/package.json",children:"package.json"})," file. If we open package.json we find the following:"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-json",children:'  "scripts": {\n    "build": "vue-cli-service build --target lib --dest tools/widgets/HelloworldWidget --formats umd-min src/HelloworldWidget.vue --name HelloworldWidget && vue-cli-service build --target lib --dest tools/widgets/BigWidget --formats umd-min src/BigWidget.vue --name BigWidget"\n  },\n'})}),"\n",(0,s.jsxs)(i.p,{children:["This uses the ",(0,s.jsx)(i.code,{children:"vue-cli-service"})," to build the code found at ",(0,s.jsx)(i.code,{children:"src/HelloworldWidget.vue"})," and formats as ",(0,s.jsx)(i.code,{children:"umd-min"})," and puts it in the ",(0,s.jsx)(i.code,{children:"tools/widgets/HelloworldWidget"})," directory. So this is why the plugin looks for the plugin at ",(0,s.jsx)(i.code,{children:"tools/widgets/HelloworldWidget/HelloworldWidget.umd.min.js"}),". Click ",(0,s.jsx)(i.a,{href:"https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-build",children:"here"})," for the ",(0,s.jsx)(i.code,{children:"vue-cli-service build"})," documentation."]}),"\n",(0,s.jsxs)(i.p,{children:["If you look at the Demo plugin's ",(0,s.jsx)(i.a,{href:"https://github.com/OpenC3/cosmos/blob/main/openc3-cosmos-init/plugins/packages/openc3-cosmos-demo/targets/INST/screens/simple.txt",children:"simple.txt"})," screen you'll see we're using the widgets:"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-ruby",children:"SCREEN AUTO AUTO 0.5\nLABELVALUE <%= target_name %> HEALTH_STATUS CCSDSSEQCNT\nHELLOWORLD\nBIG <%= target_name %> HEALTH_STATUS TEMP1\n"})}),"\n",(0,s.jsx)(i.p,{children:"Opening this screen in Telemetry Viewer results in the following:"}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.img,{alt:"Simple Screen",src:t(8888).Z+"",width:"734",height:"212"})}),"\n",(0,s.jsx)(i.p,{children:"While this is a simple example the possibilities with custom widgets are limitless!"})]})}function u(e={}){const{wrapper:i}={...(0,o.a)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8888:(e,i,t)=>{t.d(i,{Z:()=>s});const s=t.p+"assets/images/simple_screen-3c9d6d2366c716c03a301396a4ce0ea418532890f349d9bc9ebb8be90983a6e6.png"},1151:(e,i,t)=>{t.d(i,{Z:()=>d,a:()=>l});var s=t(7294);const o={},n=s.createContext(o);function l(e){const i=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function d(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:l(e.components),s.createElement(n.Provider,{value:i},e.children)}}}]);