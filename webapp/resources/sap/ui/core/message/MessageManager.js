/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ControlMessageProcessor","./Message","sap/base/Log","sap/base/util/deepEqual","sap/base/util/merge","sap/ui/base/EventProvider","sap/ui/base/ManagedObject","sap/ui/core/Configuration","sap/ui/core/message/MessageProcessor","sap/ui/model/message/MessageModel"],function(e,s,t,r,a,o,i,g,n,h){"use strict";var c=o.extend("sap.ui.core.message.MessageManager",{constructor:function(){o.apply(this,arguments);this.mProcessors={};this.mObjects={};this.mMessages={};var e=g.getHandleValidation();if(e){sap.ui.getCore().attachValidationSuccess(e,this._handleSuccess,this);sap.ui.getCore().attachValidationError(e,this._handleError,this);sap.ui.getCore().attachParseError(e,this._handleError,this);sap.ui.getCore().attachFormatError(e,this._handleError,this)}},metadata:{publicMethods:["addMessages","removeMessages","removeAllMessages","registerMessageProcessor","unregisterMessageProcessor","registerObject","unregisterObject","getMessageModel","destroy"]}});c.prototype._handleError=function(t,r){if(!this.oControlMessageProcessor){this.oControlMessageProcessor=new e}if(r){var a=t.getParameter("element");var o=t.getParameter("property");var i=a.getId()+"/"+o;var g=this.oControlMessageProcessor.getId();var n=t.sId==="formatError";if(this.mMessages[g]&&this.mMessages[g][i]){this._removeMessages(this.mMessages[g][i],true)}var h={};h[a.getId()]={properties:{},fieldGroupIds:a.getFieldGroupIds?a.getFieldGroupIds():undefined};h[a.getId()].properties[o]=true;var c=new s({type:sap.ui.core.MessageType.Error,message:t.getParameter("message"),target:i,processor:this.oControlMessageProcessor,technical:n,references:h,validation:true});this.addMessages(c)}t.cancelBubble()};c.prototype._handleSuccess=function(s,t){if(!this.oControlMessageProcessor){this.oControlMessageProcessor=new e}if(t){var r=s.getParameter("element");var a=s.getParameter("property");var o=r.getId()+"/"+a;var i=this.oControlMessageProcessor.getId();if(this.mMessages[i]&&this.mMessages[i][o]){this._removeMessages(this.mMessages[i][o],true)}}s.cancelBubble()};c.prototype.addMessages=function(e){var s=e,t=this.getAffectedProcessors(e);if(!e){return}else if(Array.isArray(e)){for(var r=0;r<e.length;r++){s=e[r];this._importMessage(s)}}else{this._importMessage(e)}this._updateMessageModel(t)};c.prototype._importMessage=function(e){var s=e.getMessageProcessor(),t=s&&s.getId(),r=e.getTargets(),a=this;if(!this.mMessages[t]){this.mMessages[t]={}}if(!r.length){r=[undefined]}r.forEach(function(s){var r=a.mMessages[t][s]?a.mMessages[t][s]:[];r.push(e);a.mMessages[t][s]=r})};c.prototype._pushMessages=function(e){var s,t;for(t in e){s=e[t];var r=this.mMessages[t]?this.mMessages[t]:{};this._sortMessages(r);r=Object.keys(r).length===0?null:a({},r);s.setMessages(r)}};c.prototype._sortMessages=function(e){var t,r;if(Array.isArray(e)){e={ignored:e}}for(t in e){r=e[t];if(r.length>1){r.sort(s.compare)}}};c.prototype._updateMessageModel=function(e){var s=new Map,t,r=this.getMessageModel(),a;function o(e){s.set(e,true)}for(t in this.mMessages){for(a in this.mMessages[t]){this.mMessages[t][a].forEach(o)}}this._pushMessages(e);r.setData(Array.from(s.keys()))};c.prototype.removeAllMessages=function(){var e={};for(var s in this.mMessages){var t=Object.keys(this.mMessages[s])[0];var r=this.mMessages[s][t];Object.assign(e,this.getAffectedProcessors(r))}this.aMessages=[];this.mMessages={};this._updateMessageModel(e)};c.prototype.removeMessages=function(e){return this._removeMessages.apply(this,arguments)};c.prototype._removeMessages=function(e,t){var r=this.getAffectedProcessors(e);if(!e||Array.isArray(e)&&e.length==0){return}else if(Array.isArray(e)){var a=e.slice(0);for(var o=0;o<a.length;o++){if(!t||a[o].validation){this._removeMessage(a[o])}}}else if(e instanceof s&&(!t||e.validation)){this._removeMessage(e)}else{for(var i in e){this._removeMessages(e[i],t)}}this._updateMessageModel(r)};c.prototype._removeMessage=function(e){var s=e.getMessageProcessor(),t=s&&s.getId(),a=this.mMessages[t],o;if(!a){return}o=e.getTargets();if(!o.length){o=[undefined]}o.forEach(function(s){var t=a[s];if(t){for(var o=0;o<t.length;o++){var i=t[o];if(r(i,e)){t.splice(o,1);--o}}if(a[s].length===0){delete a[s]}}})};c.prototype.onMessageChange=function(e){var s=e.getParameter("oldMessages");var t=e.getParameter("newMessages");this.removeMessages(s);this.addMessages(t)};c.prototype.registerMessageProcessor=function(e){var s=e.getId(),t={};if(!this.mProcessors[s]){this.mProcessors[s]=s;e.attachMessageChange(this.onMessageChange,this);if(s in this.mMessages){t[s]=e;this._pushMessages(t)}}};c.prototype.unregisterMessageProcessor=function(e){this.removeMessagesByProcessor(e.getId());delete this.mProcessors[e.getId()];e.detachMessageChange(this.onMessageChange,this)};c.prototype.registerObject=function(e,s){if(!(e instanceof i)){t.error(this+" : "+e.toString()+" is not an instance of sap.ui.base.ManagedObject")}else{e.attachValidationSuccess(s,this._handleSuccess,this);e.attachValidationError(s,this._handleError,this);e.attachParseError(s,this._handleError,this);e.attachFormatError(s,this._handleError,this)}};c.prototype.unregisterObject=function(e){if(!(e instanceof i)){t.error(this+" : "+e.toString()+" is not an instance of sap.ui.base.ManagedObject")}else{e.detachValidationSuccess(this._handleSuccess,this);e.detachValidationError(this._handleError,this);e.detachParseError(this._handleError,this);e.detachFormatError(this._handleError,this)}};c.prototype.destroy=function(){t.warning("Deprecated: Do not call destroy on a MessageManager")};c.prototype.getMessageModel=function(){if(!this.oMessageModel){this.oMessageModel=new h(this);this.oMessageModel.setData([])}return this.oMessageModel};c.prototype.getAffectedProcessors=function(e){var s,t,r={};if(e){if(!Array.isArray(e)){e=[e]}e.forEach(function(e){s=e.getMessageProcessor();if(s instanceof n){t=s.getId();r[t]=s}})}return r};c.prototype.removeMessagesByProcessor=function(e){delete this.mMessages[e];this._updateMessageModel({})};return c});
//# sourceMappingURL=MessageManager.js.map