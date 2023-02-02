/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/EventProvider","./Plugin","sap/base/util/UriParameters","sap/ui/thirdparty/jquery","sap/base/Log","sap/base/security/encodeURL"],function(t,i,e,jQuery,n,o){"use strict";var r=t.extend("sap.ui.core.support.Support",{constructor:function(i){if(!p){throw Error()}t.apply(this);var n=this;this._sType=i;this._sLocalOrigin=window.location.protocol+"//"+window.location.host;var o=this._receiveEvent.bind(this);if(window.addEventListener){window.addEventListener("message",o,false)}else{window.attachEvent("onmessage",o)}switch(i){case s.APPLICATION:this._isOpen=false;this.attachEvent(a.TEAR_DOWN,function(t){n._isOpen=false;d(n._oRemoteWindow);n._oRemoteWindow=null;r.exitPlugins(n,false)});this.attachEvent(a.LIBS,function(t){var i=r.getDiagnosticLibraries(),e=[];for(var o=0;o<i.length;o++){e.push(i[o].name)}n.sendEvent(a.LIBS,e)});this.attachEvent(a.SETUP,function(t){n._isOpen=true;r.initPlugins(n,false)});break;case s.TOOL:this._oRemoteWindow=window.opener;this._sRemoteOrigin=e.fromQuery(window.location.search).get("sap-ui-xx-support-origin");jQuery(window).on("unload",function(t){n.sendEvent(a.TEAR_DOWN);r.exitPlugins(n,true)});this.attachEvent(a.LIBS,function(t){var i=t.mParameters;if(!Array.isArray(i)){i=Object.keys(i).map(function(t){return i[t]})}sap.ui.getCore().loadLibraries(i,true).then(function(){jQuery(function(){r.initPlugins(n,true).then(function(){n.sendEvent(a.SETUP)})})})});this.sendEvent(a.LIBS);break}}});var s={APPLICATION:"APPLICATION",TOOL:"TOOL"};var a={LIBS:"sapUiSupportLibs",SETUP:"sapUiSupportSetup",TEAR_DOWN:"sapUiSupportTeardown"};r.StubType=s;r.EventType=a;var u=[];r.getStub=function(t){if(f){return f}if(t!=s.APPLICATION&&t!=s.TOOL){t=s.APPLICATION}p=true;f=new r(t);p=false;return f};r.getToolPlugins=function(){var t=[];for(var e=0;e<u.length;e++){if(u[e]instanceof i&&u[e].isToolPlugin()){t.push(u[e])}}return t};r.getAppPlugins=function(){var t=[];for(var e=0;e<u.length;e++){if(u[e]instanceof i&&u[e].isAppPlugin()){t.push(u[e])}}return t};r.prototype.getType=function(){return this._sType};r.prototype.isToolStub=function(){return this._sType===r.StubType.TOOL};r.prototype.isAppStub=function(){return this._sType===r.StubType.APPLICATION};r.prototype._receiveEvent=function(t){var i=t.data;if(typeof i==="string"&&i.indexOf("SAPUI5SupportTool*")===0){i=i.substr(18)}else{return}if(t.source!=this._oRemoteWindow){return}this._oRemoteOrigin=t.origin;var e=JSON.parse(i);var n=e.eventId;var o=e.params;this.fireEvent(n,o)};r.prototype.sendEvent=function(t,i){if(!this._oRemoteWindow){return}i=i?i:{};var e={eventId:t,params:i};var n="SAPUI5SupportTool*"+JSON.stringify(e);this._oRemoteWindow.postMessage(n,this._sRemoteOrigin)};r.prototype.openSupportTool=function(){var t=sap.ui.require.toUrl("sap/ui/core/support/support.html");var i="?sap-ui-xx-noless=true&sap-ui-xx-support-origin="+o(this._sLocalOrigin);var e;if(this._sType===s.APPLICATION){var n=window.document.getElementById("sap-ui-bootstrap");if(n){var r=sap.ui.require.toUrl("");var a=n.getAttribute("src");if(typeof a==="string"&&a.indexOf(r)===0){e=a.substr(r.length)}}}if(e&&e!=="sap-ui-core.js"&&e.indexOf("/")===-1){i+="&sap-ui-xx-support-bootstrap="+o(e)}function u(t){return t.indexOf(".")==0||t.indexOf("/")==0||t.indexOf("://")<0}if(this._sType===s.APPLICATION){if(!this._isOpen){this._oRemoteWindow=l(t+i);this._sRemoteOrigin=u(t)?this._sLocalOrigin:t}else{this._oRemoteWindow.focus()}}};r.prototype.toString=function(){return"sap.ui.core.support.Support"};var p=false;var f;function l(t){return window.open(t,"sapUiSupportTool","width=800,height=700,status=no,toolbar=no,menubar=no,resizable=yes,location=no,directories=no,scrollbars=yes")}function d(t){if(!t){return}try{t.close()}catch(t){}}r.getDiagnosticLibraries=function(){var t=sap.ui.getCore().getLoadedLibraries(),i=[];for(var e in t){var n=t[e];if(n.extensions&&n.extensions["sap.ui.support"]&&n.extensions["sap.ui.support"].diagnosticPlugins){i.push(n)}}return i};r.initPlugins=function(t,e){return new Promise(function(e,n){u=[];var o=r.getDiagnosticLibraries();for(var s=0;s<o.length;s++){var a=o[s],p=a.extensions["sap.ui.support"].diagnosticPlugins;if(Array.isArray(p)){for(var f=0;f<p.length;f++){if(u.indexOf(p[f])===-1){u.push(p[f])}}}}var l=[],d=[],s;for(s=0;s<u.length;s++){if(typeof u[s]==="string"){l.push(u[s]);d.push(s)}}sap.ui.require(l,function(){var n,o,r;for(o=0;o<arguments.length;o++){r=arguments[o];n=d[o];if(t.isToolStub()&&r.prototype.isToolPlugin()){u[n]=new r(t);c(u[n])}else if(t.isAppStub()&&r.prototype.isAppPlugin()){u[n]=new r(t)}}for(n=0;n<u.length;n++){if(u[n]instanceof i){if(t.isToolStub()&&u[n].isToolPlugin()){u[n].init(t)}else if(t.isAppStub()&&u[n].isAppPlugin()){u[n].init(t)}}}e()})})};r.exitPlugins=function(t,e){for(var n=0;n<u.length;n++){if(u[n]instanceof i){if(u[n].isToolPlugin()&&t.isToolStub()&&e){u[n].exit(t,true)}else if(u[n].isAppPlugin()&&t.isAppStub()&&!e){u[n].exit(t,false)}}}};function c(t){t.$().replaceWith("<div  id='"+t.getId()+"-Panel' class='sapUiSupportPnl'>"+"<div id='"+t.getId()+"-PanelHeader' class='sapUiSupportPnlHdr'>"+"<div id='"+t.getId()+"-PanelHandle' class='sapUiSupportPnlHdrHdl sapUiSupportPnlHdrHdlClosed'>"+"</div>"+"<div class='sapUiSupportPanelTitle'>"+t.getTitle()+"</div>"+"</div>"+"<div id='"+t.getId()+"-PanelContent' class='sapUiSupportPnlCntnt sapUiSupportHidden'>"+"<div id='"+t.getId()+"' class='sapUiSupportPlugin'></div>"+"</div>"+"</div>");t.$("PanelHeader").on("click",function(){var i=t.$("PanelHandle");if(i.hasClass("sapUiSupportPnlHdrHdlClosed")){i.removeClass("sapUiSupportPnlHdrHdlClosed");t.$("PanelContent").removeClass("sapUiSupportHidden")}else{i.addClass("sapUiSupportPnlHdrHdlClosed");t.$("PanelContent").addClass("sapUiSupportHidden")}})}r.initializeSupportMode=function(t,i){if(t.indexOf("true")>-1||t.indexOf("viewinfo")>-1){r._initializeSupportInfo(i)}};r._initializeSupportInfo=function(t){var i=[],e=[],o=[],s="support:data",a="support",u="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1",p={};var f=function(){var t="sap-ui-support.probe",i;try{localStorage.setItem(t,t);i=localStorage.getItem(t);localStorage.removeItem(t);return i===t}catch(t){return false}}();function l(){if(f){localStorage.setItem("sap-ui-support.aSupportInfosBreakpoints/"+document.location.href,JSON.stringify(e))}}function d(){if(f){localStorage.setItem("sap-ui-support.aSupportXMLModifications/"+document.location.href,JSON.stringify(o))}}if(f){var c=localStorage.getItem("sap-ui-support.aSupportInfosBreakpoints/"+document.location.href);if(c){e=JSON.parse(c)}var c=localStorage.getItem("sap-ui-support.aSupportXMLModifications/"+document.location.href);if(c){o=JSON.parse(c)}}r.info=function(t){t._idx=i.length;if(t._idx>0&&!t.context){t.context=i[i.length-1].context}if(!t.context){n.debug("Support Info does not have a context and is ignored");return t}if(t.context&&t.context.ownerDocument&&t.context.nodeType===1){var o=t._idx+"";if(!t.context.hasAttributeNS(u,"data")){t.context.setAttribute("xmlns:"+a,u)}else{o=t.context.getAttributeNS(u,"data")+","+o}t.context.setAttributeNS(u,s,o)}i.push(t);if(e.indexOf(t._idx)>-1){n.info(t);n.info("To remove this breakpoint execute:","\nsap.ui.core.support.Support.info.removeBreakpointAt("+t._idx+")");debugger}return t._idx};r.info.getAll=function(t){if(t===undefined){return i}else{return i.filter(function(i){return i.env&&i.env.caller===t})}};r.info.getInfos=function(t){if(t&&typeof t==="string"){t=t.split(",")}else{t=[]}var e=[];for(var n=0;n<t.length;n++){if(i[t[n]]){e.push(i[t[n]])}}return e};r.info.byIndex=function(t){return i[t]};r.info.getAllBreakpoints=function(){return e};r.info.hasBreakpointAt=function(t){return e.indexOf(t)>-1};r.info.addBreakpointAt=function(t){if(e.indexOf(t)>-1){return}e.push(t);l()};r.info.removeBreakpointAt=function(t){var i=e.indexOf(t);if(i>-1){e.splice(i,1);l()}};r.info.removeAllBreakpoints=function(){e=[];l()};r.info.addSupportInfo=function(t,i){if(t&&i){if(p[t]){p[t]+=","+i}else{p[t]=i}}};r.info.byId=function(t){return p[t]||null};r.info.getIds=function(t){var i=[];for(var e in p){var n=p[e];if(n&&n.indexOf(t)>-1){i.push(e)}}return i};r.info.getElements=function(t){var i=[];for(var e in p){var n=p[e];if(n&&n.indexOf(t)===0){var o=sap.ui.getCore().byId(e);if(o){i.push(sap.ui.getCore().byId(e))}}}return i};r.info.getAllXMLModifications=function(){return o};r.info.hasXMLModifications=function(){return o.length>0};r.info.addXMLModification=function(t,i,e){o.push({id:t,idx:i,change:e});d()};r.info.removeXMLModification=function(t){var i=o.indexOf(t);if(i>-1){o.splice(i,1);d()}};r.info.removeAllXMLModification=function(){o=[];d()};r.info.modifyXML=function(t,i){if(!r.info.hasXMLModifications()){return}var e=i;if(!e||!e.nodeType||!(e.nodeType==1||e.nodeType==9)){return}if(e.nodeType===9){e=e.firstChild}var n=e.querySelectorAll("*");var s=[e];for(var a=0;a<n.length;a++){s.push(n[a])}for(var a=0;a<o.length;a++){var u=o[a],p=u.change;if(u.id===t){var f=s[u.idx];if(f.nodeType===1&&p.setAttribute){var l=f.getAttribute(p.setAttribute[0]);f.setAttribute(p.setAttribute[0],p.setAttribute[1]);if(!f._modified){f._modified=[]}f._modified.push(p.setAttribute[0]);if(!f._oldValues){f._oldValues=[]}f._oldValues.push(l)}}}};r.info._breakAtProperty=function(t){return function(i){if(i.getParameter("name")===t){debugger}}};r.info._breakAtMethod=function(t){return function(){debugger;return t.apply(this,arguments)}};var g=["sap/ui/base/ManagedObject","sap/ui/core/mvc/View","sap/ui/core/XMLTemplateProcessor","sap/ui/thirdparty/datajs"];function v(t,i,e,o){t._supportInfo=r.info;i._supportInfo=r.info;e._supportInfo=r.info;if(window.datajs){window.datajs._sap={_supportInfo:r.info}}n.info("sap.ui.core.support.Support.info initialized.")}if(t){sap.ui.require(g,v)}else{v.apply(null,g.map(sap.ui.requireSync))}};return r});
//# sourceMappingURL=Support.js.map