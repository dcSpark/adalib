/*! For license information please see 330.50d8a0d4.chunk.js.LICENSE.txt */
(self.webpackChunkadalib_example=self.webpackChunkadalib_example||[]).push([[330],{604:function(t,e){"use strict";e.byteLength=function(t){var e=u(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){var e,r,i=u(t),a=i[0],f=i[1],s=new o(function(t,e,r){return 3*(e+r)/4-r}(0,a,f)),c=0,h=f>0?a-4:a;for(r=0;r<h;r+=4)e=n[t.charCodeAt(r)]<<18|n[t.charCodeAt(r+1)]<<12|n[t.charCodeAt(r+2)]<<6|n[t.charCodeAt(r+3)],s[c++]=e>>16&255,s[c++]=e>>8&255,s[c++]=255&e;2===f&&(e=n[t.charCodeAt(r)]<<2|n[t.charCodeAt(r+1)]>>4,s[c++]=255&e);1===f&&(e=n[t.charCodeAt(r)]<<10|n[t.charCodeAt(r+1)]<<4|n[t.charCodeAt(r+2)]>>2,s[c++]=e>>8&255,s[c++]=255&e);return s},e.fromByteArray=function(t){for(var e,n=t.length,o=n%3,i=[],a=16383,f=0,u=n-o;f<u;f+=a)i.push(s(t,f,f+a>u?u:f+a));1===o?(e=t[n-1],i.push(r[e>>2]+r[e<<4&63]+"==")):2===o&&(e=(t[n-2]<<8)+t[n-1],i.push(r[e>>10]+r[e>>4&63]+r[e<<2&63]+"="));return i.join("")};for(var r=[],n=[],o="undefined"!==typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,f=i.length;a<f;++a)r[a]=i[a],n[i.charCodeAt(a)]=a;function u(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function s(t,e,n){for(var o,i,a=[],f=e;f<n;f+=3)o=(t[f]<<16&16711680)+(t[f+1]<<8&65280)+(255&t[f+2]),a.push(r[(i=o)>>18&63]+r[i>>12&63]+r[i>>6&63]+r[63&i]);return a.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},4209:function(t,e,r){"use strict";var n=r(6690).default,o=r(9728).default,i=r(6115).default,a=r(1655).default,f=r(6389).default,u=r(604),s=r(9632),c="function"===typeof Symbol&&"function"===typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;e.lW=p,e.h2=50;var h=2147483647;function l(t){if(t>h)throw new RangeError('The value "'+t+'" is invalid for option "size"');var e=new Uint8Array(t);return Object.setPrototypeOf(e,p.prototype),e}function p(t,e,r){if("number"===typeof t){if("string"===typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return d(t)}return g(t,e,r)}function g(t,e,r){if("string"===typeof t)return function(t,e){"string"===typeof e&&""!==e||(e="utf8");if(!p.isEncoding(e))throw new TypeError("Unknown encoding: "+e);var r=0|m(t,e),n=l(r),o=n.write(t,e);o!==r&&(n=n.slice(0,o));return n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(tt(t,Uint8Array)){var e=new Uint8Array(t);return v(e.buffer,e.byteOffset,e.byteLength)}return w(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(tt(t,ArrayBuffer)||t&&tt(t.buffer,ArrayBuffer))return v(t,e,r);if("undefined"!==typeof SharedArrayBuffer&&(tt(t,SharedArrayBuffer)||t&&tt(t.buffer,SharedArrayBuffer)))return v(t,e,r);if("number"===typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');var n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return p.from(n,e,r);var o=function(t){if(p.isBuffer(t)){var e=0|b(t.length),r=l(e);return 0===r.length||t.copy(r,0,0,e),r}if(void 0!==t.length)return"number"!==typeof t.length||et(t.length)?l(0):w(t);if("Buffer"===t.type&&Array.isArray(t.data))return w(t.data)}(t);if(o)return o;if("undefined"!==typeof Symbol&&null!=Symbol.toPrimitive&&"function"===typeof t[Symbol.toPrimitive])return p.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function y(t){if("number"!==typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function d(t){return y(t),l(t<0?0:0|b(t))}function w(t){for(var e=t.length<0?0:0|b(t.length),r=l(e),n=0;n<e;n+=1)r[n]=255&t[n];return r}function v(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');var n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,p.prototype),n}function b(t){if(t>=h)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+h.toString(16)+" bytes");return 0|t}function m(t,e){if(p.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||tt(t,ArrayBuffer))return t.byteLength;if("string"!==typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);var r=t.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var o=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return Q(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return X(t).length;default:if(o)return n?-1:Q(t).length;e=(""+e).toLowerCase(),o=!0}}function E(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return P(this,e,r);case"utf8":case"utf-8":return j(this,e,r);case"ascii":return T(this,e,r);case"latin1":case"binary":return x(this,e,r);case"base64":return S(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return k(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function B(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function A(t,e,r,n,o){if(0===t.length)return-1;if("string"===typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),et(r=+r)&&(r=o?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(o)return-1;r=t.length-1}else if(r<0){if(!o)return-1;r=0}if("string"===typeof e&&(e=p.from(e,n)),p.isBuffer(e))return 0===e.length?-1:I(t,e,r,n,o);if("number"===typeof e)return e&=255,"function"===typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):I(t,[e],r,n,o);throw new TypeError("val must be string, number or Buffer")}function I(t,e,r,n,o){var i,a=1,f=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;a=2,f/=2,u/=2,r/=2}function s(t,e){return 1===a?t[e]:t.readUInt16BE(e*a)}if(o){var c=-1;for(i=r;i<f;i++)if(s(t,i)===s(e,-1===c?0:i-c)){if(-1===c&&(c=i),i-c+1===u)return c*a}else-1!==c&&(i-=i-c),c=-1}else for(r+u>f&&(r=f-u),i=r;i>=0;i--){for(var h=!0,l=0;l<u;l++)if(s(t,i+l)!==s(e,l)){h=!1;break}if(h)return i}return-1}function U(t,e,r,n){r=Number(r)||0;var o=t.length-r;n?(n=Number(n))>o&&(n=o):n=o;var i,a=e.length;for(n>a/2&&(n=a/2),i=0;i<n;++i){var f=parseInt(e.substr(2*i,2),16);if(et(f))return i;t[r+i]=f}return i}function O(t,e,r,n){return $(Q(e,t.length-r),t,r,n)}function C(t,e,r,n){return $(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function R(t,e,r,n){return $(X(e),t,r,n)}function M(t,e,r,n){return $(function(t,e){for(var r,n,o,i=[],a=0;a<t.length&&!((e-=2)<0);++a)n=(r=t.charCodeAt(a))>>8,o=r%256,i.push(o),i.push(n);return i}(e,t.length-r),t,r,n)}function S(t,e,r){return 0===e&&r===t.length?u.fromByteArray(t):u.fromByteArray(t.slice(e,r))}function j(t,e,r){r=Math.min(t.length,r);for(var n=[],o=e;o<r;){var i=t[o],a=null,f=i>239?4:i>223?3:i>191?2:1;if(o+f<=r){var u=void 0,s=void 0,c=void 0,h=void 0;switch(f){case 1:i<128&&(a=i);break;case 2:128===(192&(u=t[o+1]))&&(h=(31&i)<<6|63&u)>127&&(a=h);break;case 3:u=t[o+1],s=t[o+2],128===(192&u)&&128===(192&s)&&(h=(15&i)<<12|(63&u)<<6|63&s)>2047&&(h<55296||h>57343)&&(a=h);break;case 4:u=t[o+1],s=t[o+2],c=t[o+3],128===(192&u)&&128===(192&s)&&128===(192&c)&&(h=(15&i)<<18|(63&u)<<12|(63&s)<<6|63&c)>65535&&h<1114112&&(a=h)}}null===a?(a=65533,f=1):a>65535&&(a-=65536,n.push(a>>>10&1023|55296),a=56320|1023&a),n.push(a),o+=f}return function(t){var e=t.length;if(e<=L)return String.fromCharCode.apply(String,t);var r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=L));return r}(n)}p.TYPED_ARRAY_SUPPORT=function(){try{var t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(r){return!1}}(),p.TYPED_ARRAY_SUPPORT||"undefined"===typeof console||"function"!==typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(p.prototype,"parent",{enumerable:!0,get:function(){if(p.isBuffer(this))return this.buffer}}),Object.defineProperty(p.prototype,"offset",{enumerable:!0,get:function(){if(p.isBuffer(this))return this.byteOffset}}),p.poolSize=8192,p.from=function(t,e,r){return g(t,e,r)},Object.setPrototypeOf(p.prototype,Uint8Array.prototype),Object.setPrototypeOf(p,Uint8Array),p.alloc=function(t,e,r){return function(t,e,r){return y(t),t<=0?l(t):void 0!==e?"string"===typeof r?l(t).fill(e,r):l(t).fill(e):l(t)}(t,e,r)},p.allocUnsafe=function(t){return d(t)},p.allocUnsafeSlow=function(t){return d(t)},p.isBuffer=function(t){return null!=t&&!0===t._isBuffer&&t!==p.prototype},p.compare=function(t,e){if(tt(t,Uint8Array)&&(t=p.from(t,t.offset,t.byteLength)),tt(e,Uint8Array)&&(e=p.from(e,e.offset,e.byteLength)),!p.isBuffer(t)||!p.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;for(var r=t.length,n=e.length,o=0,i=Math.min(r,n);o<i;++o)if(t[o]!==e[o]){r=t[o],n=e[o];break}return r<n?-1:n<r?1:0},p.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},p.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return p.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=p.allocUnsafe(e),o=0;for(r=0;r<t.length;++r){var i=t[r];if(tt(i,Uint8Array))o+i.length>n.length?(p.isBuffer(i)||(i=p.from(i)),i.copy(n,o)):Uint8Array.prototype.set.call(n,i,o);else{if(!p.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,o)}o+=i.length}return n},p.byteLength=m,p.prototype._isBuffer=!0,p.prototype.swap16=function(){var t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)B(this,e,e+1);return this},p.prototype.swap32=function(){var t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)B(this,e,e+3),B(this,e+1,e+2);return this},p.prototype.swap64=function(){var t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)B(this,e,e+7),B(this,e+1,e+6),B(this,e+2,e+5),B(this,e+3,e+4);return this},p.prototype.toString=function(){var t=this.length;return 0===t?"":0===arguments.length?j(this,0,t):E.apply(this,arguments)},p.prototype.toLocaleString=p.prototype.toString,p.prototype.equals=function(t){if(!p.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===p.compare(this,t)},p.prototype.inspect=function(){var t="",r=e.h2;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},c&&(p.prototype[c]=p.prototype.inspect),p.prototype.compare=function(t,e,r,n,o){if(tt(t,Uint8Array)&&(t=p.from(t,t.offset,t.byteLength)),!p.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),e<0||r>t.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&e>=r)return 0;if(n>=o)return-1;if(e>=r)return 1;if(this===t)return 0;for(var i=(o>>>=0)-(n>>>=0),a=(r>>>=0)-(e>>>=0),f=Math.min(i,a),u=this.slice(n,o),s=t.slice(e,r),c=0;c<f;++c)if(u[c]!==s[c]){i=u[c],a=s[c];break}return i<a?-1:a<i?1:0},p.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},p.prototype.indexOf=function(t,e,r){return A(this,t,e,r,!0)},p.prototype.lastIndexOf=function(t,e,r){return A(this,t,e,r,!1)},p.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"===typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var o=this.length-e;if((void 0===r||r>o)&&(r=o),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return U(this,t,e,r);case"utf8":case"utf-8":return O(this,t,e,r);case"ascii":case"latin1":case"binary":return C(this,t,e,r);case"base64":return R(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,t,e,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},p.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var L=4096;function T(t,e,r){var n="";r=Math.min(t.length,r);for(var o=e;o<r;++o)n+=String.fromCharCode(127&t[o]);return n}function x(t,e,r){var n="";r=Math.min(t.length,r);for(var o=e;o<r;++o)n+=String.fromCharCode(t[o]);return n}function P(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var o="",i=e;i<r;++i)o+=rt[t[i]];return o}function k(t,e,r){for(var n=t.slice(e,r),o="",i=0;i<n.length-1;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}function _(t,e,r){if(t%1!==0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function N(t,e,r,n,o,i){if(!p.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>o||e<i)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function W(t,e,r,n,o){V(e,n,o,t,r,7);var i=Number(e&BigInt(4294967295));t[r++]=i,i>>=8,t[r++]=i,i>>=8,t[r++]=i,i>>=8,t[r++]=i;var a=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=a,a>>=8,t[r++]=a,a>>=8,t[r++]=a,a>>=8,t[r++]=a,r}function Z(t,e,r,n,o){V(e,n,o,t,r,7);var i=Number(e&BigInt(4294967295));t[r+7]=i,i>>=8,t[r+6]=i,i>>=8,t[r+5]=i,i>>=8,t[r+4]=i;var a=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=a,a>>=8,t[r+2]=a,a>>=8,t[r+1]=a,a>>=8,t[r]=a,r+8}function D(t,e,r,n,o,i){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function F(t,e,r,n,o){return e=+e,r>>>=0,o||D(t,0,r,4),s.write(t,e,r,n,23,4),r+4}function z(t,e,r,n,o){return e=+e,r>>>=0,o||D(t,0,r,8),s.write(t,e,r,n,52,8),r+8}p.prototype.slice=function(t,e){var r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);var n=this.subarray(t,e);return Object.setPrototypeOf(n,p.prototype),n},p.prototype.readUintLE=p.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||_(t,e,this.length);for(var n=this[t],o=1,i=0;++i<e&&(o*=256);)n+=this[t+i]*o;return n},p.prototype.readUintBE=p.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||_(t,e,this.length);for(var n=this[t+--e],o=1;e>0&&(o*=256);)n+=this[t+--e]*o;return n},p.prototype.readUint8=p.prototype.readUInt8=function(t,e){return t>>>=0,e||_(t,1,this.length),this[t]},p.prototype.readUint16LE=p.prototype.readUInt16LE=function(t,e){return t>>>=0,e||_(t,2,this.length),this[t]|this[t+1]<<8},p.prototype.readUint16BE=p.prototype.readUInt16BE=function(t,e){return t>>>=0,e||_(t,2,this.length),this[t]<<8|this[t+1]},p.prototype.readUint32LE=p.prototype.readUInt32LE=function(t,e){return t>>>=0,e||_(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},p.prototype.readUint32BE=p.prototype.readUInt32BE=function(t,e){return t>>>=0,e||_(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},p.prototype.readBigUInt64LE=nt((function(t){H(t>>>=0,"offset");var e=this[t],r=this[t+7];void 0!==e&&void 0!==r||K(t,this.length-8);var n=e+this[++t]*Math.pow(2,8)+this[++t]*Math.pow(2,16)+this[++t]*Math.pow(2,24),o=this[++t]+this[++t]*Math.pow(2,8)+this[++t]*Math.pow(2,16)+r*Math.pow(2,24);return BigInt(n)+(BigInt(o)<<BigInt(32))})),p.prototype.readBigUInt64BE=nt((function(t){H(t>>>=0,"offset");var e=this[t],r=this[t+7];void 0!==e&&void 0!==r||K(t,this.length-8);var n=e*Math.pow(2,24)+this[++t]*Math.pow(2,16)+this[++t]*Math.pow(2,8)+this[++t],o=this[++t]*Math.pow(2,24)+this[++t]*Math.pow(2,16)+this[++t]*Math.pow(2,8)+r;return(BigInt(n)<<BigInt(32))+BigInt(o)})),p.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||_(t,e,this.length);for(var n=this[t],o=1,i=0;++i<e&&(o*=256);)n+=this[t+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*e)),n},p.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||_(t,e,this.length);for(var n=e,o=1,i=this[t+--n];n>0&&(o*=256);)i+=this[t+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*e)),i},p.prototype.readInt8=function(t,e){return t>>>=0,e||_(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},p.prototype.readInt16LE=function(t,e){t>>>=0,e||_(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},p.prototype.readInt16BE=function(t,e){t>>>=0,e||_(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},p.prototype.readInt32LE=function(t,e){return t>>>=0,e||_(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},p.prototype.readInt32BE=function(t,e){return t>>>=0,e||_(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},p.prototype.readBigInt64LE=nt((function(t){H(t>>>=0,"offset");var e=this[t],r=this[t+7];void 0!==e&&void 0!==r||K(t,this.length-8);var n=this[t+4]+this[t+5]*Math.pow(2,8)+this[t+6]*Math.pow(2,16)+(r<<24);return(BigInt(n)<<BigInt(32))+BigInt(e+this[++t]*Math.pow(2,8)+this[++t]*Math.pow(2,16)+this[++t]*Math.pow(2,24))})),p.prototype.readBigInt64BE=nt((function(t){H(t>>>=0,"offset");var e=this[t],r=this[t+7];void 0!==e&&void 0!==r||K(t,this.length-8);var n=(e<<24)+this[++t]*Math.pow(2,16)+this[++t]*Math.pow(2,8)+this[++t];return(BigInt(n)<<BigInt(32))+BigInt(this[++t]*Math.pow(2,24)+this[++t]*Math.pow(2,16)+this[++t]*Math.pow(2,8)+r)})),p.prototype.readFloatLE=function(t,e){return t>>>=0,e||_(t,4,this.length),s.read(this,t,!0,23,4)},p.prototype.readFloatBE=function(t,e){return t>>>=0,e||_(t,4,this.length),s.read(this,t,!1,23,4)},p.prototype.readDoubleLE=function(t,e){return t>>>=0,e||_(t,8,this.length),s.read(this,t,!0,52,8)},p.prototype.readDoubleBE=function(t,e){return t>>>=0,e||_(t,8,this.length),s.read(this,t,!1,52,8)},p.prototype.writeUintLE=p.prototype.writeUIntLE=function(t,e,r,n){(t=+t,e>>>=0,r>>>=0,n)||N(this,t,e,r,Math.pow(2,8*r)-1,0);var o=1,i=0;for(this[e]=255&t;++i<r&&(o*=256);)this[e+i]=t/o&255;return e+r},p.prototype.writeUintBE=p.prototype.writeUIntBE=function(t,e,r,n){(t=+t,e>>>=0,r>>>=0,n)||N(this,t,e,r,Math.pow(2,8*r)-1,0);var o=r-1,i=1;for(this[e+o]=255&t;--o>=0&&(i*=256);)this[e+o]=t/i&255;return e+r},p.prototype.writeUint8=p.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,1,255,0),this[e]=255&t,e+1},p.prototype.writeUint16LE=p.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},p.prototype.writeUint16BE=p.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},p.prototype.writeUint32LE=p.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},p.prototype.writeUint32BE=p.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},p.prototype.writeBigUInt64LE=nt((function(t){return W(this,t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,BigInt(0),BigInt("0xffffffffffffffff"))})),p.prototype.writeBigUInt64BE=nt((function(t){return Z(this,t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,BigInt(0),BigInt("0xffffffffffffffff"))})),p.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){var o=Math.pow(2,8*r-1);N(this,t,e,r,o-1,-o)}var i=0,a=1,f=0;for(this[e]=255&t;++i<r&&(a*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/a>>0)-f&255;return e+r},p.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){var o=Math.pow(2,8*r-1);N(this,t,e,r,o-1,-o)}var i=r-1,a=1,f=0;for(this[e+i]=255&t;--i>=0&&(a*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/a>>0)-f&255;return e+r},p.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},p.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},p.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},p.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},p.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||N(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},p.prototype.writeBigInt64LE=nt((function(t){return W(this,t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),p.prototype.writeBigInt64BE=nt((function(t){return Z(this,t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),p.prototype.writeFloatLE=function(t,e,r){return F(this,t,e,!0,r)},p.prototype.writeFloatBE=function(t,e,r){return F(this,t,e,!1,r)},p.prototype.writeDoubleLE=function(t,e,r){return z(this,t,e,!0,r)},p.prototype.writeDoubleBE=function(t,e,r){return z(this,t,e,!1,r)},p.prototype.copy=function(t,e,r,n){if(!p.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var o=n-r;return this===t&&"function"===typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),o},p.prototype.fill=function(t,e,r,n){if("string"===typeof t){if("string"===typeof e?(n=e,e=0,r=this.length):"string"===typeof r&&(n=r,r=this.length),void 0!==n&&"string"!==typeof n)throw new TypeError("encoding must be a string");if("string"===typeof n&&!p.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){var o=t.charCodeAt(0);("utf8"===n&&o<128||"latin1"===n)&&(t=o)}}else"number"===typeof t?t&=255:"boolean"===typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"===typeof t)for(i=e;i<r;++i)this[i]=t;else{var a=p.isBuffer(t)?t:p.from(t,n),f=a.length;if(0===f)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=a[i%f]}return this};var G={};function Y(t,e,r){G[t]=function(r){a(s,r);var u=f(s);function s(){var r;return n(this,s),r=u.call(this),Object.defineProperty(i(r),"message",{value:e.apply(i(r),arguments),writable:!0,configurable:!0}),r.name="".concat(r.name," [").concat(t,"]"),r.stack,delete r.name,r}return o(s,[{key:"code",get:function(){return t},set:function(t){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:t,writable:!0})}},{key:"toString",value:function(){return"".concat(this.name," [").concat(t,"]: ").concat(this.message)}}]),s}(r)}function q(t){for(var e="",r=t.length,n="-"===t[0]?1:0;r>=n+4;r-=3)e="_".concat(t.slice(r-3,r)).concat(e);return"".concat(t.slice(0,r)).concat(e)}function V(t,e,r,n,o,i){if(t>r||t<e){var a,f="bigint"===typeof e?"n":"";throw a=i>3?0===e||e===BigInt(0)?">= 0".concat(f," and < 2").concat(f," ** ").concat(8*(i+1)).concat(f):">= -(2".concat(f," ** ").concat(8*(i+1)-1).concat(f,") and < 2 ** ")+"".concat(8*(i+1)-1).concat(f):">= ".concat(e).concat(f," and <= ").concat(r).concat(f),new G.ERR_OUT_OF_RANGE("value",a,t)}!function(t,e,r){H(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||K(e,t.length-(r+1))}(n,o,i)}function H(t,e){if("number"!==typeof t)throw new G.ERR_INVALID_ARG_TYPE(e,"number",t)}function K(t,e,r){if(Math.floor(t)!==t)throw H(t,r),new G.ERR_OUT_OF_RANGE(r||"offset","an integer",t);if(e<0)throw new G.ERR_BUFFER_OUT_OF_BOUNDS;throw new G.ERR_OUT_OF_RANGE(r||"offset",">= ".concat(r?1:0," and <= ").concat(e),t)}Y("ERR_BUFFER_OUT_OF_BOUNDS",(function(t){return t?"".concat(t," is outside of buffer bounds"):"Attempt to access memory outside buffer bounds"}),RangeError),Y("ERR_INVALID_ARG_TYPE",(function(t,e){return'The "'.concat(t,'" argument must be of type number. Received type ').concat(typeof e)}),TypeError),Y("ERR_OUT_OF_RANGE",(function(t,e,r){var n='The value of "'.concat(t,'" is out of range.'),o=r;return Number.isInteger(r)&&Math.abs(r)>Math.pow(2,32)?o=q(String(r)):"bigint"===typeof r&&(o=String(r),(r>Math.pow(BigInt(2),BigInt(32))||r<-Math.pow(BigInt(2),BigInt(32)))&&(o=q(o)),o+="n"),n+=" It must be ".concat(e,". Received ").concat(o)}),RangeError);var J=/[^+/0-9A-Za-z-_]/g;function Q(t,e){var r;e=e||1/0;for(var n=t.length,o=null,i=[],a=0;a<n;++a){if((r=t.charCodeAt(a))>55295&&r<57344){if(!o){if(r>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(a+1===n){(e-=3)>-1&&i.push(239,191,189);continue}o=r;continue}if(r<56320){(e-=3)>-1&&i.push(239,191,189),o=r;continue}r=65536+(o-55296<<10|r-56320)}else o&&(e-=3)>-1&&i.push(239,191,189);if(o=null,r<128){if((e-=1)<0)break;i.push(r)}else if(r<2048){if((e-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function X(t){return u.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(J,"")).length<2)return"";for(;t.length%4!==0;)t+="=";return t}(t))}function $(t,e,r,n){var o;for(o=0;o<n&&!(o+r>=e.length||o>=t.length);++o)e[o+r]=t[o];return o}function tt(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function et(t){return t!==t}var rt=function(){for(var t="0123456789abcdef",e=new Array(256),r=0;r<16;++r)for(var n=16*r,o=0;o<16;++o)e[n+o]=t[r]+t[o];return e}();function nt(t){return"undefined"===typeof BigInt?ot:t}function ot(){throw new Error("BigInt not supported")}},9632:function(t,e){e.read=function(t,e,r,n,o){var i,a,f=8*o-n-1,u=(1<<f)-1,s=u>>1,c=-7,h=r?o-1:0,l=r?-1:1,p=t[e+h];for(h+=l,i=p&(1<<-c)-1,p>>=-c,c+=f;c>0;i=256*i+t[e+h],h+=l,c-=8);for(a=i&(1<<-c)-1,i>>=-c,c+=n;c>0;a=256*a+t[e+h],h+=l,c-=8);if(0===i)i=1-s;else{if(i===u)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,n),i-=s}return(p?-1:1)*a*Math.pow(2,i-n)},e.write=function(t,e,r,n,o,i){var a,f,u,s=8*i-o-1,c=(1<<s)-1,h=c>>1,l=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:i-1,g=n?1:-1,y=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(f=isNaN(e)?1:0,a=c):(a=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-a))<1&&(a--,u*=2),(e+=a+h>=1?l/u:l*Math.pow(2,1-h))*u>=2&&(a++,u/=2),a+h>=c?(f=0,a=c):a+h>=1?(f=(e*u-1)*Math.pow(2,o),a+=h):(f=e*Math.pow(2,h-1)*Math.pow(2,o),a=0));o>=8;t[r+p]=255&f,p+=g,f/=256,o-=8);for(a=a<<o|f,s+=o;s>0;t[r+p]=255&a,p+=g,a/=256,s-=8);t[r+p-g]|=128*y}},6330:function(t,e,r){"use strict";r.r(e),r.d(e,{ClientCtrl:function(){return U},ConfigCtrl:function(){return C},CoreHelpers:function(){return D},ExplorerCtrl:function(){return T},ModalCtrl:function(){return _},OptionsCtrl:function(){return A},RouterCtrl:function(){return P},ToastCtrl:function(){return W},getExplorerApi:function(){return M}});var n=r(3433),o=r(4165),i=r(5861),a=r(9439),f=(Symbol(),Symbol(),Symbol()),u=Object.getPrototypeOf,s=new WeakMap,c=function(t){return t&&(s.has(t)?s.get(t):u(t)===Object.prototype||u(t)===Array.prototype)},h=(new WeakMap,function(t){return c(t)&&t[f]||null}),l=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];s.set(t,e)},p=function(t){return"object"===typeof t&&null!==t},g=Symbol(),y=new WeakSet,d=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Object.is,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(t,e){return new Proxy(t,e)},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(t){return p(t)&&!y.has(t)&&(Array.isArray(t)||!(Symbol.iterator in t))&&!(t instanceof WeakMap)&&!(t instanceof WeakSet)&&!(t instanceof Error)&&!(t instanceof Number)&&!(t instanceof Date)&&!(t instanceof String)&&!(t instanceof RegExp)&&!(t instanceof ArrayBuffer)},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:throw t}},i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:new WeakMap,f=arguments.length>5&&void 0!==arguments[5]?arguments[5]:function(t,e,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:o,f=i.get(e);if((null==f?void 0:f[0])===r)return f[1];var u=Array.isArray(t)?[]:Object.create(Object.getPrototypeOf(t));return l(u,!0),i.set(e,[r,u]),Reflect.ownKeys(t).forEach((function(r){var o=Reflect.get(t,r,e);y.has(o)?(l(o,!1),u[r]=o):o instanceof Promise?Object.defineProperty(u,r,{get:function(){return n(o)}}):(null==o?void 0:o[g])?u[r]=function(t,e){(null==t?void 0:t[g])||console.warn("Please use proxy object");var r=(0,a.Z)(t[g],4),n=r[0],o=r[1],i=r[2],f=r[3];return f(n,o,i,e)}(o,n):u[r]=o})),Object.freeze(u)},u=arguments.length>6&&void 0!==arguments[6]?arguments[6]:new WeakMap,s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:[1],c=arguments.length>8&&void 0!==arguments[8]?arguments[8]:function(o){if(!p(o))throw new Error("object required");var i=u.get(o);if(i)return i;var a=s[0],c=new Set,l=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:++s[0];a!==e&&(a=e,c.forEach((function(r){return r(t,e)})))},y=new Map,d=function(t){var e=y.get(t);return y.delete(t),e},w=Array.isArray(o)?[]:Object.create(Object.getPrototypeOf(o)),v={get:function(t,e,r){return e===g?[t,r,a,f,c]:Reflect.get(t,e,r)},deleteProperty:function(t,e){var r,n=Reflect.get(t,e),o=null==(r=null==n?void 0:n[g])?void 0:r[4];o&&o.delete(d(e));var i=Reflect.deleteProperty(t,e);return i&&l(["delete",[e],n]),i},set:function(e,o,i,a){var f,u,s=Reflect.has(e,o),c=Reflect.get(e,o,a);if(s&&t(c,i))return!0;var w=null==(f=null==c?void 0:c[g])?void 0:f[4];w&&w.delete(d(o)),p(i)&&(i=h(i)||i);var v=i;return(null==(u=Object.getOwnPropertyDescriptor(e,o))?void 0:u.set)||(i instanceof Promise?i.then((function(t){i.status="fulfilled",i.value=t,l(["resolve",[o],t])})).catch((function(t){i.status="rejected",i.reason=t,l(["reject",[o],t])})):(!(null==i?void 0:i[g])&&r(i)&&(v=b(i)),(null==v?void 0:v[g])&&v[g][4].add(function(t){var e=y.get(t);return e||(e=function(e,r){var o=(0,n.Z)(e);o[1]=[t].concat((0,n.Z)(o[1])),l(o,r)},y.set(t,e)),e}(o)))),Reflect.set(e,o,v,a),l(["set",[o],i,c]),!0}},m=e(w,v);return u.set(o,m),Reflect.ownKeys(o).forEach((function(t){var e=Object.getOwnPropertyDescriptor(o,t);e.get||e.set?Object.defineProperty(w,t,e):m[t]=o[t]})),m};return[c,g,y,t,e,r,o,i,f,u,s]},w=d(),v=(0,a.Z)(w,1)[0];function b(){return v(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{})}function m(t,e,r){var n;(null==t?void 0:t[g])||console.warn("Please use proxy object");var o=[],i=t[g][4],a=function t(a){o.push(a),r?e(o.splice(0)):n||(n=Promise.resolve().then((function(){n=void 0,i.has(t)&&e(o.splice(0))})))};return i.add(a),function(){return i.delete(a)}}var E=r(4209),B=b({selectedChainId:void 0,chains:void 0,standaloneChains:void 0,standaloneUri:void 0}),A={state:B,setChains:function(t){B.chains=t},setStandaloneChains:function(t){B.standaloneChains=t},setStandaloneUri:function(t){B.standaloneUri=t},setSelectedChainId:function(t){B.selectedChainId=t}},I=b({initialized:!1,ethereumClient:void 0}),U={setEthereumClient:function(t){!I.initialized&&t&&(I.ethereumClient=t,A.setChains(t.chains),I.initialized=!0)},client:function(){if(I.ethereumClient)return I.ethereumClient;throw new Error("ClientCtrl has no client set")}};var O=b({configured:!1,projectId:"",theme:typeof matchMedia<"u"&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",accentColor:"default",standaloneChains:void 0}),C={state:O,subscribe:function(t){return m(O,(function(){return t(O)}))},setConfig:function(t){var e;if(!t.projectId)throw new Error("Web3Modal requires projectId that can be obtained at cloud.walletconnect.com");null!=(e=t.standaloneChains)&&e.length&&A.setStandaloneChains(t.standaloneChains),Object.assign(O,t),O.configured=!0}};function R(t){var e=Object.fromEntries(Object.entries(t).filter((function(t){var e=(0,a.Z)(t,2),r=(e[0],e[1]);return typeof r<"u"&&null!==r&&""!==r})).map((function(t){var e=(0,a.Z)(t,2);return[e[0],e[1].toString()]})));return new URLSearchParams(e).toString()}function M(){return{url:"https://explorer-api.walletconnect.com",projectId:C.state.projectId}}function S(t){return j.apply(this,arguments)}function j(){return j=(0,i.Z)((0,o.Z)().mark((function t(e){var r,n,i,a;return(0,o.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=M(),n=r.url,i=r.projectId,a="".concat(n,"/v3/wallets?projectId=").concat(i,"&").concat(R(e)),t.next=3,fetch(a);case 3:return t.abrupt("return",t.sent.json());case 4:case"end":return t.stop()}}),t)}))),j.apply(this,arguments)}var L=b({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},previewWallets:[],recomendedWallets:[]}),T={state:L,subscribe:function(t){return m(L,(function(){return t(L)}))},getPreviewWallets:function(t){return(0,i.Z)((0,o.Z)().mark((function e(){var r,n;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S(t);case 2:return r=e.sent,n=r.listings,e.abrupt("return",(L.previewWallets=Object.values(n),L.previewWallets));case 5:case"end":return e.stop()}}),e)})))()},getRecomendedWallets:function(){return(0,i.Z)((0,o.Z)().mark((function t(){var e,r;return(0,o.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,S({page:1,entries:6});case 2:e=t.sent,r=e.listings,L.recomendedWallets=Object.values(r);case 5:case"end":return t.stop()}}),t)})))()},getPaginatedWallets:function(t){return(0,i.Z)((0,o.Z)().mark((function e(){var r,i,a,f,u,s,c;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.page,i=t.search,e.next=4,S(t);case 4:return a=e.sent,f=a.listings,u=a.total,s=Object.values(f),c=i?"search":"wallets",e.abrupt("return",(L[c]={listings:[].concat((0,n.Z)(L[c].listings),s),total:u,page:null!==r&&void 0!==r?r:1},{listings:s,total:u}));case 10:case"end":return e.stop()}}),e)})))()},resetSearch:function(){L.search={listings:[],total:0,page:1}}},x=b({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),P={state:x,subscribe:function(t){return m(x,(function(){return t(x)}))},push:function(t,e){t!==x.view&&(x.view=t,e&&(x.data=e),x.history.push(t))},replace:function(t){x.view=t,x.history=[t]},goBack:function(){if(x.history.length>1){x.history.pop();var t=x.history.slice(-1),e=(0,a.Z)(t,1)[0];x.view=e}}},k=b({open:!1}),_={state:k,subscribe:function(t){return m(k,(function(){return t(k)}))},open:function(t){var e,r=A.state.chains;null!=r&&r.length&&r.length>1?P.replace("SelectNetwork"):P.replace("ConnectWallet"),"string"==typeof(null===t||void 0===t?void 0:t.uri)&&A.setStandaloneUri(t.uri),null!=(e=null===t||void 0===t?void 0:t.standaloneChains)&&e.length&&A.setStandaloneChains(t.standaloneChains),k.open=!0},close:function(){k.open=!1}},N=b({open:!1,message:"",variant:"success"}),W={state:N,subscribe:function(t){return m(N,(function(){return t(N)}))},openToast:function(t,e){N.open=!0,N.message=t,N.variant=e},closeToast:function(){N.open=!1}},Z="WALLETCONNECT_DEEPLINK_CHOICE",D={isCoinbaseExtension:function(){return window.coinbaseWalletExtension},isMobile:function(){return Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/.test(navigator.userAgent))},isEmptyObject:function(t){return Object.getPrototypeOf(t)===Object.prototype&&0===Object.getOwnPropertyNames(t).length&&0===Object.getOwnPropertySymbols(t).length},formatNativeUrl:function(t,e,r){var n=t.replaceAll("/","").replaceAll(":","");this.setWalletConnectDeepLink(n,r);var o=encodeURIComponent(e);return"".concat(n,"://wc?uri=").concat(o)},formatUniversalUrl:function(t,e,r){var n=t;t.endsWith("/")&&(n=t.slice(0,-1)),this.setWalletConnectDeepLink(n,r);var o=encodeURIComponent(e);return"".concat(n,"/wc?uri=").concat(o)},wait:function(t){return(0,i.Z)((0,o.Z)().mark((function e(){return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e){setTimeout(e,t)})));case 1:case"end":return e.stop()}}),e)})))()},openHref:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"_self";window.open(t,e,"noreferrer noopener")},setWalletConnectDeepLink:function(t,e){localStorage.setItem(Z,JSON.stringify({href:t,name:e}))},removeWalletConnectDeepLink:function(){localStorage.removeItem(Z)},isNull:function(t){return null===t}};typeof window<"u"&&(window.Buffer||(window.Buffer=E.lW),window.global||(window.global=window),window.process||(window.process={env:{}}))}}]);
//# sourceMappingURL=330.50d8a0d4.chunk.js.map