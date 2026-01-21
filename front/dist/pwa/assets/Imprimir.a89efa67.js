import{u as R}from"./index.07a95aa4.js";import{h as De}from"./moment.40bc58bf.js";var M={},Oe=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},ie={},S={};let Nt;const Ue=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];S.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};S.getSymbolTotalCodewords=function(t){return Ue[t]};S.getBCHDigit=function(n){let t=0;for(;n!==0;)t++,n>>>=1;return t};S.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');Nt=t};S.isKanjiModeEnabled=function(){return typeof Nt!="undefined"};S.toSJIS=function(t){return Nt(t)};var ut={};(function(n){n.L={bit:1},n.M={bit:0},n.Q={bit:3},n.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return n.L;case"m":case"medium":return n.M;case"q":case"quartile":return n.Q;case"h":case"high":return n.H;default:throw new Error("Unknown EC Level: "+e)}}n.isValid=function(i){return i&&typeof i.bit!="undefined"&&i.bit>=0&&i.bit<4},n.from=function(i,o){if(n.isValid(i))return i;try{return t(i)}catch{return o}}})(ut);function re(){this.buffer=[],this.length=0}re.prototype={get:function(n){const t=Math.floor(n/8);return(this.buffer[t]>>>7-n%8&1)===1},put:function(n,t){for(let e=0;e<t;e++)this.putBit((n>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(n){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),n&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var ze=re;function W(n){if(!n||n<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=n,this.data=new Uint8Array(n*n),this.reservedBit=new Uint8Array(n*n)}W.prototype.set=function(n,t,e,i){const o=n*this.size+t;this.data[o]=e,i&&(this.reservedBit[o]=!0)};W.prototype.get=function(n,t){return this.data[n*this.size+t]};W.prototype.xor=function(n,t,e){this.data[n*this.size+t]^=e};W.prototype.isReserved=function(n,t){return this.reservedBit[n*this.size+t]};var _e=W,se={};(function(n){const t=S.getSymbolSize;n.getRowColCoords=function(i){if(i===1)return[];const o=Math.floor(i/7)+2,r=t(i),s=r===145?26:Math.ceil((r-13)/(2*o-2))*2,l=[r-7];for(let a=1;a<o-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},n.getPositions=function(i){const o=[],r=n.getRowColCoords(i),s=r.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||o.push([r[l],r[a]]);return o}})(se);var ae={};const ke=S.getSymbolSize,Wt=7;ae.getPositions=function(t){const e=ke(t);return[[0,0],[e-Wt,0],[0,e-Wt]]};var le={};(function(n){n.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};n.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},n.from=function(o){return n.isValid(o)?parseInt(o,10):void 0},n.getPenaltyN1=function(o){const r=o.size;let s=0,l=0,a=0,d=null,u=null;for(let f=0;f<r;f++){l=a=0,d=u=null;for(let c=0;c<r;c++){let h=o.get(f,c);h===d?l++:(l>=5&&(s+=t.N1+(l-5)),d=h,l=1),h=o.get(c,f),h===u?a++:(a>=5&&(s+=t.N1+(a-5)),u=h,a=1)}l>=5&&(s+=t.N1+(l-5)),a>=5&&(s+=t.N1+(a-5))}return s},n.getPenaltyN2=function(o){const r=o.size;let s=0;for(let l=0;l<r-1;l++)for(let a=0;a<r-1;a++){const d=o.get(l,a)+o.get(l,a+1)+o.get(l+1,a)+o.get(l+1,a+1);(d===4||d===0)&&s++}return s*t.N2},n.getPenaltyN3=function(o){const r=o.size;let s=0,l=0,a=0;for(let d=0;d<r;d++){l=a=0;for(let u=0;u<r;u++)l=l<<1&2047|o.get(d,u),u>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|o.get(u,d),u>=10&&(a===1488||a===93)&&s++}return s*t.N3},n.getPenaltyN4=function(o){let r=0;const s=o.data.length;for(let a=0;a<s;a++)r+=o.data[a];return Math.abs(Math.ceil(r*100/s/5)-10)*t.N4};function e(i,o,r){switch(i){case n.Patterns.PATTERN000:return(o+r)%2===0;case n.Patterns.PATTERN001:return o%2===0;case n.Patterns.PATTERN010:return r%3===0;case n.Patterns.PATTERN011:return(o+r)%3===0;case n.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(r/3))%2===0;case n.Patterns.PATTERN101:return o*r%2+o*r%3===0;case n.Patterns.PATTERN110:return(o*r%2+o*r%3)%2===0;case n.Patterns.PATTERN111:return(o*r%3+(o+r)%2)%2===0;default:throw new Error("bad maskPattern:"+i)}}n.applyMask=function(o,r){const s=r.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)r.isReserved(a,l)||r.xor(a,l,e(o,a,l))},n.getBestMask=function(o,r){const s=Object.keys(n.Patterns).length;let l=0,a=1/0;for(let d=0;d<s;d++){r(d),n.applyMask(d,o);const u=n.getPenaltyN1(o)+n.getPenaltyN2(o)+n.getPenaltyN3(o)+n.getPenaltyN4(o);n.applyMask(d,o),u<a&&(a=u,l=d)}return l}})(le);var ht={};const _=ut,st=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],at=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];ht.getBlocksCount=function(t,e){switch(e){case _.L:return st[(t-1)*4+0];case _.M:return st[(t-1)*4+1];case _.Q:return st[(t-1)*4+2];case _.H:return st[(t-1)*4+3];default:return}};ht.getTotalCodewordsCount=function(t,e){switch(e){case _.L:return at[(t-1)*4+0];case _.M:return at[(t-1)*4+1];case _.Q:return at[(t-1)*4+2];case _.H:return at[(t-1)*4+3];default:return}};var de={},ft={};const Q=new Uint8Array(512),dt=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)Q[e]=t,dt[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)Q[e]=Q[e-255]})();ft.log=function(t){if(t<1)throw new Error("log("+t+")");return dt[t]};ft.exp=function(t){return Q[t]};ft.mul=function(t,e){return t===0||e===0?0:Q[dt[t]+dt[e]]};(function(n){const t=ft;n.mul=function(i,o){const r=new Uint8Array(i.length+o.length-1);for(let s=0;s<i.length;s++)for(let l=0;l<o.length;l++)r[s+l]^=t.mul(i[s],o[l]);return r},n.mod=function(i,o){let r=new Uint8Array(i);for(;r.length-o.length>=0;){const s=r[0];for(let a=0;a<o.length;a++)r[a]^=t.mul(o[a],s);let l=0;for(;l<r.length&&r[l]===0;)l++;r=r.slice(l)}return r},n.generateECPolynomial=function(i){let o=new Uint8Array([1]);for(let r=0;r<i;r++)o=n.mul(o,new Uint8Array([1,t.exp(r)]));return o}})(de);const ce=de;function Lt(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}Lt.prototype.initialize=function(t){this.degree=t,this.genPoly=ce.generateECPolynomial(this.degree)};Lt.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const e=new Uint8Array(t.length+this.degree);e.set(t);const i=ce.mod(e,this.genPoly),o=this.degree-i.length;if(o>0){const r=new Uint8Array(this.degree);return r.set(i,o),r}return i};var Ve=Lt,ue={},k={},It={};It.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var O={};const he="[0-9]+",He="[A-Z $%*+\\-./:]+";let X="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";X=X.replace(/u/g,"\\u");const je="(?:(?![A-Z0-9 $%*+\\-./:]|"+X+`)(?:.|[\r
]))+`;O.KANJI=new RegExp(X,"g");O.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");O.BYTE=new RegExp(je,"g");O.NUMERIC=new RegExp(he,"g");O.ALPHANUMERIC=new RegExp(He,"g");const Je=new RegExp("^"+X+"$"),Ye=new RegExp("^"+he+"$"),qe=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");O.testKanji=function(t){return Je.test(t)};O.testNumeric=function(t){return Ye.test(t)};O.testAlphanumeric=function(t){return qe.test(t)};(function(n){const t=It,e=O;n.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},n.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},n.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},n.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},n.MIXED={bit:-1},n.getCharCountIndicator=function(r,s){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?r.ccBits[0]:s<27?r.ccBits[1]:r.ccBits[2]},n.getBestModeForData=function(r){return e.testNumeric(r)?n.NUMERIC:e.testAlphanumeric(r)?n.ALPHANUMERIC:e.testKanji(r)?n.KANJI:n.BYTE},n.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},n.isValid=function(r){return r&&r.bit&&r.ccBits};function i(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return n.NUMERIC;case"alphanumeric":return n.ALPHANUMERIC;case"kanji":return n.KANJI;case"byte":return n.BYTE;default:throw new Error("Unknown mode: "+o)}}n.from=function(r,s){if(n.isValid(r))return r;try{return i(r)}catch{return s}}})(k);(function(n){const t=S,e=ht,i=ut,o=k,r=It,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,l=t.getBCHDigit(s);function a(c,h,g){for(let y=1;y<=40;y++)if(h<=n.getCapacity(y,g,c))return y}function d(c,h){return o.getCharCountIndicator(c,h)+4}function u(c,h){let g=0;return c.forEach(function(y){g+=d(y.mode,h)+y.getBitsLength()}),g}function f(c,h){for(let g=1;g<=40;g++)if(u(c,g)<=n.getCapacity(g,h,o.MIXED))return g}n.from=function(h,g){return r.isValid(h)?parseInt(h,10):g},n.getCapacity=function(h,g,y){if(!r.isValid(h))throw new Error("Invalid QR Code version");typeof y=="undefined"&&(y=o.BYTE);const b=t.getSymbolTotalCodewords(h),m=e.getTotalCodewordsCount(h,g),w=(b-m)*8;if(y===o.MIXED)return w;const v=w-d(y,h);switch(y){case o.NUMERIC:return Math.floor(v/10*3);case o.ALPHANUMERIC:return Math.floor(v/11*2);case o.KANJI:return Math.floor(v/13);case o.BYTE:default:return Math.floor(v/8)}},n.getBestVersionForData=function(h,g){let y;const b=i.from(g,i.M);if(Array.isArray(h)){if(h.length>1)return f(h,b);if(h.length===0)return 1;y=h[0]}else y=h;return a(y.mode,y.getLength(),b)},n.getEncodedBits=function(h){if(!r.isValid(h)||h<7)throw new Error("Invalid QR Code version");let g=h<<12;for(;t.getBCHDigit(g)-l>=0;)g^=s<<t.getBCHDigit(g)-l;return h<<12|g}})(ue);var fe={};const bt=S,ge=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Ge=1<<14|1<<12|1<<10|1<<4|1<<1,te=bt.getBCHDigit(ge);fe.getEncodedBits=function(t,e){const i=t.bit<<3|e;let o=i<<10;for(;bt.getBCHDigit(o)-te>=0;)o^=ge<<bt.getBCHDigit(o)-te;return(i<<10|o)^Ge};var pe={};const Ke=k;function j(n){this.mode=Ke.NUMERIC,this.data=n.toString()}j.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};j.prototype.getLength=function(){return this.data.length};j.prototype.getBitsLength=function(){return j.getBitsLength(this.data.length)};j.prototype.write=function(t){let e,i,o;for(e=0;e+3<=this.data.length;e+=3)i=this.data.substr(e,3),o=parseInt(i,10),t.put(o,10);const r=this.data.length-e;r>0&&(i=this.data.substr(e),o=parseInt(i,10),t.put(o,r*3+1))};var Ze=j;const Qe=k,yt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function J(n){this.mode=Qe.ALPHANUMERIC,this.data=n}J.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let i=yt.indexOf(this.data[e])*45;i+=yt.indexOf(this.data[e+1]),t.put(i,11)}this.data.length%2&&t.put(yt.indexOf(this.data[e]),6)};var Xe=J;const We=k;function Y(n){this.mode=We.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}Y.getBitsLength=function(t){return t*8};Y.prototype.getLength=function(){return this.data.length};Y.prototype.getBitsLength=function(){return Y.getBitsLength(this.data.length)};Y.prototype.write=function(n){for(let t=0,e=this.data.length;t<e;t++)n.put(this.data[t],8)};var tn=Y;const en=k,nn=S;function q(n){this.mode=en.KANJI,this.data=n}q.getBitsLength=function(t){return t*13};q.prototype.getLength=function(){return this.data.length};q.prototype.getBitsLength=function(){return q.getBitsLength(this.data.length)};q.prototype.write=function(n){let t;for(t=0;t<this.data.length;t++){let e=nn.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),n.put(e,13)}};var on=q,me={exports:{}};(function(n){var t={single_source_shortest_paths:function(e,i,o){var r={},s={};s[i]=0;var l=t.PriorityQueue.make();l.push(i,0);for(var a,d,u,f,c,h,g,y,b;!l.empty();){a=l.pop(),d=a.value,f=a.cost,c=e[d]||{};for(u in c)c.hasOwnProperty(u)&&(h=c[u],g=f+h,y=s[u],b=typeof s[u]=="undefined",(b||y>g)&&(s[u]=g,l.push(u,g),r[u]=d))}if(typeof o!="undefined"&&typeof s[o]=="undefined"){var m=["Could not find a path from ",i," to ",o,"."].join("");throw new Error(m)}return r},extract_shortest_path_from_predecessor_list:function(e,i){for(var o=[],r=i;r;)o.push(r),e[r],r=e[r];return o.reverse(),o},find_path:function(e,i,o){var r=t.single_source_shortest_paths(e,i,o);return t.extract_shortest_path_from_predecessor_list(r,o)},PriorityQueue:{make:function(e){var i=t.PriorityQueue,o={},r;e=e||{};for(r in i)i.hasOwnProperty(r)&&(o[r]=i[r]);return o.queue=[],o.sorter=e.sorter||i.default_sorter,o},default_sorter:function(e,i){return e.cost-i.cost},push:function(e,i){var o={value:e,cost:i};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};n.exports=t})(me);(function(n){const t=k,e=Ze,i=Xe,o=tn,r=on,s=O,l=S,a=me.exports;function d(m){return unescape(encodeURIComponent(m)).length}function u(m,w,v){const p=[];let C;for(;(C=m.exec(v))!==null;)p.push({data:C[0],index:C.index,mode:w,length:C[0].length});return p}function f(m){const w=u(s.NUMERIC,t.NUMERIC,m),v=u(s.ALPHANUMERIC,t.ALPHANUMERIC,m);let p,C;return l.isKanjiModeEnabled()?(p=u(s.BYTE,t.BYTE,m),C=u(s.KANJI,t.KANJI,m)):(p=u(s.BYTE_KANJI,t.BYTE,m),C=[]),w.concat(v,p,C).sort(function(T,L){return T.index-L.index}).map(function(T){return{data:T.data,mode:T.mode,length:T.length}})}function c(m,w){switch(w){case t.NUMERIC:return e.getBitsLength(m);case t.ALPHANUMERIC:return i.getBitsLength(m);case t.KANJI:return r.getBitsLength(m);case t.BYTE:return o.getBitsLength(m)}}function h(m){return m.reduce(function(w,v){const p=w.length-1>=0?w[w.length-1]:null;return p&&p.mode===v.mode?(w[w.length-1].data+=v.data,w):(w.push(v),w)},[])}function g(m){const w=[];for(let v=0;v<m.length;v++){const p=m[v];switch(p.mode){case t.NUMERIC:w.push([p,{data:p.data,mode:t.ALPHANUMERIC,length:p.length},{data:p.data,mode:t.BYTE,length:p.length}]);break;case t.ALPHANUMERIC:w.push([p,{data:p.data,mode:t.BYTE,length:p.length}]);break;case t.KANJI:w.push([p,{data:p.data,mode:t.BYTE,length:d(p.data)}]);break;case t.BYTE:w.push([{data:p.data,mode:t.BYTE,length:d(p.data)}])}}return w}function y(m,w){const v={},p={start:{}};let C=["start"];for(let E=0;E<m.length;E++){const T=m[E],L=[];for(let I=0;I<T.length;I++){const F=T[I],N=""+E+I;L.push(N),v[N]={node:F,lastCount:0},p[N]={};for(let B=0;B<C.length;B++){const $=C[B];v[$]&&v[$].node.mode===F.mode?(p[$][N]=c(v[$].lastCount+F.length,F.mode)-c(v[$].lastCount,F.mode),v[$].lastCount+=F.length):(v[$]&&(v[$].lastCount=F.length),p[$][N]=c(F.length,F.mode)+4+t.getCharCountIndicator(F.mode,w))}}C=L}for(let E=0;E<C.length;E++)p[C[E]].end=0;return{map:p,table:v}}function b(m,w){let v;const p=t.getBestModeForData(m);if(v=t.from(w,p),v!==t.BYTE&&v.bit<p.bit)throw new Error('"'+m+'" cannot be encoded with mode '+t.toString(v)+`.
 Suggested mode is: `+t.toString(p));switch(v===t.KANJI&&!l.isKanjiModeEnabled()&&(v=t.BYTE),v){case t.NUMERIC:return new e(m);case t.ALPHANUMERIC:return new i(m);case t.KANJI:return new r(m);case t.BYTE:return new o(m)}}n.fromArray=function(w){return w.reduce(function(v,p){return typeof p=="string"?v.push(b(p,null)):p.data&&v.push(b(p.data,p.mode)),v},[])},n.fromString=function(w,v){const p=f(w,l.isKanjiModeEnabled()),C=g(p),E=y(C,v),T=a.find_path(E.map,"start","end"),L=[];for(let I=1;I<T.length-1;I++)L.push(E.table[T[I]].node);return n.fromArray(h(L))},n.rawSplit=function(w){return n.fromArray(f(w,l.isKanjiModeEnabled()))}})(pe);const gt=S,vt=ut,rn=ze,sn=_e,an=se,ln=ae,At=le,Tt=ht,dn=Ve,ct=ue,cn=fe,un=k,Et=pe;function hn(n,t){const e=n.size,i=ln.getPositions(t);for(let o=0;o<i.length;o++){const r=i[o][0],s=i[o][1];for(let l=-1;l<=7;l++)if(!(r+l<=-1||e<=r+l))for(let a=-1;a<=7;a++)s+a<=-1||e<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?n.set(r+l,s+a,!0,!0):n.set(r+l,s+a,!1,!0))}}function fn(n){const t=n.size;for(let e=8;e<t-8;e++){const i=e%2===0;n.set(e,6,i,!0),n.set(6,e,i,!0)}}function gn(n,t){const e=an.getPositions(t);for(let i=0;i<e.length;i++){const o=e[i][0],r=e[i][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?n.set(o+s,r+l,!0,!0):n.set(o+s,r+l,!1,!0)}}function pn(n,t){const e=n.size,i=ct.getEncodedBits(t);let o,r,s;for(let l=0;l<18;l++)o=Math.floor(l/3),r=l%3+e-8-3,s=(i>>l&1)===1,n.set(o,r,s,!0),n.set(r,o,s,!0)}function wt(n,t,e){const i=n.size,o=cn.getEncodedBits(t,e);let r,s;for(r=0;r<15;r++)s=(o>>r&1)===1,r<6?n.set(r,8,s,!0):r<8?n.set(r+1,8,s,!0):n.set(i-15+r,8,s,!0),r<8?n.set(8,i-r-1,s,!0):r<9?n.set(8,15-r-1+1,s,!0):n.set(8,15-r-1,s,!0);n.set(i-8,8,1,!0)}function mn(n,t){const e=n.size;let i=-1,o=e-1,r=7,s=0;for(let l=e-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!n.isReserved(o,l-a)){let d=!1;s<t.length&&(d=(t[s]>>>r&1)===1),n.set(o,l-a,d),r--,r===-1&&(s++,r=7)}if(o+=i,o<0||e<=o){o-=i,i=-i;break}}}function yn(n,t,e){const i=new rn;e.forEach(function(a){i.put(a.mode.bit,4),i.put(a.getLength(),un.getCharCountIndicator(a.mode,n)),a.write(i)});const o=gt.getSymbolTotalCodewords(n),r=Tt.getTotalCodewordsCount(n,t),s=(o-r)*8;for(i.getLengthInBits()+4<=s&&i.put(0,4);i.getLengthInBits()%8!==0;)i.putBit(0);const l=(s-i.getLengthInBits())/8;for(let a=0;a<l;a++)i.put(a%2?17:236,8);return vn(i,n,t)}function vn(n,t,e){const i=gt.getSymbolTotalCodewords(t),o=Tt.getTotalCodewordsCount(t,e),r=i-o,s=Tt.getBlocksCount(t,e),l=i%s,a=s-l,d=Math.floor(i/s),u=Math.floor(r/s),f=u+1,c=d-u,h=new dn(c);let g=0;const y=new Array(s),b=new Array(s);let m=0;const w=new Uint8Array(n.buffer);for(let T=0;T<s;T++){const L=T<a?u:f;y[T]=w.slice(g,g+L),b[T]=h.encode(y[T]),g+=L,m=Math.max(m,L)}const v=new Uint8Array(i);let p=0,C,E;for(C=0;C<m;C++)for(E=0;E<s;E++)C<y[E].length&&(v[p++]=y[E][C]);for(C=0;C<c;C++)for(E=0;E<s;E++)v[p++]=b[E][C];return v}function En(n,t,e,i){let o;if(Array.isArray(n))o=Et.fromArray(n);else if(typeof n=="string"){let d=t;if(!d){const u=Et.rawSplit(n);d=ct.getBestVersionForData(u,e)}o=Et.fromString(n,d||40)}else throw new Error("Invalid data");const r=ct.getBestVersionForData(o,e);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=r;else if(t<r)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+r+`.
