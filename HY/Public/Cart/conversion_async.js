(function(){var h=this,m=function(a){return"string"==typeof a},aa=Date.now||function(){return+new Date};var n=function(a){a=parseFloat(a);return isNaN(a)||1<a||0>a?0:a};var ba=n("0.20"),ca=n("0.30"),da=n("0.01");var ea=/^true$/.test("true")?!0:!1;var fa=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(m(a))return m(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},la=Array.prototype.filter?function(a,b,c){return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=m(a)?a.split(""):a,k=0;k<d;k++)if(k in g){var l=g[k];b.call(c,l,k,a)&&(e[f++]=l)}return e},ma=Array.prototype.map?
function(a,b,c){return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=m(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},na=function(a){return Array.prototype.concat.apply([],arguments)};var u=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b};var y=function(a){y[" "](a);return a};y[" "]=function(){};var z=function(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.call(void 0,a[c],c,a)};var pa=function(){var a=u(oa);this.i={};this.b={};a=a||[];for(var b=0,c=a.length;b<c;++b)this.b[a[b]]=""},qa=function(){try{var a=h.top.location.hash;if(a){var b=a.match(/\bdeid=([\d,]+)/);return b&&b[1]||""}}catch(c){}return""},J=function(a,b,c){var d=C;if(c?d.b.hasOwnProperty(c)&&""==d.b[c]:1){var e;if(e=(e=qa().match(new RegExp("\\b("+a.join("|")+")\\b")))&&e[0]||null)a=e;else a:{if(!(1E-4>Math.random())&&(e=Math.random(),e<b)){try{var f=new Uint32Array(1);h.crypto.getRandomValues(f);e=f[0]/65536/
65536}catch(g){e=Math.random()}a=a[Math.floor(e*a.length)];break a}a=null}a&&""!=a&&(c?d.b.hasOwnProperty(c)&&(d.b[c]=a):d.i[a]=!0)}},K=function(a){var b=C;return b.b.hasOwnProperty(a)?b.b[a]:""},ra=function(){var a=C,b=[];z(a.i,function(a,d){b.push(d)});z(a.b,function(a){""!=a&&b.push(a)});return b};var oa={f:2,g:3,h:4},L={g:{c:"27391101",a:"27391102"},f:{c:"376635470",a:"376635471"},h:{c:"659234980",a:"659234981"}},C=null,sa=function(){var a=na.apply([],ma(u(L),function(a){return u(a)},void 0)),b=la(qa().split(","),function(b){return""!=b&&!(0<=fa(a,b))});return 0<b.length?"&debug_experiment_id="+b.join(","):""};var M=null,N=null;var ta=function(a,b,c,d){for(var e=c.length;0<=(b=a.indexOf(c,b))&&b<d;){var f=a.charCodeAt(b-1);if(38==f||63==f)if(f=a.charCodeAt(b+e),!f||61==f||38==f||35==f)return b;b+=e+1}return-1},ua=/#|$/,O=function(a,b){var c=a.search(ua),d=ta(a,0,b,c);if(0>d)return null;var e=a.indexOf("&",d);if(0>e||e>c)e=c;d+=b.length+1;return decodeURIComponent(a.substr(d,e-d).replace(/\+/g," "))},va=/[?&]($|#)/;var wa="google_conversion_id google_conversion_format google_conversion_type google_conversion_order_id google_conversion_language google_conversion_value google_conversion_evaluemrc google_conversion_currency google_conversion_domain google_conversion_label google_conversion_color google_disable_viewthrough google_enable_display_cookie_match google_remarketing_only google_remarketing_for_search google_conversion_items google_conversion_merchant_id google_custom_params google_conversion_date google_conversion_time google_conversion_js_version onload_callback opt_image_generator google_conversion_page_url google_conversion_referrer_url".split(" "),
P=function(a){return null!=a?encodeURIComponent(a.toString()):""},xa=function(a){return null!=a?a.toString().substring(0,512):""},Q=function(a,b){b=P(b);return""!=b&&(a=P(a),""!=a)?"&".concat(a,"=",b):""},R=function(a){var b=typeof a;return null==a||"object"==b||"function"==b?null:String(a).replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/=/g,"\\=")},ya=function(a){if((a=a.google_custom_params)&&"object"==typeof a&&"function"!=typeof a.join){var b=[];for(g in a)if(Object.prototype.hasOwnProperty.call(a,
g)){var c=a[g];if(c&&"function"==typeof c.join){for(var d=[],e=0;e<c.length;++e){var f=R(c[e]);null!=f&&d.push(f)}c=d.length?d.join(","):null}else c=R(c);(d=R(g))&&null!=c&&b.push(d+"="+c)}var g=b.join(";")}else g="";return""==g?"":"&".concat("data=",encodeURIComponent(g))},za=function(a){if(null!=a){a=a.toString();if(2==a.length)return Q("hl",a);if(5==a.length)return Q("hl",a.substring(0,2))+Q("gl",a.substring(3,5))}return""};
function S(a){return"number"!=typeof a&&"string"!=typeof a?"":P(a.toString())}
var Aa=function(a){if(!a)return"";a=a.google_conversion_items;if(!a)return"";for(var b=[],c=0,d=a.length;c<d;c++){var e=a[c],f=[];e&&(f.push(S(e.value)),f.push(S(e.quantity)),f.push(S(e.item_id)),f.push(S(e.adwords_grouping)),f.push(S(e.sku)),b.push("("+f.join("*")+")"))}return 0<b.length?"&item="+b.join(""):""},Ba=function(a,b,c){var d=[];if(a){var e=a.screen;e&&(d.push(Q("u_h",e.height)),d.push(Q("u_w",e.width)),d.push(Q("u_ah",e.availHeight)),d.push(Q("u_aw",e.availWidth)),d.push(Q("u_cd",e.colorDepth)));
a.history&&d.push(Q("u_his",a.history.length))}c&&"function"==typeof c.getTimezoneOffset&&d.push(Q("u_tz",-c.getTimezoneOffset()));b&&("function"==typeof b.javaEnabled&&d.push(Q("u_java",b.javaEnabled())),b.plugins&&d.push(Q("u_nplug",b.plugins.length)),b.mimeTypes&&d.push(Q("u_nmime",b.mimeTypes.length)));return d.join("")};
function Ca(a){a=a?a.title:"";if(void 0==a||""==a)return"";var b=function(a){try{return decodeURIComponent(a),!0}catch(e){return!1}};a=encodeURIComponent(a);for(var c=256;!b(a.substr(0,c));)c--;return"&tiba="+a.substr(0,c)}
var Da=function(a,b,c,d){var e="";if(b){if(a.top==a)var f=0;else{var g=a.location.ancestorOrigins;if(g)f=g[g.length-1]==a.location.origin?1:2;else{g=a.top;try{var k;if(k=!!g&&null!=g.location.href)c:{try{y(g.foo);k=!0;break c}catch(l){}k=!1}f=k}catch(l){f=!1}f=f?1:2}}a=c?c:1==f?a.top.location.href:a.location.href;e+=Q("frm",f);e+=Q("url",xa(a));e+=Q("ref",xa(d||b.referrer))}return e},T=function(a,b){return!(ea||b&&Ea.test(navigator.userAgent))||a&&a.location&&a.location.protocol&&"https:"==a.location.protocol.toString().toLowerCase()?
"https:":"http:"},Ea=/Android ([01]\.|2\.[01])/i,Y=function(a,b){var c=b.createElement("iframe");c.style.display="none";c.src=T(a,!1)+"//bid.g.doubleclick.net/xbbe/pixel?d=KAE";b.body.appendChild(c)};function Fa(){return new Image}
function Ga(a,b,c,d){if(C&&K(3)===L.g.a)try{a:if(3!=O(c,"fmt"))var e=!1;else{if(d){var f=O(c,"random"),g=O(c,"label");if(!f||!g){e=!1;break a}var k=decodeURIComponent(g.replace(/\+/g," "))+":"+decodeURIComponent(f.replace(/\+/g," "));f=[];for(var l=g=0;l<k.length;l++){var p=k.charCodeAt(l);255<p&&(f[g++]=p&255,p>>=8);f[g++]=p}if(!M)for(M={},N={},k=0;65>k;k++)M[k]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(k),N[k]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(k);
k=N;p=[];for(g=0;g<f.length;g+=3){var D=f[g],r=g+1<f.length,A=r?f[g+1]:0,E=g+2<f.length,F=E?f[g+2]:0;l=D>>2;var U=(D&3)<<4|A>>4,G=(A&15)<<2|F>>6,H=F&63;E||(H=64,r||(G=64));p.push(k[l],k[U],k[G],k[H])}var q=p.join("").replace(/[.]*$/,"");var v=a.GooglebQhCsO;v||(v={},a.GooglebQhCsO=v);a=v;if(a[q])var ha=!1;else a[q]=[],a[q][0]=d,ha=!0;if(!ha){e=!1;break a}}var V=c.search(ua);d=0;var W;for(q=[];0<=(W=ta(c,d,"fmt",V));)q.push(c.substring(d,W)),d=Math.min(c.indexOf("&",W)+1||V,V);q.push(c.substr(d));
var t=q.join("").replace(va,"$1");var I="fmt="+encodeURIComponent("4");if(I){var w=t.indexOf("#");0>w&&(w=t.length);var B=t.indexOf("?");if(0>B||B>w){B=w;var ia=""}else ia=t.substring(B+1,w);var x=[t.substr(0,B),ia,t.substr(w)];var X=x[1];x[1]=I?X?X+"&"+I:I:X;var ja=x[0]+(x[1]?"?"+x[1]:"")+x[2]}else ja=t;var ka=b.createElement("script");ka.src=ja;b.getElementsByTagName("script")[0].parentElement.appendChild(ka);e=!0}return e}catch(La){}return!1}
var Z=function(a,b,c,d,e,f){var g=c.opt_image_generator&&c.opt_image_generator.call,k;e&&c.onload_callback&&c.onload_callback.call?k=c.onload_callback:k=function(){};d+=Q("async","1");!g&&f&&Ga(a,b,d,k)||(a=Fa,g&&(a=c.opt_image_generator),c=a(),c.src=d,c.onload=k)},Ha=function(a,b){for(var c=document.createElement("iframe"),d=[],e=[],f=0;f<b.google_conversion_items.length;f++){var g=b.google_conversion_items[f];g&&g.quantity&&g.sku&&(d.push(g.sku),e.push(g.quantity))}a=T(a,!1)+"//www.google.com/ads/mrc";
c.src=a+"?sku="+d.join(",")+"&qty="+e.join(",")+"&oid="+b.google_conversion_order_id+"&mcid="+b.google_conversion_merchant_id;c.style.width="1px";c.style.height="1px";c.style.display="none";return c},Ia=function(a,b,c){var d=function(){c.documentElement.appendChild(Ha(a,b))};"complete"===c.readyState?d():a.addEventListener?a.addEventListener("load",d):a.attachEvent("onload",d)},Ja=function(a,b){C&&K(2)==L.f.a&&("complete"===b.readyState?Y(a,b):a.addEventListener?a.addEventListener("load",function(){Y(a,
b)}):a.attachEvent("onload",function(){Y(a,b)}))},Ka=function(a,b){for(var c={},d=function(d){c[d]=b&&null!=b[d]?b[d]:a[d]},e=0;e<wa.length;e++)d(wa[e]);d("onload_callback");return c};window.google_trackConversion=function(a){var b=window,c=navigator,d=document;a=Ka(b,a);a.google_conversion_format=3;var e=!1;if(a&&3==a.google_conversion_format){try{if("landing"==a.google_conversion_type||!a.google_conversion_id||a.google_remarketing_only&&a.google_disable_viewthrough)var f=!1;else a.google_conversion_date=new Date,a.google_conversion_time=a.google_conversion_date.getTime(),a.google_conversion_snippets="number"==typeof a.google_conversion_snippets&&0<a.google_conversion_snippets?
a.google_conversion_snippets+1:1,"number"!=typeof a.google_conversion_first_time&&(a.google_conversion_first_time=a.google_conversion_time),a.google_conversion_js_version="8",0!=a.google_conversion_format&&1!=a.google_conversion_format&&2!=a.google_conversion_format&&3!=a.google_conversion_format&&(a.google_conversion_format=1),!1!==a.google_enable_display_cookie_match&&(a.google_enable_display_cookie_match=!0),C=new pa,f=!0;if(f){a.google_remarketing_only&&a.google_enable_display_cookie_match&&C&&
J([L.f.c,L.f.a],ba,2);a.google_remarketing_only||a.google_conversion_domain||C&&J([L.g.c,L.g.a],ca,3);f="/?";"landing"==a.google_conversion_type&&(f="/extclk?");var g=[a.google_remarketing_only?"viewthroughconversion/":"conversion/",P(a.google_conversion_id),f,"random=",P(a.google_conversion_time)].join(""),k,l=a.google_remarketing_only?"googleads.g.doubleclick.net":a.google_conversion_domain||"www.googleadservices.com";g=k=T(b,/www[.]googleadservices[.]com/i.test(l))+"//"+l+"/pagead/"+g;var p=[Q("cv",
a.google_conversion_js_version),Q("fst",a.google_conversion_first_time),Q("num",a.google_conversion_snippets),Q("fmt",a.google_conversion_format),Q("value",a.google_conversion_value),Q("evaluemrc",a.google_conversion_evaluemrc),Q("currency_code",a.google_conversion_currency),Q("label",a.google_conversion_label),Q("oid",a.google_conversion_order_id),Q("bg",a.google_conversion_color),za(a.google_conversion_language),Q("guid","ON"),Q("disvt",a.google_disable_viewthrough),Q("eid",ra().join()),Aa(a),Ba(b,
c,a.google_conversion_date),ya(a),Da(b,d,a.google_conversion_page_url,a.google_conversion_referrer_url),a.google_remarketing_for_search&&!a.google_conversion_domain?"&srr=n":"",Ca(d)].join("")+sa();Z(b,d,a,g+p,!0,!0);C&&J([L.h.c,L.h.a],da,4);if(C&&K(4)==L.h.a){var D=Math.floor(1E9*Math.random()),r=T(b,!1)+"//pagead2.googlesyndication.com/pagead/gen_204?id=beacon-api-web-survey&type=gen204Type";r+=Q("random",D);r+=Q("time",aa());if(b.navigator&&b.navigator.sendBeacon){try{var A=r.replace("gen204Type",
"send-beacon");A+=Q("async","1");b.navigator.sendBeacon(A,"")}catch(v){}var E=r.replace("gen204Type","img");Z(b,d,a,E,!1,!1)}else{var F=r.replace("gen204Type","beacon-undefined");Z(b,d,a,F,!1,!1)}}if(a.google_remarketing_for_search&&!a.google_conversion_domain){var U=Math.floor(1E9*Math.random()),G=[P(a.google_conversion_id),"/?random=",U].join(""),H=T(b,!1)+"//www.google.com/ads/user-lists/"+G;c=H;var q=[Q("label",a.google_conversion_label),Q("fmt","3"),Da(b,d,a.google_conversion_page_url,a.google_conversion_referrer_url)].join("");
Z(b,d,a,c+q,!1,!1)}a.google_remarketing_only&&a.google_enable_display_cookie_match&&Ja(b,d);e=!0}a.google_conversion_merchant_id&&a.google_conversion_order_id&&a.google_conversion_items&&(Ia(b,a,d),e=!0)}catch(v){}b=e}else b=!1;return b};}).call(this);
