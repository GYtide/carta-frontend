"use strict";(self.webpackChunkcarta_frontend_docs=self.webpackChunkcarta_frontend_docs||[]).push([[2168],{134:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>a,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var s=t(5893),i=t(1151);const r={sidebar_position:3},o="Unit test guidelines",c={id:"contributing/unit-test-guidelines",title:"Unit test guidelines",description:"Guidelines for running and writing unit tests.",source:"@site/versioned_docs/version-4.0.0/contributing/unit-test-guidelines.md",sourceDirName:"contributing",slug:"/contributing/unit-test-guidelines",permalink:"/carta-frontend/docs/contributing/unit-test-guidelines",draft:!1,unlisted:!1,tags:[],version:"4.0.0",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"docsSidebar",previous:{title:"Github workflow",permalink:"/carta-frontend/docs/contributing/github-workflow"},next:{title:"Documentation guidelines",permalink:"/carta-frontend/docs/contributing/documentation-guidelines"}},l={},d=[{value:"Running unit tests",id:"running-unit-tests",level:2},{value:"Writing unit tests",id:"writing-unit-tests",level:2},{value:"Structures",id:"structures",level:3},{value:"Testing React components",id:"testing-react-components",level:3}];function u(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"unit-test-guidelines",children:"Unit test guidelines"}),"\n",(0,s.jsx)(n.p,{children:"Guidelines for running and writing unit tests."}),"\n",(0,s.jsx)(n.h2,{id:"running-unit-tests",children:"Running unit tests"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Install package dependencies:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm install\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Build carta-protobuf and WebAssembly libraries:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm run build-protobuf\n\nnpm run build-libs\nnpm run build-wrappers\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Run unit tests:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm test\n"})}),"\n",(0,s.jsx)(n.p,{children:"By default, Jest runs tests related to changed files."}),"\n",(0,s.jsxs)(n.p,{children:["To display individual test results, use the ",(0,s.jsx)(n.code,{children:"--verbose"})," flag:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm test --verbose\n"})}),"\n",(0,s.jsxs)(n.p,{children:["For more options available in Jest, please refer to the ",(0,s.jsx)(n.a,{href:"https://jestjs.io/docs/cli",children:"Jest documentation"}),"."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"writing-unit-tests",children:"Writing unit tests"}),"\n",(0,s.jsx)(n.h3,{id:"structures",children:"Structures"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Directory structure: colocate the test file in the same directory and name with ",(0,s.jsx)(n.code,{children:".test.ts/tsx"})," suffix. For example,"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:".\n\u2514\u2500\u2500 src\n    \u2514\u2500\u2500 components\n        \u2514\u2500\u2500 AComponent\n            \u251c\u2500\u2500 AComponent.tsx\n            \u251c\u2500\u2500 AComponent.scss\n            \u2514\u2500\u2500 AComponent.test.tsx\n    \u2514\u2500\u2500 utilities\n        \u2514\u2500\u2500 math\n            \u251c\u2500\u2500 math.ts\n            \u2514\u2500\u2500 math.test.ts\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Test code structure: use ",(0,s.jsx)(n.code,{children:"describe"})," to structure the tests. For example,"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:'describe("[unit]", () => {\n    test("[expected behavior]", () => {});\n\n    describe("[sub unit]", () => {\n        test("[expected behavior]", () => {});\n    });\n});\n'})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Make sure to implement low-level tests that focus on a certain class or function. Mock imported classes and functions with Jest when necessary."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"TypeScript enum: import TypeScript enum without index files to avoid compile failure."}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"testing-react-components",children:"Testing React components"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Avoid mocking blueprint.js objects to prevent having complex setups."}),"\n",(0,s.jsx)(n.li,{children:"Avoid testing snapshots to prevent having large files in the codebase."}),"\n",(0,s.jsxs)(n.li,{children:["Follow ",(0,s.jsx)(n.a,{href:"https://testing-library.com/docs/queries/about/#priority",children:"the order of priority"})," suggested by React Testing Library when querying elements."]}),"\n"]})]})}function a(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>c,a:()=>o});var s=t(7294);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);