`);const s=yn(t,e,o),l=gt.getSymbolSize(t),a=new sn(l);return hn(a,t),fn(a),gn(a,t),wt(a,e,0),t>=7&&pn(a,t),mn(a,s),isNaN(i)&&(i=At.getBestMask(a,wt.bind(null,a,e))),At.applyMask(i,a),wt(a,e,i),{modules:a,version:t,errorCorrectionLevel:e,maskPattern:i,segments:o}}ie.create=function(t,e){if(typeof t=="undefined"||t==="")throw new Error("No input text");let i=vt.M,o,r;return typeof e!="undefined"&&(i=vt.from(e.errorCorrectionLevel,vt.M),o=ct.from(e.version),r=At.from(e.maskPattern),e.toSJISFunc&&gt.setToSJISFunction(e.toSJISFunc)),En(t,o,i,r)};var ye={},Bt={};(function(n){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let i=e.slice().replace("#","").split("");if(i.length<3||i.length===5||i.length>8)throw new Error("Invalid hex color: "+e);(i.length===3||i.length===4)&&(i=Array.prototype.concat.apply([],i.map(function(r){return[r,r]}))),i.length===6&&i.push("F","F");const o=parseInt(i.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+i.slice(0,6).join("")}}n.getOptions=function(i){i||(i={}),i.color||(i.color={});const o=typeof i.margin=="undefined"||i.margin===null||i.margin<0?4:i.margin,r=i.width&&i.width>=21?i.width:void 0,s=i.scale||4;return{width:r,scale:r?4:s,margin:o,color:{dark:t(i.color.dark||"#000000ff"),light:t(i.color.light||"#ffffffff")},type:i.type,rendererOpts:i.rendererOpts||{}}},n.getScale=function(i,o){return o.width&&o.width>=i+o.margin*2?o.width/(i+o.margin*2):o.scale},n.getImageWidth=function(i,o){const r=n.getScale(i,o);return Math.floor((i+o.margin*2)*r)},n.qrToImageData=function(i,o,r){const s=o.modules.size,l=o.modules.data,a=n.getScale(s,r),d=Math.floor((s+r.margin*2)*a),u=r.margin*a,f=[r.color.light,r.color.dark];for(let c=0;c<d;c++)for(let h=0;h<d;h++){let g=(c*d+h)*4,y=r.color.light;if(c>=u&&h>=u&&c<d-u&&h<d-u){const b=Math.floor((c-u)/a),m=Math.floor((h-u)/a);y=f[l[b*s+m]?1:0]}i[g++]=y.r,i[g++]=y.g,i[g++]=y.b,i[g]=y.a}}})(Bt);(function(n){const t=Bt;function e(o,r,s){o.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=s,r.width=s,r.style.height=s+"px",r.style.width=s+"px"}function i(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}n.render=function(r,s,l){let a=l,d=s;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(d=i()),a=t.getOptions(a);const u=t.getImageWidth(r.modules.size,a),f=d.getContext("2d"),c=f.createImageData(u,u);return t.qrToImageData(c.data,r,a),e(f,d,u),f.putImageData(c,0,0),d},n.renderToDataURL=function(r,s,l){let a=l;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const d=n.render(r,s,a),u=a.type||"image/png",f=a.rendererOpts||{};return d.toDataURL(u,f.quality)}})(ye);var ve={};const wn=Bt;function ee(n,t){const e=n.a/255,i=t+'="'+n.hex+'"';return e<1?i+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':i}function Ct(n,t,e){let i=n+t;return typeof e!="undefined"&&(i+=" "+e),i}function Cn(n,t,e){let i="",o=0,r=!1,s=0;for(let l=0;l<n.length;l++){const a=Math.floor(l%t),d=Math.floor(l/t);!a&&!r&&(r=!0),n[l]?(s++,l>0&&a>0&&n[l-1]||(i+=r?Ct("M",a+e,.5+d+e):Ct("m",o,0),o=0,r=!1),a+1<t&&n[l+1]||(i+=Ct("h",s),s=0)):o++}return i}ve.render=function(t,e,i){const o=wn.getOptions(e),r=t.modules.size,s=t.modules.data,l=r+o.margin*2,a=o.color.light.a?"<path "+ee(o.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",d="<path "+ee(o.color.dark,"stroke")+' d="'+Cn(s,r,o.margin)+'"/>',u='viewBox="0 0 '+l+" "+l+'"',f=o.width?'width="'+o.width+'" height="'+o.width+'" ':"",c='<svg xmlns="http://www.w3.org/2000/svg" '+f+u+' shape-rendering="crispEdges">'+a+d+`</svg>
`;return typeof i=="function"&&i(null,c),c};const bn=Oe,$t=ie,Ee=ye,An=ve;function Ft(n,t,e,i,o){const r=[].slice.call(arguments,1),s=r.length,l=typeof r[s-1]=="function";if(!l&&!bn())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(o=e,e=t,t=i=void 0):s===3&&(t.getContext&&typeof o=="undefined"?(o=i,i=void 0):(o=i,i=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=i=void 0):s===2&&!t.getContext&&(i=e,e=t,t=void 0),new Promise(function(a,d){try{const u=$t.create(e,i);a(n(u,t,i))}catch(u){d(u)}})}try{const a=$t.create(e,i);o(null,n(a,t,i))}catch(a){o(a)}}M.create=$t.create;M.toCanvas=Ft.bind(null,Ee.render);M.toDataURL=Ft.bind(null,Ee.renderToDataURL);M.toString=Ft.bind(null,function(n,t,e){return An.render(n,e)});var D={};Object.defineProperty(D,"__esModule",{value:!0});var x=D.Printd=D.createIFrame=D.createLinkStyle=D.createStyle=void 0,Tn=/^(((http[s]?)|file):)?(\/\/)+([0-9a-zA-Z-_.=?&].+)$/,$n=/^((\.|\.\.)?\/)([0-9a-zA-Z-_.=?&]+\/)*([0-9a-zA-Z-_.=?&]+)$/,ne=function(n){return Tn.test(n)||$n.test(n)};function we(n,t){var e=n.createElement("style");return e.appendChild(n.createTextNode(t)),e}D.createStyle=we;function Ce(n,t){var e=n.createElement("link");return e.type="text/css",e.rel="stylesheet",e.href=t,e}D.createLinkStyle=Ce;function be(n){var t=window.document.createElement("iframe");return t.setAttribute("src","about:blank"),t.setAttribute("style","visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;"),t.setAttribute("width","0"),t.setAttribute("height","0"),t.setAttribute("wmode","opaque"),n.appendChild(t),t}D.createIFrame=be;var Nn={parent:window.document.body,headElements:[],bodyElements:[]},Ae=function(){function n(t){this.isLoading=!1,this.hasEvents=!1,this.opts=[Nn,t||{}].reduce(function(e,i){return Object.keys(i).forEach(function(o){return e[o]=i[o]}),e},{}),this.iframe=be(this.opts.parent)}return n.prototype.getIFrame=function(){return this.iframe},n.prototype.print=function(t,e,i,o){if(!this.isLoading){var r=this.iframe,s=r.contentDocument,l=r.contentWindow;if(!(!s||!l)&&(this.iframe.src="about:blank",this.elCopy=t.cloneNode(!0),!!this.elCopy)){this.isLoading=!0,this.callback=o;var a=l.document;a.open(),a.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>'),this.addEvents();var d=this.opts,u=d.headElements,f=d.bodyElements;Array.isArray(u)&&u.forEach(function(c){return a.head.appendChild(c)}),Array.isArray(f)&&f.forEach(function(c){return a.body.appendChild(c)}),Array.isArray(e)&&e.forEach(function(c){c&&a.head.appendChild(ne(c)?Ce(a,c):we(a,c))}),a.body.appendChild(this.elCopy),Array.isArray(i)&&i.forEach(function(c){if(c){var h=a.createElement("script");ne(c)?h.src=c:h.innerText=c,a.body.appendChild(h)}}),a.close()}}},n.prototype.printURL=function(t,e){this.isLoading||(this.addEvents(),this.isLoading=!0,this.callback=e,this.iframe.src=t)},n.prototype.onBeforePrint=function(t){this.onbeforeprint=t},n.prototype.onAfterPrint=function(t){this.onafterprint=t},n.prototype.launchPrint=function(t){this.isLoading||t.print()},n.prototype.addEvents=function(){var t=this;if(!this.hasEvents){this.hasEvents=!0,this.iframe.addEventListener("load",function(){return t.onLoad()},!1);var e=this.iframe.contentWindow;e&&(this.onbeforeprint&&e.addEventListener("beforeprint",this.onbeforeprint),this.onafterprint&&e.addEventListener("afterprint",this.onafterprint))}},n.prototype.onLoad=function(){var t=this;if(this.iframe){this.isLoading=!1;var e=this.iframe,i=e.contentDocument,o=e.contentWindow;if(!i||!o)return;typeof this.callback=="function"?this.callback({iframe:this.iframe,element:this.elCopy,launchPrint:function(){return t.launchPrint(o)}}):this.launchPrint(o)}},n}();x=D.Printd=Ae;D.default=Ae;class Ln{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,i=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){i=!1;break}return i?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let i=this.tens[t.charAt(0)-3];return e>0&&(i+=" y "+this.getUnits(e)),i}getHundreds(t){let e="",i=t.charAt(0),o=t.substr(1);if(t==100)return"cien";switch(i){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(i)+"cientos"),o>0&&(e+=" "+this.getName(o)),e}getThousands(t){let e="mil",i=t.length-3,o=t.substr(0,i),r=t.substr(i);return o>1&&(e=this.getName(o).replace("uno","un")+" mil"),r>0&&(e+=" "+this.getName(r)),e}getPeriod(t,e,i){let o="un "+i,r=t.length-e,s=t.substr(0,r),l=t.substr(r);return s>1&&(o=this.getName(s).replace("uno","un")+" "+i.replace("\xF3","o")+"es"),l>0&&(o+=" "+this.getName(l)),o}}var z={conversorNumerosALetras:Ln},Te={};Object.defineProperty(Te,"__esModule",{value:!0});function lt(n){switch(n){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function V(n,t){return t>0?n+" y "+lt(t):n}function P(n){var t=Math.floor(n/10),e=n-t*10;switch(t){case 1:switch(e){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+lt(e).toLowerCase()}case 2:switch(e){case 0:return"Veinte";default:return"Veinti"+lt(e).toLowerCase()}case 3:return V("Treinta",e);case 4:return V("Cuarenta",e);case 5:return V("Cincuenta",e);case 6:return V("Sesenta",e);case 7:return V("Setenta",e);case 8:return V("Ochenta",e);case 9:return V("Noventa",e);case 0:return lt(e);default:return""}}function $e(n){var t=Math.floor(n/100),e=n-t*100;switch(t){case 1:return e>0?"Ciento "+P(e):"Cien";case 2:return"Doscientos "+P(e);case 3:return"Trescientos "+P(e);case 4:return"Cuatrocientos "+P(e);case 5:return"Quinientos "+P(e);case 6:return"Seiscientos "+P(e);case 7:return"Setecientos "+P(e);case 8:return"Ochocientos "+P(e);case 9:return"Novecientos "+P(e);default:return P(e)}}function Ne(n,t,e,i){var o=Math.floor(n/t),r=n-o*t,s="";return o>0&&(o>1?s=$e(o)+" "+i:s=e),r>0&&(s+=""),s}function In(n){var t=1e3,e=Math.floor(n/t),i=n-e*t,o=Ne(n,t,"Un Mil","Mil"),r=$e(i);return o===""?r:(o+" "+r).trim()}function oe(n){var t=1e6,e=Math.floor(n/t),i=n-e*t,o=Ne(n,t,"Un Mill\xF3n de","Millones de"),r=In(i);return o===""?r:(o+" "+r).trim()}function Bn(n){var t={numero:n,enteros:Math.floor(n),centavos:Math.round(n*100)-Math.floor(n)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(oe(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(oe(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}Te.NumerosALetras=Bn;class xn{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],i=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],o={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},r=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function s(f){if(f<10)return e[f];if(f>=10&&f<20)return o[f];if(f<100){const h=f%10;return`${i[Math.floor(f/10)]}${h>0?" y "+e[h]:""}`}if(f===100)return"cien";const c=f%100;return`${r[Math.floor(f/100)]}${c>0?" "+s(c):""}`}if(t===1e6)return"un mill\xF3n";let l=Math.floor(t/1e3),a=t%1e3,d=l>0?l===1?"mil":`${s(l)} mil`:"",u=a>0?s(a):"";return(d+" "+u).trim()}static imprimirCaja(t){}static async factura(t){return new Promise(async(e,i)=>{var o,r,s,l,a,d,u,f,c,h,g,y,b,m,w,v,p,C,E,T,L;try{const I=z.conversorNumerosALetras,F=new I,N=R().env,B=A=>Number(A||0).toFixed(2),$=A=>(A!=null?A:"").toString(),U=Number((r=(o=t.total)!=null?o:t.montoTotal)!=null?r:0),G=(a=(l=(s=t.numeroFactura)!=null?s:t.numero_factura)!=null?l:t.id)!=null?a:"\u2014",tt=(d=t.fechaEmision)!=null?d:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",et=(c=(f=t.nombre)!=null?f:(u=t==null?void 0:t.cliente)==null?void 0:u.nombre)!=null?c:"SN",K=(y=(g=t.complemento)!=null?g:(h=t==null?void 0:t.cliente)==null?void 0:h.complemento)!=null?y:"",nt=(w=(m=t.ci)!=null?m:(b=t==null?void 0:t.cliente)==null?void 0:b.ci)!=null?w:"0",ot=(C=(p=t.cliente_id)!=null?p:(v=t==null?void 0:t.cliente)==null?void 0:v.id)!=null?C:"\u2014",it=(E=N==null?void 0:N.puntoVenta)!=null?E:0,H=(T=t.cuf)!=null?T:null,Z=H?H.match(/.{1,20}/g).join("<br>"):null,Le=H?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",Ie=(L=t.leyenda)!=null?L:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",Be=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],Mt=Math.floor(U),Fe=Math.round((U-Mt)*100).toString().padStart(2,"0"),Me=`Son ${F.convertToText(Mt)} ${Fe}/100 Bolivianos`;let rt=null;Z&&(rt=await M.toDataURL(`${N.url2}consulta/QR?nit=${N.nit}&cuf=${Z}&numero=${G}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let pt=`${this.head()}
<style>
/* Ticket 80mm ~ 300px */
.ticket { width:300px; margin:0 auto; }
.mono { font-family: "Courier New", Courier, monospace; }
.fs9 { font-size:9px; } .fs10{font-size:10px;} .fs11{font-size:11px;} .fs12{font-size:12px;}
.center{ text-align:center; } .right{ text-align:right; } .left{ text-align:left; }
hr{ border:0; border-top:1px dashed #000; margin:6px 0; }
.title{ font-weight:700; text-transform:uppercase; line-height:1.15; }
.small { font-size:8px; line-height:1.25; }

.tbl{ width:100%; border-collapse:collapse; }
.tbl td{ padding:2px 0; vertical-align:top; }

.lbl{ width:135px; font-weight:700; text-transform:uppercase; }
.val{ width:auto; }

.det-header{ font-weight:700; text-transform:uppercase; margin:4px 0; }
.item-desc{ font-weight:700; }
.item-meta{ color:#111; }

.tot td{ padding:1px 0; }
.tot .l{ width:70%; }
.tot .r{ width:30%; text-align:right; }

.qr{ display:flex; justify-content:center; margin-top:6px; }
@page { margin: 6mm; }
</style>

<div class="ticket mono fs10">
  <div class="title fs12 center">${Le}</div>

  <div class="center small">
    ${$(N.razon)}<br>
    Casa Matriz<br>
    No. Punto de Venta ${it}<br>
    ${$(N.direccion)}<br>
    Tel. ${$(N.telefono)}<br>
    Oruro
  </div>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NIT</td><td class="val">${$(N.nit)}</td></tr>
    <tr><td class="lbl">FACTURA N\xB0</td><td class="val">${G}</td></tr>
    <tr><td class="lbl">C\xD3D. AUTORIZACI\xD3N</td><td class="val">${Z!=null?Z:"\u2014"}</td></tr>
  </table>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NOMBRE/RAZ\xD3N SOCIAL</td><td class="val">${$(et)}</td></tr>
    <tr><td class="lbl">NIT/CI/CEX</td><td class="val">${$(nt)}${$(K?"-"+K:"")}</td></tr>
    <tr><td class="lbl">NRO. CLIENTE</td><td class="val">${$(ot)}</td></tr>
    <tr><td class="lbl">FECHA DE EMISI\xD3N</td><td class="val">${$(tt)}</td></tr>
  </table>

  <hr>
  <div class="det-header center">DETALLE</div>`;Be.forEach(A=>{var Pt,Dt,Ot,Ut,zt,_t,kt,Vt,Ht,jt,Jt,Yt,qt,Gt,Kt,Zt,Qt,Xt;const Se=(Ut=(Ot=(Pt=A.producto_id)!=null?Pt:A.product_id)!=null?Ot:(Dt=A==null?void 0:A.producto)==null?void 0:Dt.id)!=null?Ut:"\u2014",xe=$((Vt=(kt=(zt=A.nombre)!=null?zt:A.descripcion)!=null?kt:(_t=A==null?void 0:A.producto)==null?void 0:_t.nombre)!=null?Vt:""),Re=$((Jt=(jt=A.unidad)!=null?jt:(Ht=A==null?void 0:A.producto)==null?void 0:Ht.unidad)!=null?Jt:""),St=Number((qt=(Yt=A.cantidad)!=null?Yt:A.qty)!=null?qt:0),xt=Number((Kt=(Gt=A.precio)!=null?Gt:A.precioUnitario)!=null?Kt:0),Rt=Number((Qt=(Zt=A.descuento)!=null?Zt:A.montoDescuento)!=null?Qt:0),Pe=(Xt=A.subTotal)!=null?Xt:St*xt-Rt;pt+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${Se} - ${xe}</td>
          <td class="right item-desc">${B(Pe)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Re||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${B(St)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${B(xt)} - ${B(Rt)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),pt+=`
  <hr>
  <table class="tbl tot fs10">
    <tr><td class="l left strong">TOTAL Bs</td><td class="r strong">${B(U)}</td></tr>
    <tr><td class="l left">(-) DESCUENTO Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">SUBTOTAL A PAGAR Bs</td><td class="r strong">${B(U)}</td></tr>
    <tr><td class="l left">(-) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">MONTO TOTAL A PAGAR Bs</td><td class="r strong">${B(U)}</td></tr>
    <tr><td class="l left">(-) TASAS Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(-) OTROS PAGOS NO SUJETO IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(+) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">IMPORTE BASE CR\xC9DITO FISCAL</td><td class="r strong">${B(U)}</td></tr>
  </table>

  <div class="fs10" style="margin-top:6px;">${Me}</div>

  <hr>
  <div class="center small">
    ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY
  </div>
  <div class="center small" style="margin-top:4px;">${$(Ie)}</div>
  <div class="center small" style="margin-top:4px;">\u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n en l\xEDnea\u201D</div>
  ${rt?`<div class="qr"><img src="${rt}" alt="QR"></div>`:""}
</div>`;const mt=document.getElementById("myElement");mt&&(mt.innerHTML=pt),new x().print(mt),e(rt)}catch(I){i(I)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((i,o)=>{const r=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};R().env,M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(l=>{let a="",d="";t.producto&&(a="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(d="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let u=`${this.head()}
  <!--div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE VENTA"}</div>
      <div class='titulo2'>${t.tipo_comprobante} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
Calle Beni Nro. 60, entre 6 de Octubre y Potos\xED.<br>
Tel. 25247993 - 76148555<br>
Oruro</div!-->
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
   .mono {
    font-family: Monospace,serif !important;
    font-size: 18px !important;
  }
</style>
<title></title>
</head>
<body>
<div class="mono">
<hr>
<table>
<tr><td class='titder'>ID:</td><td class='titder'>${t.id}</td></tr>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='titder'>${t.nombre}</td></tr>
<tr><!-- td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td --></tr>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
${a}
${d}
</table><hr><div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(f=>{var c;console.log("r",f),u+=`<div style='font-size: 12px'><b> ${(c=f.producto)==null?void 0:c.nombre} </b></div>`,f.visible===1?u+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${f.cantidad}
                    </span>
                    <span>
                    ${parseFloat(f.precio).toFixed(2)}
                    </span>

                    <span style='float:right'>
                        ${parseFloat(f.precio*f.cantidad).toFixed(2)}
                    </span>
                    </div>`:u+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${f.cantidad}
                    </span>
                    <span>

                    </span>

                    <span style='float:right'>

                    </span>`}),u+=`<hr>
<div>${t.comentario===""||t.comentario===null||t.comentario===void 0?"":"Comentario: "+t.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='titder'>${parseFloat(t.total).toFixed(2)}</td></tr>
<!--      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='titder'>${parseFloat(t.descuento).toFixed(2)}</td></tr>-->
<!--      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='titder'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>-->
      </table>
      <br>
      <div>Son ${r} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
        <!--div style='display: flex;justify-content: center;'>
          <img  src="${l}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=u,e&&new x().print(document.getElementById("myElement")),i(l)}).catch(l=>{o(l)})})}static cotizacion(t,e,i,o,r=!0){return(o==null||o==="")&&(o=0),new Promise((s,l)=>{const a=z.conversorNumerosALetras,u=new a().convertToText(parseInt(i)),f=De().format("YYYY-MM-DD"),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=R().env;M.toDataURL(`Fecha: ${f} Monto: ${parseFloat(i).toFixed(2)}`,c).then(g=>{let y=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>COTIZACION</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${h.direccion}<br>
Tel. ${h.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${e.nombre}</td>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${f}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(b=>{y+=`<div style='font-size: 12px'><b> ${b.nombre} </b></div>`,y+=`<div><span style='font-size: 18px;font-weight: bold'>${b.cantidadVenta}</span> ${parseFloat(b.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(b.precioVenta*b.cantidadVenta).toFixed(2)}</span></div>`}),y+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(i).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(o).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(i-o).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${u} ${((parseFloat(i)-Math.floor(parseFloat(i)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${g}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=y,r&&new x().print(document.getElementById("myElement")),s(g)}).catch(g=>{l(g)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,i)=>{const o=z.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=R().env;M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(async d=>{let u=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE COMPRA"}</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${a.direccion}<br>
Tel. ${a.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.client?t.client.nombre:""}</td>
</tr><tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td></tr>
<!--<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha_emision}</td></tr>-->
</table><hr><div class='titulo'>DETALLE</div>`;t.buy_details.forEach(c=>{u+=`<div style='font-size: 12px'><b>${c.nombre} </b></div>`,u+=`<div><span style='font-size: 14px;font-weight: bold'>${c.cantidad}</span> ${parseFloat(c.precio).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(c.subtotal).toFixed(2)}</span></div>`}),u+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(t.descuento).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=u,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{i(d)})})}static reportTotal(t,e){const i=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,l)=>s+l.montoTotal,0),o=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,l)=>s+l.montoTotal,0),r=i-o;return console.log("montoTotal",r),new Promise((s,l)=>{const a=z.conversorNumerosALetras,d=new a,u=Math.abs(r),f=d.convertToText(parseInt(u)),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=R().env;M.toDataURL(` Monto: ${parseFloat(r).toFixed(2)}`,c).then(g=>{let y=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>title</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${h.direccion}<br>
Tel. ${h.telefono}<br>
Oruro</div>
<hr>
<table>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(m=>{y+=`<div style='font-size: 12px'><b> ${m.user.name} </b></div>`,y+=`<div> ${parseFloat(m.montoTotal).toFixed(2)} ${m.tipoVenta}
          <span style='float:right'> ${m.tipoVenta==="Egreso"?"-":""} ${parseFloat(m.montoTotal).toFixed(2)}</span></div>`}),y+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${f} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${g}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=y,new x().print(document.getElementById("myElement")),s(g)}).catch(g=>{l(g)})})}static reciboCompra(t){return new Promise((e,i)=>{const o=z.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=R().env;console.log("env",a),M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(d=>{let u=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE COMPRA</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${a.direccion}<br>
    Tel. ${a.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(c=>{u+=`<div style='font-size: 12px'><b>${c.nombre} </b></div>`,u+=`<div>${c.cantidad} ${parseFloat(c.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(c.total).toFixed(2)}</span></div>`}),u+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=u,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{i(d)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,i)=>{const o=z.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=R().env;M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(d=>{let u=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE PEDIDO</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${a.direccion}<br>
    Tel. ${a.telefono}<br>
    Oruro</div>
    <hr>
    <div style='display: flex;justify-content: space-between;'>
        <div class='titulo'>FECHA HORA</div>
        <div class='titulo2'>${t.fecha} ${t.hora}</div>
    </div>
    <div style='display: flex;justify-content: space-between;'>
        <div class='titulo'>ID</div>
        <div class='titulo2'>${t.id}</div>
    </div>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.detalles.forEach(c=>{var h;u+=`<div style='font-size: 12px'><b>${(h=c.producto)==null?void 0:h.nombre} </b></div>`,u+=`<div>${c.cantidad} ${parseFloat(c.cantidad).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(c.cantidad).toFixed(2)}</span></div>`}),u+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=u,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{i(d)})})}static reciboTranferencia(t,e,i,o){return console.log("producto",t,"de",e,"ha",i,"cantidad",o),new Promise((r,s)=>{const l=z.conversorNumerosALetras,d=new l().convertToText(parseInt(o)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=R().env;M.toDataURL(`de: ${e} A: ${i}`,u).then(c=>{let h=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE TRANSFERENCIA</div>
      <div class='titulo2'>${f.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${f.direccion}<br>
    Tel. ${f.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;h+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${e} a ${i} </b></div>`,h+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>CANTIDAD </td><td class='conte2'>${o+""}</td></tr>
      </table>
      <br>
      <div>Son ${d+""} ${o+""} unidades</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${c}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=h,new x().print(document.getElementById("myElement")),r(c)}).catch(c=>{s(c)})})}static head(){return`<html>
<style>
      .titulo{
      font-size: 12px;
      text-align: center;
      font-weight: bold;
      }
      .titulo2{
      font-size: 10px;
      text-align: center;
      }
            .titulo3{
      font-size: 10px;
      text-align: center;
      width:70%;
      }
            .contenido{
      font-size: 10px;
      text-align: left;
      }
      .conte2{
      font-size: 10px;
      text-align: right;
      }
      .titder{
      font-size: 12px;
      text-align: right;
      font-weight: bold;
      }
      hr{
  border-top: 1px dashed   ;
}
  table{
    width:100%
  }
  h1 {
    color: black;
    font-family: sans-serif;
  }
  </style>
<body>
<div style="width: 300px;">`}static async printFactura(t){var f,c;const e=z.conversorNumerosALetras,o=new e().convertToText(parseInt(t.total)),r=R().env,s=await M.toDataURL(`${r.url2}consulta/QR?nit=${r.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),l=t.online?"en":"fuera de";let a=`<style>
    .titulo { font-size: 12px; text-align: center; font-weight: bold; }
    .titulo2 { font-size: 10px; text-align: center; }
    .contenido { font-size: 10px; text-align: left; }
    .conte2 { font-size: 10px; text-align: right; }
    .titder { font-size: 12px; text-align: right; font-weight: bold; }
    hr { border-top: 1px dashed; }
  </style>
  <div style='padding: 0.5cm'>
    <div class='titulo'>FACTURA CON DERECHO A CREDITO FISCAL</div>
    <div class='titulo2'>
      ${r.razon}<br>Casa Matriz<br>No. Punto de Venta 0<br>
      ${r.direccion}<br>Tel. ${r.telefono}<br>Oruro
    </div>
    <hr>
    <div class='titulo'>NIT</div><div class='titulo2'>${r.nit}</div>
    <div class='titulo'>FACTURA N\xB0</div><div class='titulo2'>${t.id}</div>
    <div class='titulo'>C\xD3D. AUTORIZACI\xD3N</div><div class='titulo2'>${t.cuf}</div>
    <hr>
    <table>
      <tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.nombre}</td></tr>
      <tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.ci}${(f=t.cliente)!=null&&f.complemento?"-"+((c=t.cliente)==null?void 0:c.complemento):""}</td></tr>
      <tr><td class='titder'>COD. CLIENTE:</td><td class='contenido'>${t.cliente.id}</td></tr>
      <tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
    </table>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(h=>{a+=`<div style='font-size: 12px'><b>${h.id} - ${h.nombre}</b></div>
             <div>${h.cantidad} ${parseFloat(h.precio).toFixed(2)} 0.00
             <span style='float:right'>${parseFloat(h.cantidad*h.precio).toFixed(2)}</span></div>`}),a+=`<hr>
    <table style='font-size: 8px;'>
      <tr><td class='titder'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>DESCUENTO Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>MONTO GIFT CARD Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>MONTO A PAGAR Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>IMPORTE BASE CR\xC9DITO FISCAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
    </table><br>
    <div>Son ${o} ${((parseFloat(t.total)-Math.floor(t.total))*100).toFixed(0)}/100 Bolivianos</div>
    <hr>
    <div class='titulo2' style='font-size: 9px'>ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY<br><br>
    ${t.leyenda}<br><br>
    \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n ${l} l\xEDnea\u201D</div>
    <div style='display: flex; justify-content: center;'>
      <img src="${s}" />
    </div>
  </div>`;const d=document.getElementById("myElement");d&&(d.innerHTML=a),new x().print(d)}static async reciboVentaSimple(t,e=!0){var i,o,r,s,l,a;try{const d=R().env||{},u=z.conversorNumerosALetras,f=new u,c=E=>Number(E||0).toFixed(2),h=(E,T="")=>(E!=null?E:T).toString(),g=Number((i=t.total)!=null?i:0),y=Math.floor(g),b=Math.round((g-y)*100).toString().padStart(2,"0"),w=`Son ${f.convertToText(y)} ${b}/100 Bolivianos`,v=Array.isArray(t.venta_detalles)?t.venta_detalles:[];let p=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">

    <div class='titulo'>RECIBO DE VENTA</div>
    <div class='titulo2'>
      ${h(d.razon)} <br>
      Casa Matriz<br>
      No. Punto de Venta ${h((o=d.puntoVenta)!=null?o:0)}<br>
      ${h(d.direccion)}<br>
      Tel. ${h(d.telefono)}<br>
      Oruro
    </div>

    <hr>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">FECHA HORA</div>
      <div class="conte2" style="width:55%;">${h(t.fecha)} ${h(t.hora)}</div>
    </div>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">ID</div>
      <div class="conte2" style="width:55%;">${h(t.id)}</div>
    </div>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">USUARIO</div>
      <div class="conte2" style="width:55%;">${h((r=t.user)==null?void 0:r.name)}</div>
    </div>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">PAGO</div>
      <div class="conte2" style="width:55%;">${h((a=(l=(s=t.tipo_pago)!=null?s:t.tipoPago)!=null?l:t.metodo_pago)!=null?a:"")}</div>
    </div>

    ${t.tipo_venta?`
    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">TIPO</div>
      <div class="conte2" style="width:55%;">${h(t.tipo_venta)}</div>
    </div>`:""}

    <hr>
    <div class='titulo'>DETALLE</div>
`;v.forEach(E=>{var B,$,U,G,tt,et,K,nt,ot,it,H;const T=h((G=(U=($=(B=E.producto)==null?void 0:B.nombre)!=null?$:E.nombre)!=null?U:E.descripcion)!=null?G:""),L=Number((tt=E.cantidad)!=null?tt:0),I=Number((et=E.precio)!=null?et:0),F=Number((K=E.subTotal)!=null?K:L*I),N=h((H=(it=(nt=E.producto_id)!=null?nt:E.product_id)!=null?it:(ot=E.producto)==null?void 0:ot.id)!=null?H:"");p+=`<div style='font-size: 12px'><b>${N?N+" - ":""}${T}</b></div>`,p+=`
      <div>
        <span style='font-size: 14px;font-weight: bold'>${c(L)}</span>
        <span>${c(I)} 0.00</span>
        <span style='float:right'>${c(F)}</span>
      </div>`}),p+=`
    <hr>
    <table style='font-size: 8px;'>
      <tr>
        <td class='titder' style='width: 60%'>SUBTOTAL Bs</td>
        <td class='conte2'>${c(g)}</td>
      </tr>
    </table>

    <br>
    <div>${w}</div>
    <hr>

    <div class='titulo2' style="font-size: 9px">
      \xA1Gracias por su compra!
    </div>

  </div>
</div>
</body>
</html>`;const C=document.getElementById("myElement");return C&&(C.innerHTML=p),e&&new x().print(document.getElementById("myElement")),!0}catch(d){throw console.error("reciboVentaSimple error:",d),d}}}export{xn as I};
