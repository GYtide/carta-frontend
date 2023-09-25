"use strict";(self.webpackChunkcarta_frontend_docs=self.webpackChunkcarta_frontend_docs||[]).push([[626],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>u});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=n.createContext({}),l=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},c=function(e){var t=l(e.components);return n.createElement(o.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=l(a),f=r,u=d["".concat(o,".").concat(f)]||d[f]||m[f]||i;return a?n.createElement(u,s(s({ref:t},c),{},{components:a})):n.createElement(u,s({ref:t},c))}));function u(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,s=new Array(i);s[0]=f;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p[d]="string"==typeof e?e:r,s[1]=p;for(var l=2;l<i;l++)s[l]=a[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}f.displayName="MDXCreateElement"},1610:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>s,default:()=>m,frontMatter:()=>i,metadata:()=>p,toc:()=>l});var n=a(7462),r=(a(7294),a(3905));const i={sidebar_position:1},s="Quick start",p={unversionedId:"code-snippet-tutorial/quick-start",id:"code-snippet-tutorial/quick-start",title:"Quick start",description:"Enabling code snippets",source:"@site/docs/code-snippet-tutorial/quick-start.md",sourceDirName:"code-snippet-tutorial",slug:"/code-snippet-tutorial/quick-start",permalink:"/carta-frontend/docs/code-snippet-tutorial/quick-start",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"docsSidebar",previous:{title:"Code snippet tutorial",permalink:"/carta-frontend/docs/category/code-snippet-tutorial"},next:{title:"Basics",permalink:"/carta-frontend/docs/code-snippet-tutorial/basics"}},o={},l=[{value:"Enabling code snippets",id:"enabling-code-snippets",level:2},{value:"Loading images",id:"loading-images",level:2},{value:"Closing images",id:"closing-images",level:2}],c={toc:l},d="wrapper";function m(e){let{components:t,...i}=e;return(0,r.kt)(d,(0,n.Z)({},c,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"quick-start"},"Quick start"),(0,r.kt)("h2",{id:"enabling-code-snippets"},"Enabling code snippets"),(0,r.kt)("p",null,"The code snippet feature can be enabled via the preferences dialog:"),(0,r.kt)("img",{src:a(9644).Z,alt:"Enable code snippets",width:"500"}),(0,r.kt)("p",null,'Once the code snippet feature is enabled, the "Snippets" option appears in the menu. This allows you to create and run code snippets, providing additional functionality to CARTA.'),(0,r.kt)("h2",{id:"loading-images"},"Loading images"),(0,r.kt)("p",null,"CARTA functions and objects can be accessed via the top-level ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore"},(0,r.kt)("inlineCode",{parentName:"a"},"app"))," object (or the ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore"},(0,r.kt)("inlineCode",{parentName:"a"},"carta"))," alias). In the following example, we display the welcome splash screen for 1000 ms and then close it."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"carta.showSplashScreen();\nawait carta.delay(1000);\napp.hideSplashScreen();\n")),(0,r.kt)("p",null,"Images loaded in the frontend are referred as and registered in the ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#frames"},(0,r.kt)("inlineCode",{parentName:"a"},"frames"))," array which contains each frame (i.e., image) as a ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/FrameStore"},(0,r.kt)("inlineCode",{parentName:"a"},"FrameStore"))," object. The currently active frame is accessible with ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#activeFrame"},(0,r.kt)("inlineCode",{parentName:"a"},"activeFrame")),". In the following example, we firstly list the frames array, then list the 0th frame, and finally list the current active frame in the console."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"console.log(app.frames);\nconsole.log(app.frames[0]);\nconsole.log(app.activeFrame);\n")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#openFile"},(0,r.kt)("inlineCode",{parentName:"a"},"openFile")),' takes up to three arguments: directory, filename and HDU. If no HDU is provided, the first HDU ("0") is adopted. The directory and filename can also be combined into a single argument. ',(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#openFile"},(0,r.kt)("inlineCode",{parentName:"a"},"openFile"))," must be called with ",(0,r.kt)("inlineCode",{parentName:"p"},"await"),", as it is an asynchronous function that requires communicating with the backend. In the following example, in the end we will see that only the last image is loaded as each ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#openFile"},(0,r.kt)("inlineCode",{parentName:"a"},"openFile"))," will close all loaded image first before loading the target image."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'await app.openFile("test_directory", "testfile.fits", "0");\nawait app.openFile("test_directory", "testfile.fits");\nawait app.openFile("test_directory/testfile.fits");\n')),(0,r.kt)("p",null,"Additional images can be appended using ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#appendFile"},(0,r.kt)("inlineCode",{parentName:"a"},"appendFile")),". The arguments are the same as ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#openFile"},(0,r.kt)("inlineCode",{parentName:"a"},"openFile")),". In the following example, in the end there will be three images loaded."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'const file1 = await app.openFile("testfile1.fits");\nconst file2 = await app.appendFile("testfile2.fits");\nconst file3 = await app.appendFile("testfile3.fits");\n')),(0,r.kt)("p",null,"The active image can be changed with ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#setActiveFrame"},(0,r.kt)("inlineCode",{parentName:"a"},"setActiveFrame")),", as well as the wrapper functions ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#setActiveFrameById"},(0,r.kt)("inlineCode",{parentName:"a"},"setActiveFrameById"))," and ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#setActiveFrameByIndex"},(0,r.kt)("inlineCode",{parentName:"a"},"setActiveFrameByIndex")),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"app.setActiveFrameByIndex(0);\napp.setActiveFrameById(file2.frameInfo.fileId);\napp.setActiveFrame(file3);\n")),(0,r.kt)("h2",{id:"closing-images"},"Closing images"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#closeCurrentFile"},(0,r.kt)("inlineCode",{parentName:"a"},"closeCurrentFile"))," closes the active image. There will be no user confirmation if the active image serves as the spatial reference image and there are other images matched to it."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"app.closeCurrentFile();\n")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#closeFile"},(0,r.kt)("inlineCode",{parentName:"a"},"closeFile"))," takes an optional boolean argument to control whether user confirmation is required if other images are matched to the given file. This defaults to true. ",(0,r.kt)("inlineCode",{parentName:"p"},"await")," is required to delay execution until the user confirms."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"await app.closeFile(file1);\napp.closeFile(file1, false); // No user confirmation\n")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore/#closeOtherFiles"},(0,r.kt)("inlineCode",{parentName:"a"},"closeOtherFiles"))," closes all images other than the given file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"app.closeOtherFiles(file2);\n")),(0,r.kt)("p",null,"For all functions and objects availble in the ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore"},(0,r.kt)("inlineCode",{parentName:"a"},"app"))," object, please refer to the ",(0,r.kt)("a",{parentName:"p",href:"/api/.-stores/class/AppStore"},"API documentation"),"."))}m.isMDXComponent=!0},9644:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/enable-code-snippets-99ec31276237f43c9b4df4ed9a34e54a.png"}}]);