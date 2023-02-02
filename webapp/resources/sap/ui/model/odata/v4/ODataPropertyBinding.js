/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataBinding","./lib/_Cache","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/odata/v4/Context","sap/ui/model/PropertyBinding"],function(e,t,n,i,o,r,s,a,h){"use strict";var u="sap.ui.model.odata.v4.ODataPropertyBinding",d=Object.freeze([]),p={AggregatedDataStateChange:true,change:true,dataReceived:true,dataRequested:true,DataStateChange:true},l="/"+a.VIRTUAL,c=h.extend("sap.ui.model.odata.v4.ODataPropertyBinding",{constructor:f});function f(t,i,o,r){h.call(this,t,i);e.call(this);if(i.endsWith("/")){throw new Error("Invalid path: "+i)}if(r){this.checkBindingParameters(r,["$$groupId","$$ignoreMessages","$$noPatch"]);this.sGroupId=r.$$groupId;this.bNoPatch=r.$$noPatch;this.setIgnoreMessages(r.$$ignoreMessages)}else{this.sGroupId=undefined;this.bNoPatch=false}this.oCheckUpdateCallToken=undefined;this.oContext=o;this.bHasDeclaredType=undefined;this.bInitial=true;this.mQueryOptions=this.oModel.buildQueryOptions(n.clone(r),i.endsWith("$count"));this.vValue=undefined;this.fetchCache(o);t.bindingCreated(this)}e(c.prototype);c.prototype.attachEvent=function(e,t,n,i){if(!(e in p)){throw new Error("Unsupported event '"+e+"': v4.ODataPropertyBinding#attachEvent")}return h.prototype.attachEvent.apply(this,arguments)};c.prototype.checkUpdateInternal=function(e,t,a,h,d){var p=false,c=this.sPath.indexOf("##"),f=c>=0,g=this.oModel.getMetaModel(),y={data:{}},C=this.getResolvedPath(),v={forceUpdate:C&&(e||e===undefined&&this.getDataState().getControlMessages().length>0||this.oCheckUpdateCallToken&&this.oCheckUpdateCallToken.forceUpdate)},R=this.oType,P=this;this.oCheckUpdateCallToken=v;if(this.bHasDeclaredType===undefined){this.bHasDeclaredType=!!R}if(C&&!this.bHasDeclaredType&&this.sInternalType!=="any"&&!f){R=g.fetchUI5Type(C)}if(d===undefined){d=this.oCachePromise.then(function(e){var t,n;if(e){return e.fetchValue(P.lockGroup(a||P.getGroupId()),undefined,function(){p=true;P.fireDataRequested(h)},P).then(function(t){P.assertSameCache(e);return t})}if(!P.sReducedPath||!P.isResolved()){return undefined}if(C.includes(l)){v.forceUpdate=false}if(!f){return P.oContext.fetchValue(P.sReducedPath,P)}t=P.sPath.slice(0,c);n=P.sPath.slice(c+2);if(n[0]==="/"){n="."+n}return g.fetchObject(n,g.getMetaContext(P.oModel.resolve(t,P.oContext)))}).then(function(e){if(!e||typeof e!=="object"){return e}if(P.sInternalType==="any"&&(P.getBindingMode()===r.OneTime||P.sPath[P.sPath.lastIndexOf("/")+1]==="#"&&!f)){if(f){return e}else if(P.bRelative){return n.publicClone(e)}}i.error("Accessed value is not primitive",C,u)},function(e){P.oModel.reportError("Failed to read path "+C,u,e);if(e.canceled){v.forceUpdate=false;return P.vValue}y={error:e}});if(e&&d.isFulfilled()){if(R&&R.isFulfilled&&R.isFulfilled()){this.setType(R.getResult(),this.sInternalType)}this.vValue=d.getResult()}d=Promise.resolve(d)}return o.all([d,R]).then(function(e){var n=e[1],i=e[0];if(v===P.oCheckUpdateCallToken){P.oCheckUpdateCallToken=undefined;P.setType(n,P.sInternalType);if(v.forceUpdate||P.vValue!==i){P.bInitial=false;P.vValue=i;P._fireChange({reason:t||s.Change})}P.checkDataState()}if(p){P.fireDataReceived(y,h)}if(y.error){throw y.error}})};c.prototype.deregisterChangeListener=function(){var e=this;this.withCache(function(t,n,i){i.doDeregisterChangeListener(n,e)},"",false,true).catch(this.oModel.getReporter())};c.prototype.destroy=function(){this.deregisterChangeListener();this.oModel.bindingDestroyed(this);this.oCheckUpdateCallToken=undefined;this.mQueryOptions=undefined;this.vValue=undefined;e.prototype.destroy.call(this);h.prototype.destroy.apply(this,arguments)};c.prototype.doCreateCache=function(e,n){return t.createProperty(this.oModel.oRequestor,e,n)};c.prototype.doFetchQueryOptions=function(){return this.isRoot()?o.resolve(this.mQueryOptions):o.resolve({})};c.prototype.getDependentBindings=function(){return d};c.prototype.getResumePromise=function(){};c.prototype.getValue=function(){return this.vValue};c.prototype.getValueListType=function(){var e=this.getResolvedPath();if(!e){throw new Error(this+" is unresolved")}return this.getModel().getMetaModel().getValueListType(e)};c.prototype.hasPendingChangesInDependents=function(){return false};c.prototype.initialize=function(){if(this.isResolved()){if(this.getRootBinding().isSuspended()){this.sResumeChangeReason=s.Change}else{this.checkUpdate(true)}}};c.prototype.isMeta=function(){return this.sPath.includes("##")};c.prototype.onChange=function(e,t){this.checkUpdateInternal(t,undefined,undefined,false,e).catch(this.oModel.getReporter())};c.prototype.onDelete=function(){};c.prototype.refreshInternal=function(e,t,n,i){var r=this;if(this.isRootBindingSuspended()){this.refreshSuspended(t);return o.resolve()}return this.oCachePromise.then(function(){if(r.oCache&&r.oCache.reset){r.oCache.reset()}else{r.fetchCache(r.oContext,false,true,i)}if(n){return r.checkUpdateInternal(undefined,s.Refresh,t,i)}})};c.prototype.requestValue=function(){var e=this;return Promise.resolve(this.checkUpdateInternal(false).then(function(){return e.getValue()}))};c.prototype.requestValueListInfo=function(e){var t=this.getResolvedPath();if(!t){throw new Error(this+" is unresolved")}return this.getModel().getMetaModel().requestValueListInfo(t,e,this.oContext)};c.prototype.requestValueListType=function(){var e=this.getResolvedPath();if(!e){throw new Error(this+" is unresolved")}return this.getModel().getMetaModel().requestValueListType(e)};c.prototype.resetChangesInDependents=function(){};c.prototype.resetInvalidDataState=function(){if(this.getDataState().isControlDirty()){this._fireChange({reason:s.Change})}};c.prototype.resume=function(){throw new Error("Unsupported operation: resume")};c.prototype.resumeInternal=function(e,t){var n=this.sResumeChangeReason;this.sResumeChangeReason=undefined;this.fetchCache(this.oContext);if(e){this.checkUpdateInternal(t?undefined:false,n).catch(this.oModel.getReporter())}};c.prototype.setContext=function(e){if(this.oContext!==e){if(this.bRelative){this.checkSuspended(true);this.deregisterChangeListener()}this.oContext=e;this.sResumeChangeReason=undefined;if(this.bRelative){this.fetchCache(this.oContext);this.checkUpdateInternal(this.bInitial||undefined,s.Context).catch(this.oModel.getReporter())}}};c.prototype.setType=function(e,t){var n=this.oType;if(e&&e.getName()==="sap.ui.model.odata.type.DateTimeOffset"){e.setV4()}h.prototype.setType.apply(this,arguments);if(!this.bInitial&&n!==e){this._fireChange({reason:s.Change})}};c.prototype.setValue=function(e,t){var i,o=this.getResolvedPath(),r=this;function s(e){r.oModel.reportError("Failed to update path "+o,u,e);return e}this.checkSuspended();if(this.bNoPatch&&t){throw s(new Error("Must not specify a group ID ("+t+") with $$noPatch"))}n.checkGroupId(t);if(typeof e==="function"||e&&typeof e==="object"){throw s(new Error("Not a primitive value"))}if(!this.bNoPatch&&this.vValue===undefined){throw s(new Error("Must not change a property before it has been read"))}if(this.vValue!==e){if(this.oCache){s(new Error("Cannot set value on this binding as it is not relative"+" to a sap.ui.model.odata.v4.Context"));return}i=this.bNoPatch?null:this.lockGroup(t,true,true);this.oContext.doSetProperty(this.sPath,e,i).catch(function(e){if(i){i.unlock(true)}s(e)})}};c.prototype.supportsIgnoreMessages=function(){return true};c.prototype.suspend=function(){throw new Error("Unsupported operation: suspend")};c.prototype.visitSideEffects=function(){};return c});
//# sourceMappingURL=ODataPropertyBinding.js.map