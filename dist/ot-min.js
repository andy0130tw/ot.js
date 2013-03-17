/*
 *    /\
 *   /  \ ot 0.0.11
 *  /    \ http://operational-transformation.github.com
 *  \    /
 *   \  / (c) 2012-2013 Tim Baumann <tim@timbaumann.info> (http://timbaumann.info)
 *    \/ ot may be freely distributed under the MIT license.
 */

if(ot===void 0)var ot={};if(ot.TextOperation=function(){"use strict";function t(){return this&&this.constructor===t?(this.ops=[],this.baseLength=0,this.targetLength=0,void 0):new t}t.prototype.equals=function(t){if(this.baseLength!==t.baseLength)return!1;if(this.targetLength!==t.targetLength)return!1;if(this.ops.length!==t.ops.length)return!1;for(var e=0;this.ops.length>e;e++)if(this.ops[e]!==t.ops[e])return!1;return!0};var e=t.isRetain=function(t){return"number"==typeof t&&t>0},o=t.isInsert=function(t){return"string"==typeof t},r=t.isDelete=function(t){return"number"==typeof t&&0>t};return t.prototype.retain=function(t){if("number"!=typeof t)throw Error("retain expects an integer");return 0===t?this:(this.baseLength+=t,this.targetLength+=t,e(this.ops[this.ops.length-1])?this.ops[this.ops.length-1]+=t:this.ops.push(t),this)},t.prototype.insert=function(t){if("string"!=typeof t)throw Error("insert expects a string");if(""===t)return this;this.targetLength+=t.length;var e=this.ops;return o(e[e.length-1])?e[e.length-1]+=t:r(e[e.length-1])?o(e[e.length-2])?e[e.length-2]+=t:(e[e.length]=e[e.length-1],e[e.length-2]=t):e.push(t),this},t.prototype["delete"]=function(t){if("string"==typeof t&&(t=t.length),"number"!=typeof t)throw Error("delete expects an integer or a string");return 0===t?this:(t>0&&(t=-t),this.baseLength-=t,r(this.ops[this.ops.length-1])?this.ops[this.ops.length-1]+=t:this.ops.push(t),this)},t.prototype.isNoop=function(){return 0===this.ops.length||1===this.ops.length&&e(this.ops[0])},t.prototype.toString=function(){var t=Array.prototype.map||function(t){for(var e=this,o=[],r=0,n=e.length;n>r;r++)o[r]=t(e[r]);return o};return t.call(this.ops,function(t){return e(t)?"retain "+t:o(t)?"insert '"+t+"'":"delete "+-t}).join(", ")},t.prototype.toJSON=function(){return this.ops},t.fromJSON=function(n){for(var i=new t,s=0,a=n.length;a>s;s++){var p=n[s];if(e(p))i.retain(p);else if(o(p))i.insert(p);else{if(!r(p))throw Error("unknown operation: "+JSON.stringify(p));i["delete"](p)}}return i},t.prototype.apply=function(t){var r=this;if(t.length!==r.baseLength)throw Error("The operation's base length must be equal to the string's length.");for(var n=[],i=0,s=0,a=this.ops,p=0,h=a.length;h>p;p++){var u=a[p];if(e(u)){if(s+u>t.length)throw Error("Operation can't retain more characters than are left in the string.");n[i++]=t.slice(s,s+u),s+=u}else o(u)?n[i++]=u:s-=u}if(s!==t.length)throw Error("The operation didn't operate on the whole string.");return n.join("")},t.prototype.invert=function(r){for(var n=0,i=new t,s=this.ops,a=0,p=s.length;p>a;a++){var h=s[a];e(h)?(i.retain(h),n+=h):o(h)?i["delete"](h.length):(i.insert(r.slice(n,n-h)),n-=h)}return i},t.prototype.compose=function(n){var i=this;if(i.targetLength!==n.baseLength)throw Error("The base length of the second operation has to be the target length of the first operation");for(var s=new t,a=i.ops,p=n.ops,h=0,u=0,c=a[h++],l=p[u++];;){if(c===void 0&&l===void 0)break;if(r(c))s["delete"](c),c=a[h++];else if(o(l))s.insert(l),l=p[u++];else{if(c===void 0)throw Error("Cannot compose operations: first operation is too short.");if(l===void 0)throw Error("Cannot compose operations: first operation is too long.");if(e(c)&&e(l))c>l?(s.retain(l),c-=l,l=p[u++]):c===l?(s.retain(c),c=a[h++],l=p[u++]):(s.retain(c),l-=c,c=a[h++]);else if(o(c)&&r(l))c.length>-l?(c=c.slice(-l),l=p[u++]):c.length===-l?(c=a[h++],l=p[u++]):(l+=c.length,c=a[h++]);else if(o(c)&&e(l))c.length>l?(s.insert(c.slice(0,l)),c=c.slice(l),l=p[u++]):c.length===l?(s.insert(c),c=a[h++],l=p[u++]):(s.insert(c),l-=c.length,c=a[h++]);else{if(!e(c)||!r(l))throw Error("This shouldn't happen: op1: "+JSON.stringify(c)+", op2: "+JSON.stringify(l));c>-l?(s["delete"](l),c+=l,l=p[u++]):c===-l?(s["delete"](l),c=a[h++],l=p[u++]):(s["delete"](c),l+=c,c=a[h++])}}}return s},t.prototype.shouldBeComposedWith=function(n){function i(e){var o=e.ops,r=t.isRetain;switch(o.length){case 1:return o[0];case 2:return r(o[0])?o[1]:r(o[1])?o[0]:null;case 3:if(r(o[0])&&r(o[2]))return o[1]}return null}function s(t){return e(t.ops[0])?t.ops[0]:0}if(this.isNoop()||n.isNoop())return!0;var a=s(this),p=s(n),h=i(this),u=i(n);return h&&u?o(h)&&o(u)?a+h.length===p:r(h)&&r(u)?p-u===a||a===p:!1:!1},t.transform=function(n,i){if(n.baseLength!==i.baseLength)throw Error("Both operations have to have the same base length");for(var s=new t,a=new t,p=n.ops,h=i.ops,u=0,c=0,l=p[u++],f=h[c++];;){if(l===void 0&&f===void 0)break;if(o(l))s.insert(l),a.retain(l.length),l=p[u++];else if(o(f))s.retain(f.length),a.insert(f),f=h[c++];else{if(l===void 0)throw Error("Cannot compose operations: first operation is too short.");if(f===void 0)throw Error("Cannot compose operations: first operation is too long.");var d;if(e(l)&&e(f))l>f?(d=f,l-=f,f=h[c++]):l===f?(d=f,l=p[u++],f=h[c++]):(d=l,f-=l,l=p[u++]),s.retain(d),a.retain(d);else if(r(l)&&r(f))-l>-f?(l-=f,f=h[c++]):l===f?(l=p[u++],f=h[c++]):(f-=l,l=p[u++]);else if(r(l)&&e(f))-l>f?(d=f,l+=f,f=h[c++]):-l===f?(d=f,l=p[u++],f=h[c++]):(d=-l,f+=l,l=p[u++]),s["delete"](d);else{if(!e(l)||!r(f))throw Error("The two operations aren't compatible");l>-f?(d=-f,l+=f,f=h[c++]):l===-f?(d=l,l=p[u++],f=h[c++]):(d=l,f+=l,l=p[u++]),a["delete"](d)}}}return[s,a]},t}(),"object"==typeof module&&(module.exports=ot.TextOperation),ot===void 0)var ot={};if(ot.Cursor=function(t){"use strict";function e(t,e){this.position=t,this.selectionEnd=e}var o=t.ot?t.ot.TextOperation:require("./text-operation");return e.fromJSON=function(t){return new e(t.position,t.selectionEnd)},e.prototype.equals=function(t){return this.position===t.position&&this.selectionEnd===t.selectionEnd},e.prototype.compose=function(t){return t},e.prototype.transform=function(t){function r(e){for(var r=e,n=t.ops,i=0,s=t.ops.length;s>i&&(o.isRetain(n[i])?e-=n[i]:o.isInsert(n[i])?r+=n[i].length:(r-=Math.min(e,-n[i]),e+=n[i]),!(0>e));i++);return r}var n=r(this.position);return this.position===this.selectionEnd?new e(n,n):new e(n,r(this.selectionEnd))},e}(this),"object"==typeof module&&(module.exports=ot.Cursor),ot===void 0)var ot={};if(ot.WrappedOperation=function(){"use strict";function t(t,e){this.wrapped=t,this.meta=e}function e(t,e){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])}function o(t,o){if(t&&"object"==typeof t){if("function"==typeof t.compose)return t.compose(o);var r={};return e(t,r),e(o,r),r}return o}function r(t,e){return t&&"object"==typeof t&&"function"==typeof t.transform?t.transform(e):t}return t.prototype.apply=function(){return this.wrapped.apply.apply(this.wrapped,arguments)},t.prototype.invert=function(){var e=this.meta;return new t(this.wrapped.invert.apply(this.wrapped,arguments),e&&"object"==typeof e&&"function"==typeof e.invert?e.invert.apply(e,arguments):e)},t.prototype.compose=function(e){return new t(this.wrapped.compose(e.wrapped),o(this.meta,e.meta))},t.transform=function(e,o){var n=e.wrapped.constructor.transform,i=n(e.wrapped,o.wrapped);return[new t(i[0],r(e.meta,o.wrapped)),new t(i[1],r(o.meta,e.wrapped))]},t}(this),"object"==typeof module&&(module.exports=ot.WrappedOperation),ot===void 0)var ot={};if(ot.UndoManager=function(){"use strict";function t(t){this.maxItems=t||50,this.state=o,this.dontCompose=!1,this.undoStack=[],this.redoStack=[]}function e(t,e){for(var o=[],r=e.constructor,n=t.length-1;n>=0;n--){var i=r.transform(t[n],e);"function"==typeof i[0].isNoop&&i[0].isNoop()||o.push(i[0]),e=i[1]}return o.reverse()}var o="normal",r="undoing",n="redoing";return t.prototype.add=function(t,e){if(this.state===r)this.redoStack.push(t),this.dontCompose=!0;else if(this.state===n)this.undoStack.push(t),this.dontCompose=!0;else{var o=this.undoStack;!this.dontCompose&&e&&o.length>0?o.push(t.compose(o.pop())):(o.push(t),o.length>this.maxItems&&o.shift()),this.dontCompose=!1,this.redoStack=[]}},t.prototype.transform=function(t){this.undoStack=e(this.undoStack,t),this.redoStack=e(this.redoStack,t)},t.prototype.performUndo=function(t){if(this.state=r,0===this.undoStack.length)throw Error("undo not possible");t(this.undoStack.pop()),this.state=o},t.prototype.performRedo=function(t){if(this.state=n,0===this.redoStack.length)throw Error("redo not possible");t(this.redoStack.pop()),this.state=o},t.prototype.canUndo=function(){return 0!==this.undoStack.length},t.prototype.canRedo=function(){return 0!==this.redoStack.length},t.prototype.isUndoing=function(){return this.state===r},t.prototype.isRedoing=function(){return this.state===n},t}(),"object"==typeof module&&(module.exports=ot.UndoManager),ot===void 0)var ot={};ot.Client=function(){"use strict";function t(t){this.revision=t,this.state=n}function e(){}function o(t){this.outstanding=t}function r(t,e){this.outstanding=t,this.buffer=e}t.prototype.setState=function(t){this.state=t},t.prototype.applyClient=function(t){this.setState(this.state.applyClient(this,t))},t.prototype.applyServer=function(t){this.revision++,this.setState(this.state.applyServer(this,t))},t.prototype.serverAck=function(){this.revision++,this.setState(this.state.serverAck(this))},t.prototype.serverReconnect=function(){"function"==typeof this.state.resend&&this.state.resend(this)},t.prototype.transformCursor=function(t){return this.state.transformCursor(t)},t.prototype.sendOperation=function(){throw Error("sendOperation must be defined in child class")},t.prototype.applyOperation=function(){throw Error("applyOperation must be defined in child class")},t.Synchronized=e,e.prototype.applyClient=function(t,e){return t.sendOperation(t.revision,e),new o(e)},e.prototype.applyServer=function(t,e){return t.applyOperation(e),this},e.prototype.serverAck=function(){throw Error("There is no pending operation.")},e.prototype.transformCursor=function(t){return t};var n=new e;return t.AwaitingConfirm=o,o.prototype.applyClient=function(t,e){return new r(this.outstanding,e)},o.prototype.applyServer=function(t,e){var r=e.constructor.transform(this.outstanding,e);return t.applyOperation(r[1]),new o(r[0])},o.prototype.serverAck=function(){return n},o.prototype.transformCursor=function(t){return t.transform(this.outstanding)},o.prototype.resend=function(t){t.sendOperation(t.revision,this.outstanding)},t.AwaitingWithBuffer=r,r.prototype.applyClient=function(t,e){var o=this.buffer.compose(e);return new r(this.outstanding,o)},r.prototype.applyServer=function(t,e){var o=e.constructor.transform,n=o(this.outstanding,e),i=o(this.buffer,n[1]);return t.applyOperation(i[1]),new r(n[0],i[0])},r.prototype.serverAck=function(t){return t.sendOperation(t.revision,this.buffer),new o(this.buffer)},r.prototype.transformCursor=function(t){return t.transform(this.outstanding).transform(this.buffer)},r.prototype.resend=function(t){t.sendOperation(t.revision,this.outstanding)},t}(this),"object"==typeof module&&(module.exports=ot.Client),ot.CodeMirrorAdapter=function(){"use strict";function t(t){this.cm=t,this.ignoreNextChange=!1,i(this,"onChange"),i(this,"onCursorActivity"),i(this,"onFocus"),i(this,"onBlur"),t.on("change",this.onChange),t.on("cursorActivity",this.onCursorActivity),t.on("focus",this.onFocus),t.on("blur",this.onBlur)}function e(t,e){return t.line<e.line?-1:t.line>e.line?1:t.ch<e.ch?-1:t.ch>e.ch?1:0}function o(t,o){return 0===e(t,o)}function r(t,o){return 0>=e(t,o)}function n(t){return t.indexFromPos({line:t.lastLine(),ch:0})+t.getLine(t.lastLine()).length}function i(t,e){var o=t[e];t[e]=function(){o.apply(t,arguments)}}var s=ot.TextOperation,a=ot.Cursor;t.prototype.detach=function(){this.cm.off("change",this.onChange),this.cm.off("cursorActivity",this.onCursorActivity),this.cm.off("focus",this.onFocus),this.cm.off("blur",this.onBlur)},t.operationFromCodeMirrorChange=function(t,e){function o(t){return t[t.length-1]}function i(t){if(0===t.length)return 0;for(var e=0,o=0;t.length>o;o++)e+=t[o].length;return e+t.length-1}function a(t,e){return function(n){return r(n,e.from)?t(n):r(e.to,n)?t({line:n.line+(e.text.length>0?e.text.length-1:0)-(e.to.line-e.from.line),ch:e.to.line<n.line?n.ch:1>=e.text.length?n.ch-(e.to.ch-e.from.ch)+i(e.text):n.ch-e.to.ch+(e.text.length>0?o(e.text).length:0)})+i(e.removed)-i(e.text):e.from.line===n.line?t(e.from)+n.ch-e.from.ch:t(e.from)+i(e.removed.slice(0,n.line-e.from.line))+1+n.ch}}for(var p=[],h=0;t;)p[h++]=t,t=t.next;var u=n(e),c=(new s).retain(u),l=(new s).retain(u),f=function(t){return e.indexFromPos(t)};for(h=p.length-1;h>=0;h--){t=p[h],f=a(f,t);var d=f(t.from),g=u-d-i(t.text);c=(new s).retain(d)["delete"](i(t.removed)).insert(t.text.join("\n")).retain(g).compose(c),l=l.compose((new s).retain(d)["delete"](i(t.text)).insert(t.removed.join("\n")).retain(g)),u+=i(t.removed)-i(t.text)}return[c,l]},t.applyOperationToCodeMirror=function(t,e){e.operation(function(){for(var o=t.ops,r=0,n=0,i=o.length;i>n;n++){var a=o[n];if(s.isRetain(a))r+=a;else if(s.isInsert(a))e.replaceRange(a,e.posFromIndex(r)),r+=a.length;else if(s.isDelete(a)){var p=e.posFromIndex(r),h=e.posFromIndex(r-a);e.replaceRange("",p,h)}}})},t.prototype.registerCallbacks=function(t){this.callbacks=t},t.prototype.onChange=function(e,o){if(!this.ignoreNextChange){var r=t.operationFromCodeMirrorChange(o,this.cm);this.trigger("change",r[0],r[1])}this.ignoreNextChange=!1},t.prototype.onCursorActivity=t.prototype.onFocus=function(){this.trigger("cursorActivity")},t.prototype.onBlur=function(){this.cm.somethingSelected()||this.trigger("blur")},t.prototype.getValue=function(){return this.cm.getValue()},t.prototype.getCursor=function(){var t,e=this.cm,r=e.getCursor(),n=e.indexFromPos(r);if(e.somethingSelected()){var i=e.getCursor(!0),s=o(r,i)?e.getCursor(!1):i;t=e.indexFromPos(s)}else t=n;return new a(n,t)},t.prototype.setCursor=function(t){this.cm.setSelection(this.cm.posFromIndex(t.position),this.cm.posFromIndex(t.selectionEnd))};var p=function(){var t={},e=document.createElement("style");document.documentElement.getElementsByTagName("head")[0].appendChild(e);var o=e.sheet;return function(e){t[e]||(t[e]=!0,o.insertRule(e,(o.cssRules||o.rules).length))}}();return t.prototype.setOtherCursor=function(t,e,o){var r=this.cm.posFromIndex(t.position);if(t.position===t.selectionEnd){var n=this.cm.cursorCoords(r),i=document.createElement("pre");return i.className="other-client",i.style.borderLeftWidth="2px",i.style.borderLeftStyle="solid",i.innerHTML="&nbsp;",i.style.borderLeftColor=e,i.style.height=.9*(n.bottom-n.top)+"px",i.style.marginTop=n.top-n.bottom+"px",i.setAttribute("data-clientid",o),this.cm.addWidget(r,i,!1),{clear:function(){var t=i.parentNode;t&&t.removeChild(i)}}}var s=/^#([0-9a-fA-F]{6})$/.exec(e);if(!s)throw Error("only six-digit hex colors are allowed.");var a="selection-"+s[1],h="."+a+" { background: "+e+"; }";p(h);var u,c;return t.selectionEnd>t.position?(u=r,c=this.cm.posFromIndex(t.selectionEnd)):(u=this.cm.posFromIndex(t.selectionEnd),c=r),this.cm.markText(u,c,{className:a})},t.prototype.trigger=function(t){var e=Array.prototype.slice.call(arguments,1),o=this.callbacks&&this.callbacks[t];o&&o.apply(this,e)},t.prototype.applyOperation=function(e){this.ignoreNextChange=!0,t.applyOperationToCodeMirror(e,this.cm)},t.prototype.registerUndo=function(t){this.cm.undo=t},t.prototype.registerRedo=function(t){this.cm.redo=t},t}(),ot.SocketIOAdapter=function(){"use strict";function t(t){this.socket=t;var e=this;t.on("client_left",function(t){e.trigger("client_left",t)}).on("set_name",function(t,o){e.trigger("set_name",t,o)}).on("ack",function(){e.trigger("ack")}).on("operation",function(t,o,r){e.trigger("operation",o),e.trigger("cursor",t,r)}).on("cursor",function(t,o){e.trigger("cursor",t,o)}).on("reconnect",function(){e.trigger("reconnect")})}return t.prototype.sendOperation=function(t,e,o){this.socket.emit("operation",t,e,o)},t.prototype.sendCursor=function(t){this.socket.emit("cursor",t)},t.prototype.registerCallbacks=function(t){this.callbacks=t},t.prototype.trigger=function(t){var e=Array.prototype.slice.call(arguments,1),o=this.callbacks&&this.callbacks[t];o&&o.apply(this,e)},t}(),ot.AjaxAdapter=function(){"use strict";function t(t,e,o){"/"!==t[t.length-1]&&(t+="/"),this.path=t,this.ownUserName=e,this.majorRevision=o.major||0,this.minorRevision=o.minor||0,this.poll()}return t.prototype.renderRevisionPath=function(){return"revision/"+this.majorRevision+"-"+this.minorRevision},t.prototype.handleResponse=function(t){var e,o=t.operations;for(e=0;o.length>e;e++)o[e].user===this.ownUserName?this.trigger("ack"):this.trigger("operation",o[e].operation);o.length>0&&(this.majorRevision+=o.length,this.minorRevision=0);var r=t.events;if(r){for(e=0;r.length>e;e++){var n=r[e].user;if(n!==this.ownUserName)switch(r[e].event){case"joined":this.trigger("set_name",n,n);break;case"left":this.trigger("client_left",n);break;case"cursor":this.trigger("cursor",n,r[e].cursor)}}this.minorRevision+=r.length}var i=t.users;i&&(delete i[this.ownUserName],this.trigger("clients",i)),t.revision&&(this.majorRevision=t.revision.major,this.minorRevision=t.revision.minor)},t.prototype.poll=function(){var t=this;$.ajax({url:this.path+this.renderRevisionPath(),type:"GET",dataType:"json",timeout:5e3,success:function(e){t.handleResponse(e),t.poll()},error:function(){setTimeout(function(){t.poll()},500)}})},t.prototype.sendOperation=function(t,e,o){if(t!==this.majorRevision)throw Error("Revision numbers out of sync");var r=this;$.ajax({url:this.path+this.renderRevisionPath(),type:"POST",data:JSON.stringify({operation:e,cursor:o}),contentType:"application/json",processData:!1,success:function(){},error:function(){setTimeout(function(){r.sendOperation(t,e,o)},500)}})},t.prototype.sendCursor=function(t){$.ajax({url:this.path+this.renderRevisionPath()+"/cursor",type:"POST",data:JSON.stringify(t),contentType:"application/json",processData:!1,timeout:1e3})},t.prototype.registerCallbacks=function(t){this.callbacks=t},t.prototype.trigger=function(t){var e=Array.prototype.slice.call(arguments,1),o=this.callbacks&&this.callbacks[t];o&&o.apply(this,e)},t}(),ot.EditorClient=function(){"use strict";function t(t,e){this.cursorBefore=t,this.cursorAfter=e}function e(t,e){this.clientId=t,this.cursor=e}function o(t,e,o,r,n){this.id=t,this.listEl=e,this.editorAdapter=o,this.name=r,this.li=document.createElement("li"),r&&(this.li.textContent=r,this.listEl.appendChild(this.li)),this.setColor(r?s(r):Math.random()),n&&this.updateCursor(n)}function r(t,e,o,r){h.call(this,t),this.serverAdapter=o,this.editorAdapter=r,this.undoManager=new c,this.lastOperation=null,this.initializeClientList(),this.initializeClients(e);var n=this;this.editorAdapter.registerCallbacks({change:function(t,e){n.onChange(t,e)},cursorActivity:function(){n.onCursorActivity()},blur:function(){n.onBlur()}}),this.editorAdapter.registerUndo(function(){n.undo()}),this.editorAdapter.registerRedo(function(){n.redo()}),this.serverAdapter.registerCallbacks({client_left:function(t){n.onClientLeft(t)},set_name:function(t,e){n.getClientObject(t).setName(e)},ack:function(){n.serverAck()},operation:function(t){n.applyServer(l.fromJSON(t))},cursor:function(t,e){e?n.getClientObject(t).updateCursor(n.transformCursor(u.fromJSON(e))):n.getClientObject(t).removeCursor()},clients:function(t){var e;for(e in n.clients)n.clients.hasOwnProperty(e)&&!t.hasOwnProperty(e)&&n.onClientLeft(e);for(e in t)if(t.hasOwnProperty(e)&&n.clients.hasOwnProperty(e)){var o=t[e];o?n.clients[e].updateCursor(n.transformCursor(u.fromJSON(o))):n.clients[e].removeCursor()}},reconnect:function(){n.serverReconnect()}})}function n(t,e,o){function r(t){var e=Math.round(255*t).toString(16);return 1===e.length?"0"+e:e}return"#"+r(t)+r(e)+r(o)}function i(t,e,o){if(0===e)return n(o,o,o);var r=.5>o?o*(1+e):o+e-e*o,i=2*o-r,s=function(t){return 0>t&&(t+=1),t>1&&(t-=1),1>6*t?i+6*(r-i)*t:1>2*t?r:2>3*t?i+6*(r-i)*(2/3-t):i};return n(s(t+1/3),s(t),s(t-1/3))}function s(t){for(var e=1,o=0;t.length>o;o++)e=17*(e+t.charCodeAt(o))%360;return e/360}function a(t,e){function o(){}o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t}function p(t){t.parentNode&&t.parentNode.removeChild(t)}var h=ot.Client,u=ot.Cursor,c=ot.UndoManager,l=ot.TextOperation,f=ot.WrappedOperation;return t.prototype.invert=function(){return new t(this.cursorAfter,this.cursorBefore)},t.prototype.compose=function(e){return new t(this.cursorBefore,e.cursorAfter)},t.prototype.transform=function(e){return new t(this.cursorBefore.transform(e),this.cursorAfter.transform(e))},e.fromJSON=function(t){return new e(t.clientId,t.cursor&&u.fromJSON(t.cursor))},e.prototype.transform=function(t){return new e(this.clientId,this.cursor&&this.cursor.transform(t))},o.prototype.setColor=function(t){this.hue=t,this.color=i(t,.75,.5),this.lightColor=i(t,.5,.9),this.li&&(this.li.style.color=this.color)},o.prototype.setName=function(t){this.name=t,this.li.textContent=t,this.li.parentNode||this.listEl.appendChild(this.li),this.setColor(s(t))},o.prototype.updateCursor=function(t){this.removeCursor(),this.cursor=t,this.mark=this.editorAdapter.setOtherCursor(t,t.position===t.selectionEnd?this.color:this.lightColor,this.id)},o.prototype.remove=function(){this.li&&p(this.li),this.removeCursor()},o.prototype.removeCursor=function(){this.mark&&this.mark.clear()},a(r,h),r.prototype.addClient=function(t,e){this.clients[t]=new o(t,this.clientListEl,this.editorAdapter,e.name||t,e.cursor?u.fromJSON(e.cursor):null)},r.prototype.initializeClients=function(t){this.clients={};for(var e in t)t.hasOwnProperty(e)&&this.addClient(e,t[e])},r.prototype.getClientObject=function(t){var e=this.clients[t];return e?e:this.clients[t]=new o(t,this.clientListEl,this.editorAdapter)},r.prototype.onClientLeft=function(t){console.log("User disconnected: "+t);var e=this.clients[t];e&&(e.remove(),delete this.clients[t])},r.prototype.initializeClientList=function(){this.clientListEl=document.createElement("ul")},r.prototype.applyUnredo=function(t){this.undoManager.add(t.invert(this.editorAdapter.getValue())),this.editorAdapter.applyOperation(t.wrapped),this.cursor=t.meta.cursorAfter,this.editorAdapter.setCursor(this.cursor),this.applyClient(t.wrapped)},r.prototype.undo=function(){var t=this;this.undoManager.canUndo()&&this.undoManager.performUndo(function(e){t.applyUnredo(e)})},r.prototype.redo=function(){var t=this;this.undoManager.canRedo()&&this.undoManager.performRedo(function(e){t.applyUnredo(e)})},r.prototype.onChange=function(e,o){var r=this.cursor;this.updateCursor();var n=new t(r,this.cursor);new f(e,n);var i;!this.undoManager.dontCompose&&this.lastOperation&&this.lastOperation.shouldBeComposedWith(e)?(i=!0,this.lastOperation=this.lastOperation.compose(e)):(i=!1,this.lastOperation=e);var s=new t(this.cursor,r);this.undoManager.add(new f(o,s),i),this.applyClient(e)},r.prototype.updateCursor=function(){this.cursor=this.editorAdapter.getCursor()},r.prototype.onCursorActivity=function(){var t=this.cursor;this.updateCursor(),t&&this.cursor.equals(t)||this.sendCursor(this.cursor)},r.prototype.onBlur=function(){this.cursor=null,this.sendCursor(null)},r.prototype.sendCursor=function(t){this.state instanceof h.AwaitingWithBuffer||this.serverAdapter.sendCursor(t)},r.prototype.sendOperation=function(t,e){this.serverAdapter.sendOperation(t,e.toJSON(),this.cursor)},r.prototype.applyOperation=function(t){this.editorAdapter.applyOperation(t),this.updateCursor(),this.undoManager.transform(new f(t,null))},r}();