/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/isEmptyObject","sap/base/util/isPlainObject","sap/ui/fl/apply/_internal/flexObjects/FlexObject","sap/ui/fl/apply/_internal/flexObjects/States","sap/ui/fl/Utils"],function(e,t,s,r,o){"use strict";var n=s.extend("sap.ui.fl.apply._internal.flexObjects.UIChange",{metadata:{properties:{selector:{type:"object",defaultValue:{}},dependentSelectors:{type:"object",defaultValue:{}},applyState:{type:"string",defaultValue:r.ApplyState.NEW},jsOnly:{type:"boolean"},variantReference:{type:"string"},revertData:{type:"any",defaultValue:null}},aggregations:{},associations:{},events:{}},constructor:function(){s.apply(this,arguments);this._oChangeProcessingPromises={};this.setInitialApplyState()}});n.getMappingInfo=function(){return Object.assign(s.getMappingInfo(),{selector:"selector",dependentSelectors:"dependentSelector",jsOnly:"jsOnly",variantReference:"variantReference"})};n.prototype.getMappingInfo=function(){return n.getMappingInfo()};n.prototype.setQueuedForRevert=function(){if(this._aQueuedProcesses[this._aQueuedProcesses.length-1]!==r.Operations.REVERT){this._aQueuedProcesses.unshift(r.Operations.REVERT)}};n.prototype.isQueuedForRevert=function(){return this._aQueuedProcesses.indexOf(r.Operations.REVERT)>-1};n.prototype.setQueuedForApply=function(){if(this._aQueuedProcesses[this._aQueuedProcesses.length-1]!==r.Operations.APPLY){this._aQueuedProcesses.unshift(r.Operations.APPLY)}};n.prototype.isQueuedForApply=function(){return this._aQueuedProcesses.indexOf(r.Operations.APPLY)>-1};n.prototype.setInitialApplyState=function(){this._aQueuedProcesses=[];delete this._ignoreOnce;this.setApplyState(r.ApplyState.INITIAL);this._oChangeProcessedPromise={};this._oChangeProcessedPromise.promise=new Promise(function(e){this._oChangeProcessedPromise.resolveFunction={resolve:e}}.bind(this))};n.prototype.isInInitialState=function(){return this._aQueuedProcesses.length===0&&this.getApplyState()===r.ApplyState.INITIAL};n.prototype.isValidForDependencyMap=function(){return!!this.getSelector().id};n.prototype.startApplying=function(){this.setApplyState(r.ApplyState.APPLYING)};n.prototype.markFinished=function(e,t){this._aQueuedProcesses.pop();this._resolveChangeProcessingPromiseWithError(r.Operations.APPLY,e);var s=t!==false?r.ApplyState.APPLY_SUCCESSFUL:r.ApplyState.APPLY_FAILED;this.setApplyState(s)};n.prototype.markSuccessful=function(e){this.markFinished(e,true)};n.prototype.markFailed=function(e){this.markFinished(e,false)};n.prototype.startReverting=function(){this.setApplyState(r.ApplyState.REVERTING)};n.prototype.markRevertFinished=function(e){this._aQueuedProcesses.pop();this._resolveChangeProcessingPromiseWithError(r.Operations.REVERT,e);this.setApplyState(r.ApplyState.REVERT_FINISHED)};n.prototype.hasApplyProcessStarted=function(){return this.getApplyState()===r.ApplyState.APPLYING};n.prototype.isSuccessfullyApplied=function(){return this.getApplyState()===r.ApplyState.APPLY_SUCCESSFUL};n.prototype.hasApplyProcessFailed=function(){return this.getApplyState()===r.ApplyState.APPLY_FAILED};n.prototype.isApplyProcessFinished=function(){return this.isSuccessfullyApplied()||this.hasApplyProcessFailed()};n.prototype.hasRevertProcessStarted=function(){return this.getApplyState()===r.ApplyState.REVERTING};n.prototype.isRevertProcessFinished=function(){return this.getApplyState()===r.ApplyState.REVERT_FINISHED};n.prototype.isCurrentProcessFinished=function(){return this._aQueuedProcesses.length===0&&this.getApplyState()!==r.ApplyState.INITIAL};n.prototype.addChangeProcessingPromise=function(e){if(!this._oChangeProcessingPromises[e]){this._oChangeProcessingPromises[e]={};this._oChangeProcessingPromises[e].promise=new Promise(function(t){this._oChangeProcessingPromises[e].resolveFunction={resolve:t}}.bind(this))}return this._oChangeProcessingPromises[e].promise};n.prototype.addChangeProcessingPromises=function(){var e=[];if(this.getApplyState()===r.ApplyState.INITIAL&&this._oChangeProcessedPromise){e.push(this._oChangeProcessedPromise.promise)}this._aQueuedProcesses.forEach(function(t){e.push(this.addChangeProcessingPromise(t))},this);return e};n.prototype.addPromiseForApplyProcessing=function(){return this.addChangeProcessingPromise(r.Operations.APPLY)};n.prototype._resolveChangeProcessingPromiseWithError=function(e,t){if(this._oChangeProcessingPromises[e]){this._oChangeProcessingPromises[e].resolveFunction.resolve(t);delete this._oChangeProcessingPromises[e]}if(this._oChangeProcessedPromise){this._oChangeProcessedPromise.resolveFunction.resolve(t);this._oChangeProcessedPromise=null}};n.prototype.hasRevertData=function(){return this.getRevertData()!==null};n.prototype.resetRevertData=function(){this.setRevertData(null)};n.prototype.setDependentSelectors=function(e){this.setProperty("dependentSelectors",e);delete this._aDependentSelectorList};n.prototype.addDependentControl=function(t,s,r,o){if(!t){throw new Error("Parameter vControl is mandatory")}if(!s){throw new Error("Parameter sAlias is mandatory")}if(!r||e(r)){throw new Error("Parameter mPropertyBag is mandatory")}var n=Object.assign({},this.getDependentSelectors());if(n[s]){throw new Error("Alias '"+s+"' already exists in the change.")}var i=r.modifier;var p=r.appComponent;if(Array.isArray(t)){var a=[];t.forEach(function(e){a.push(i.getSelector(e,p,o))});n[s]=a}else{n[s]=i.getSelector(t,p,o)}this.setDependentSelectors(n);delete this._aDependentSelectorList};n.prototype.getDependentControl=function(e,t){var s=[];if(!e){throw new Error("Parameter sAlias is mandatory")}if(!t){throw new Error("Parameter mPropertyBag is mandatory")}var r=t.modifier;var o=t.appComponent;var n=this.getDependentSelectors()[e];if(Array.isArray(n)){n.forEach(function(e){s.push(r.bySelector(e,o,t.view))});return s}return r.bySelector(n,o,t.view)};n.prototype.getDependentSelectorList=function(){var e=[this.getSelector()];if(!this._aDependentSelectorList){if(!this.getOriginalSelector()){Object.entries(this.getDependentSelectors()).some(function(t){var s=t[1];if(!Array.isArray(s)){s=[s]}s.forEach(function(t){if(t&&o.indexOfObject(e,t)===-1){e.push(t)}})})}this._aDependentSelectorList=e}return this._aDependentSelectorList};n.prototype.getDependentControlSelectorList=function(){var e=this.getDependentSelectorList().concat();if(e.length>0){var t=this.getSelector();var s=o.indexOfObject(e,t);if(s>-1){e.splice(s,1)}}return e};n.prototype.getOriginalSelector=function(){return this.getDependentSelectors().originalSelector};n.prototype.setExtensionPointInfo=function(e){this._oExtensionPointInfo=e};n.prototype.getExtensionPointInfo=function(){if(t(this._oExtensionPointInfo)){return Object.assign({},this._oExtensionPointInfo)}return this._oExtensionPointInfo};return n});
//# sourceMappingURL=UIChange.js.map