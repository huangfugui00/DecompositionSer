(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5301:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(3518)}])},3518:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return Z}});var n=r(4051),i=r.n(n),a=r(5893),o=r(7294),s=r(9008),l=function(e){var t=e.decompositionEvent;return(0,a.jsx)("div",{className:"flex gap-4 justify-between",children:(0,a.jsx)("button",{className:" bg-primary-color px-4 py-1 rounded text-white",onClick:function(e){return t()},children:"\u89e3\u8c31"})})},c=r(9669),u=r.n(c);var d=function(){var e=u().create({baseURL:"/"}),t=sessionStorage.getItem("token")||localStorage.getItem("token");return t&&(e.defaults.headers.common.Authorization="Bearer ".concat(t)),e.interceptors.response.use((function(e){return e.data}),(function(e){return 401===e.response.status&&localStorage.removeItem("token"),void 0===e.response.data&&(e.response.data.data=e.response.statusText),e.response.data})),e},f={readCdf:function(){return d().get("/api/cdf")}},m={decompostion:function(e){return d().post("/api/decomposite",e)}},h=r(5152),p=(0,h.default)((function(){return Promise.all([r.e(960),r.e(660)]).then(r.bind(r,8660))}),{loadableGenerated:{webpack:function(){return[8660]}},ssr:!1}),v=function(e){var t=e.alignPeaks,r=e.times,n=e.mzArr,i=e.left,o=e.right,s=r,l=t;return i&&o&&(s=r.slice(i,o),l=t.slice(i,o)),s.length>500?(0,a.jsx)("div",{className:"flex items-center justify-center",children:(0,a.jsx)("p",{children:"\u6240\u9009\u8303\u56f4\u592a\u5927"})}):(0,a.jsx)(p,{data:[{x:n,y:s,z:l,type:"surface"}],layout:{height:450,margin:{l:5,r:5,b:20,t:9}},style:{height:"100%",width:"100%"},config:{responsive:!0}})};function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function g(e){return function(e){if(Array.isArray(e))return x(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return x(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return x(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var y=(0,h.default)((function(){return Promise.all([r.e(960),r.e(660)]).then(r.bind(r,8660))}),{loadableGenerated:{webpack:function(){return[8660]}},ssr:!1}),b=function(e){var t,r=e.left,n=e.right,i=e.times,o=e.tics,s=e.setRangeEvent,l=(t=Math).max.apply(t,g(o));return(0,a.jsx)("div",{className:"h-64",children:(0,a.jsx)(y,{onRelayout:function(e){return function(e){var t=e["xaxis.range[0]"],r=e["xaxis.range[1]"];t&&r&&s(t,r)}(e)},config:{staticPlot:!1,responsive:!0,scrollZoom:!0},data:[{x:i,y:o,type:"scatter",marker:{color:"#0052cc"}}],layout:{margin:{l:50,r:5,b:20,t:0},shapes:[{type:"rect",xref:"x",x0:r,y0:0,x1:n,y1:l,fillcolor:"gray",opacity:.2,line:{width:0}}]},style:{height:"100%",width:"100%"}})})};function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function w(e){return function(e){if(Array.isArray(e))return j(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return j(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return j(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var S=(0,h.default)((function(){return Promise.all([r.e(960),r.e(660)]).then(r.bind(r,8660))}),{loadableGenerated:{webpack:function(){return[8660]}},ssr:!1}),A=function(e){var t=e.left,r=e.right,n=e.times,i=e.tics,o=e.estList,s=[{x:n,y:i,name:"\u5b9e\u9645TIC"}];if(o.length>0){var l,c=o[0].curve.x,u=o.map((function(e,t){return{x:c,y:e.curve.y,name:"\u6210\u5206".concat(t+1)}}));(l=s).push.apply(l,w(u));for(var d=o[0].curve.y.length,f=new Array(d).fill(0),m=0;m<d;m++)for(var h=0;h<o.length;h++)f[m]+=o[h].curve.y[m];s.push({x:c,y:f,name:"\u62df\u5408TIC"})}return(0,a.jsx)("div",{className:" h-64",id:"myTicDiv",children:(0,a.jsx)(S,{config:{responsive:!0,scrollZoom:!0},data:s,layout:{margin:{l:50,r:5,b:20,t:0},xaxis:{range:[t,r]}},style:{height:"100%",width:"100%"}})})},I=r(3503),k=function(e){var t=e.open,r=e.handleClose,n=e.children;return(0,a.jsx)(I.Z,{open:t,onClose:r,"aria-labelledby":"modal-modal-title","aria-describedby":"modal-modal-description",style:{display:"flex",alignItems:"center",justifyContent:"center"},children:(0,a.jsx)("div",{children:n})})},N=r(733),T=r.n(N),C=function(e){var t=e.loading,r=e.size,n=e.color,i=e.type;return(0,a.jsx)("div",{children:t?(0,a.jsx)("div",{className:"flex justify-center",children:(0,a.jsx)(T(),{type:i||"spin",color:n||"blue",height:r||30,width:r||30})}):(0,a.jsx)(a.Fragment,{})})},P=function(e){var t=e.loading,r=(0,o.useState)(!1),n=r[0],i=r[1];return(0,o.useEffect)((function(){i(t)}),[t]),(0,a.jsx)("div",{children:(0,a.jsx)(k,{open:n,handleClose:function(){return i(!1)},children:(0,a.jsx)(C,{loading:t,size:100})})})},E=r(2132),_=(r(993),function(){return(0,a.jsx)(E.Ix,{})}),O=E.Am,z=(0,h.default)((function(){return Promise.all([r.e(960),r.e(660)]).then(r.bind(r,8660))}),{loadableGenerated:{webpack:function(){return[8660]}},ssr:!1}),M=function(e){var t=e.massSpectrumList;return(0,a.jsx)("div",{children:t.map((function(e,r){return(0,a.jsx)(z,{data:[{x:e.x,y:e.y,type:"bar"}],layout:{height:450/t.length,margin:{l:50,r:5,b:20,t:9}},style:{height:"100%",width:"90%"},config:{responsive:!0}})}))})},L=function(e){var t=e.massSpectrumList,r=(0,o.useState)(0),n=r[0],i=r[1];return 0===t.length?(0,a.jsx)(a.Fragment,{}):(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)("div",{children:-1===n?(0,a.jsx)(M,{massSpectrumList:t}):(0,a.jsx)(z,{data:[{x:t[n].x,y:t[n].y,type:"bar"}],layout:{height:450,margin:{l:50,r:5,b:20,t:9}},style:{height:"100%",width:"90%"},config:{responsive:!0}})}),(0,a.jsxs)("select",{className:"absolute right-0 top-4 mt-8 py-1 pl-1 rounded text-gray-500 bg-gray-100 text-sm outline-none border focus:border-blue-200 ",value:n,onChange:function(e){return i(parseInt(e.target.value))},children:[(0,a.jsx)("option",{value:-1,children:"\u6240\u6709\u8c31\u56fe"}),t.map((function(e,t){return(0,a.jsx)("option",{value:t,children:"\u6210\u5206\u8c31\u56fe".concat(t+1)})}))]})]})};function G(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function R(e,t,r,n,i,a,o){try{var s=e[a](o),l=s.value}catch(c){return void r(c)}s.done?t(l):Promise.resolve(l).then(n,i)}function U(e){return function(){var t=this,r=arguments;return new Promise((function(n,i){var a=e.apply(t,r);function o(e){R(a,n,i,o,s,"next",e)}function s(e){R(a,n,i,o,s,"throw",e)}o(void 0)}))}}function F(e){return function(e){if(Array.isArray(e))return G(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return G(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return G(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Z(){var e=(0,o.useState)(),t=e[0],r=e[1],n=(0,o.useState)([]),c=n[0],u=n[1],d=(0,o.useState)(),h=d[0],p=d[1],x=(0,o.useState)(!1),g=x[0],y=x[1];(0,o.useEffect)((function(){var e=function(){var e=U(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,y(!0),e.next=4,f.readCdf();case 4:(t=e.sent).status?r(t.data):O(t.statusText),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),O(e.t0.message);case 11:return e.prev=11,y(!1),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[0,8,11,14]])})));return function(){return e.apply(this,arguments)}}();e()}),[]);var j=function(){var e=U(i().mark((function e(){var r,n,a,o,s,l;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t&&h&&h.leftIdx&&h.rightIdx)){e.next=21;break}if(e.prev=1,r=null===t||void 0===t?void 0:t.alignPeaks.slice(null===h||void 0===h?void 0:h.leftIdx,null===h||void 0===h?void 0:h.rightIdx),n=null===t||void 0===t?void 0:t.scanTimes.slice(h.leftIdx,h.rightIdx),a=null===t||void 0===t?void 0:t.mzArr,o={alignPeaks:r,scanTimes:n,mzArr:a},s=JSON.stringify(o),y(!0),!s){e.next=13;break}return e.next=11,m.decompostion({data:s});case 11:(l=e.sent)&&l.status?(console.log(l.data),u(l.data)):O(l.statusText);case 13:e.next=18;break;case 15:e.prev=15,e.t0=e.catch(1),O(e.t0.message);case 18:return e.prev=18,y(!1),e.finish(18);case 21:case"end":return e.stop()}}),e,null,[[1,15,18,21]])})));return function(){return e.apply(this,arguments)}}(),w=c.map((function(e){return e.massSpectrum}));return t?(0,a.jsxs)("div",{children:[(0,a.jsxs)(s.default,{children:[(0,a.jsx)("title",{children:"InitProject"}),(0,a.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,a.jsxs)("main",{className:"p-4",children:[(0,a.jsx)(l,{decompositionEvent:j}),(0,a.jsxs)("div",{className:"mt-4 p-4 border-t-blue-500 border-t-4",children:[(0,a.jsx)("div",{className:"flex mx-auto",children:(0,a.jsx)("p",{className:"text-primary-color font-bold text-lg mx-auto",children:"\u5b89\u6377\u4f26\u516d\u7ec4\u5206"})}),(0,a.jsxs)("div",{className:"lg:grid lg:grid-cols-2 gap-8 mt-4",children:[t&&(0,a.jsx)(b,{times:t.scanTimes,tics:t.tics,setRangeEvent:function(e,r){if(t){var n,i,a=t.scanTimes.map((function(t){return Math.abs(t-e)})),o=a.indexOf((n=Math).min.apply(n,F(a))),s=t.scanTimes.map((function(e){return Math.abs(e-r)})),l=s.indexOf((i=Math).min.apply(i,F(s)));p({leftIdx:o,rightIdx:l,left:e,right:r})}},left:null===h||void 0===h?void 0:h.left,right:null===h||void 0===h?void 0:h.right}),t&&(0,a.jsx)(A,{times:t.scanTimes,tics:t.tics,estList:c,left:null===h||void 0===h?void 0:h.left,right:null===h||void 0===h?void 0:h.right})]}),(0,a.jsxs)("div",{className:"lg:grid lg:grid-cols-2 gap-8 mt-4 ",children:[(0,a.jsx)(v,{alignPeaks:t.alignPeaks,mzArr:t.mzArr,times:t.scanTimes,left:null===h||void 0===h?void 0:h.leftIdx,right:null===h||void 0===h?void 0:h.rightIdx}),w.length>0&&(0,a.jsx)(L,{massSpectrumList:w})]})]})]}),(0,a.jsx)(_,{}),(0,a.jsx)(P,{loading:g})]}):(0,a.jsx)(a.Fragment,{})}}},function(e){e.O(0,[404,774,888,179],(function(){return t=5301,e(e.s=t);var t}));var t=e.O();_N_E=t}]);