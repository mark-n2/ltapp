(function(e){function t(t){for(var o,s,c=t[0],i=t[1],u=t[2],l=0,f=[];l<c.length;l++)s=c[l],a[s]&&f.push(a[s][0]),a[s]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o]);d&&d(t);while(f.length)f.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,s=1;s<n.length;s++){var i=n[s];0!==a[i]&&(o=!1)}o&&(r.splice(t--,1),e=c(c.s=n[0]))}return e}var o={},a={app:0},r=[];function s(e){return c.p+"js/"+({about:"about"}[e]||e)+"."+{about:"837baaff","chunk-2d0aab97":"73919510"}[e]+".js"}function c(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n=a[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise(function(t,o){n=a[e]=[t,o]});t.push(n[2]=o);var r,i=document.createElement("script");i.charset="utf-8",i.timeout=120,c.nc&&i.setAttribute("nonce",c.nc),i.src=s(e),r=function(t){i.onerror=i.onload=null,clearTimeout(u);var n=a[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src,s=new Error("Loading chunk "+e+" failed.\n("+o+": "+r+")");s.type=o,s.request=r,n[1](s)}a[e]=void 0}};var u=setTimeout(function(){r({type:"timeout",target:i})},12e4);i.onerror=i.onload=r,document.head.appendChild(i)}return Promise.all(t)},c.m=e,c.c=o,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)c.d(n,o,function(t){return e[t]}.bind(null,o));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/ltapp/",c.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var d=u;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var o=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("v-app",{attrs:{id:"inspire"}},[n("v-tabs",{attrs:{centered:"",color:"cyan",dark:"","icons-and-text":""}},[n("v-tabs-slider",{attrs:{color:"yellow"}}),n("v-tab",{attrs:{to:"/",router:""}},[e._v("\n        Recording\n        "),n("v-icon",[e._v("add_to_queue")])],1),n("v-tab",{attrs:{to:"/home",router:""}},[e._v("\n        Favorites\n        "),n("v-icon",[e._v("favorite")])],1),n("v-tab",{attrs:{to:"/about",router:""}},[e._v("\n        About\n        "),n("v-icon",[e._v("contacts")])],1)],1),n("router-view")],1),n("v-footer",{staticClass:"pa-3"},[n("v-spacer"),n("div",[e._v("mog© "+e._s((new Date).getFullYear()))])],1)],1)},r=[],s=(n("7faf"),n("2877")),c={},i=Object(s["a"])(c,a,r,!1,null,null,null),u=i.exports,l=n("8c4f"),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("v-btn",{attrs:{color:"success"},on:{click:e.add}},[e._v("Add")]),n("v-btn",{attrs:{color:"success"},on:{click:e.display_update}},[e._v("Display")]),n("v-btn",{attrs:{color:"success"},on:{click:e.delete_all}},[e._v("Clear")]),null!==this.head?n("div",[n("v-data-table",{staticClass:"elevation-1",attrs:{headers:this.keys,items:this.head},scopedSlots:e._u([{key:"items",fn:function(t){return[n("td",[e._v(e._s(t.item.id))]),n("td",{staticClass:"text-xs-right"},[e._v(e._s(t.item.date))]),n("td",{staticClass:"text-xs-right"},[e._v(e._s(t.item.accX))]),n("td",{staticClass:"text-xs-right"},[e._v(e._s(t.item.accY))]),n("td",{staticClass:"text-xs-right"},[e._v(e._s(t.item.accZ))])]}}])})],1):e._e()],1)},f=[],p={name:"home",data:function(){return{head:null,keys:[{text:"ID",value:"id"},{text:"Date",value:"date"},{text:"加速度X",value:"accX",sortable:!1},{text:"加速度Y",value:"accY",sortable:!1},{text:"加速度Z",value:"accZ",sortable:!1}]}},methods:{add:function(){this.$appDataBase.notes.put({accX:.02,accY:-.03,accZ:1,date:new Date}).then(function(e){console.log("record saved: ",e)})},display_update:function(){var e=this;this.$appDataBase.notes.limit(20).toArray().then(function(t){e.head=t})},delete_all:function(){this.$appDataBase.notes.clear()},export:function(){this.$appDataBase.export()}}},v=p,h=Object(s["a"])(v,d,f,!1,null,null,null),b=h.exports;o["default"].use(l["a"]);var m=new l["a"]({mode:"history",base:"/ltapp/",routes:[{path:"/",name:"recording",component:function(){return n.e("chunk-2d0aab97").then(n.bind(null,"11de"))}},{path:"/home",name:"home",component:b},{path:"/about",name:"about",component:function(){return n.e("about").then(n.bind(null,"f820"))}}]}),g=n("9483");Object(g["a"])("".concat("/ltapp/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var _=n("ce5b"),y=n.n(_),w=(n("bf40"),n("74ce"));o["default"].config.productionTip=!1,o["default"].use(y.a),o["default"].prototype.$appDataBase=new w["a"]("AppDatabase"),(void 0).$appDataBase.version(1).stores({notes:"++id, date, accX, accY, accZ"}),new o["default"]({router:m,render:function(e){return e(u)}}).$mount("#app")},"7faf":function(e,t,n){"use strict";var o=n("8fba"),a=n.n(o);a.a},"8fba":function(e,t,n){}});
//# sourceMappingURL=app.c88e0ba4.js.map