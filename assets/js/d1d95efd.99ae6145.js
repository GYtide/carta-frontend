"use strict";(self.webpackChunkcarta_frontend_docs=self.webpackChunkcarta_frontend_docs||[]).push([[499],{6916:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>r,toc:()=>p});var i=n(5893),o=n(1151);const s={sidebar_position:7},a="Image fitting",r={id:"code-snippet-tutorial/image-fitting",title:"Image fitting",description:"The process of fitting images with multiple Gaussians can be done using code snippets.",source:"@site/docs/code-snippet-tutorial/image-fitting.mdx",sourceDirName:"code-snippet-tutorial",slug:"/code-snippet-tutorial/image-fitting",permalink:"/carta-frontend/docs/next/code-snippet-tutorial/image-fitting",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"docsSidebar",previous:{title:"PV images",permalink:"/carta-frontend/docs/next/code-snippet-tutorial/pv-images"},next:{title:"Contributing",permalink:"/carta-frontend/docs/next/category/contributing"}},c={},p=[];function m(t){const e={code:"code",h1:"h1",p:"p",pre:"pre",...(0,o.a)(),...t.components},{ApiLink:n}=e;return n||function(t,e){throw new Error("Expected "+(e?"component":"object")+" `"+t+"` to be defined: you likely forgot to import, pass, or provide it.")}("ApiLink",!0),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"image-fitting",children:"Image fitting"}),"\n",(0,i.jsx)(e.p,{children:"The process of fitting images with multiple Gaussians can be done using code snippets."}),"\n",(0,i.jsxs)(e.p,{children:["The configuration for the fitting is accessible via ",(0,i.jsx)(n,{path:"/.-stores/class/ImageFittingStore",children:(0,i.jsx)(e.code,{children:"ImageFittingStore"})}),". Example code:"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-javascript",children:'// Open an image\nconst file = await app.openFile("[filename]");\n\n// Display the fitting widget\napp.dialogStore.showFittingDialog();\n\n// Clear previous inputs of initial values\napp.imageFittingStore.clearComponents();\n\n// Set initial values\napp.imageFittingStore.setComponents(2);\n\nconst component1 = app.imageFittingStore.components[0];\ncomponent1.setCenterX(128);\ncomponent1.setCenterY(129);\ncomponent1.setAmplitude(0.01);\ncomponent1.setFwhmX(10);\ncomponent1.setFwhmY(6);\ncomponent1.setPa(36);\n\nconst component2 = app.imageFittingStore.components[1];\ncomponent2.setCenterX(135);\ncomponent2.setCenterY(135);\ncomponent2.setAmplitude(0.01);\ncomponent2.setFwhmX(4);\ncomponent2.setFwhmY(9);\ncomponent2.setPa(40);\n\n// Fit the image\napp.imageFittingStore.fitImage();\n'})})]})}function d(t={}){const{wrapper:e}={...(0,o.a)(),...t.components};return e?(0,i.jsx)(e,{...t,children:(0,i.jsx)(m,{...t})}):m(t)}},1151:(t,e,n)=>{n.d(e,{Z:()=>r,a:()=>a});var i=n(7294);const o={},s=i.createContext(o);function a(t){const e=i.useContext(s);return i.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function r(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(o):t.components||o:a(t.components),i.createElement(s.Provider,{value:e},t.children)}}}]);