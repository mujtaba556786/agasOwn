/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/comp/library","sap/ui/core/Element","./Factory","sap/ui/model/json/JSONModel","sap/ui/comp/odata/MetadataAnalyser","sap/ui/model/BindingMode","sap/base/Log","sap/base/util/merge","./Util"],function(jQuery,t,e,i,n,a,o,r,s,c){"use strict";var p=e.extend("sap.ui.comp.navpopover.SemanticObjectController",{metadata:{library:"sap.ui.comp",properties:{ignoredFields:{type:"string",group:"Misc",defaultValue:null},prefetchNavigationTargets:{type:"boolean",group:"Misc",defaultValue:false},fieldSemanticObjectMap:{type:"object",group:"Misc",defaultValue:null},entitySet:{type:"string",group:"Misc",defaultValue:null},contactAnnotationPaths:{type:"object",defaultValue:null},enableAvailableActionsPersonalization:{type:"object",defaultValue:null},mapFieldToSemanticObject:{type:"boolean"},forceLinkRendering:{type:"object",defaultValue:null},beforeNavigationCallback:{type:"function"},replaceSmartLinkNavigationTargetsObtained:{type:"boolean",defaultValue:false}},events:{navigationTargetsObtained:{parameters:{mainNavigation:{type:"sap.ui.comp.navpopover.LinkData"},actions:{type:"sap.ui.comp.navpopover.LinkData[]"},ownNavigation:{type:"sap.ui.comp.navpopover.LinkData"},popoverForms:{type:"sap.ui.layout.form.SimpleForm[]"},semanticObject:{type:"string"},semanticAttributes:{type:"object"},originalId:{type:"string"},show:{type:"function"}}},beforePopoverOpens:{parameters:{semanticObject:{type:"string"},semanticAttributes:{type:"object"},semanticAttributesOfSemanticObjects:{type:"object"},setSemanticAttributes:{type:"function"},setAppStateKey:{type:"function"},originalId:{type:"string"},open:{type:"function"}}},navigate:{parameters:{text:{type:"string"},href:{type:"string"},semanticObject:{type:"string"},semanticAttributes:{type:"object"},originalId:{type:"string"}}},prefetchDone:{parameters:{semanticObjects:{type:"object"}}}}}});p.oSemanticObjects={};p.oNavigationTargetActions={};p.bHasPrefetchedDistinctSemanticObjects=false;p.bHasPrefetchedNavigationTargetActions=false;p.oPromise=null;p.oPromiseActions=null;p.prototype.init=function(){p.prefetchDistinctSemanticObjects();this._proxyOnBeforePopoverOpens=this._onBeforePopoverOpens.bind(this);this._proxyOnTargetsObtained=this._onTargetsObtained.bind(this);this._proxyOnNavigate=this._onNavigate.bind(this);this._aRegisteredControls=[]};p.prototype.isControlRegistered=function(t){return this._aRegisteredControls.indexOf(t)>-1};p.prototype.registerControl=function(t){if(!t||!(t.isA("sap.ui.comp.navpopover.SmartLink")||t.isA("sap.ui.comp.navpopover.NavigationPopoverHandler"))){r.warning("sap.ui.comp.navpopover.SemanticObjectController: "+(t&&t.getMetadata?t.getMetadata():"parameter")+" is neither of SmartLink nor of NavigationPopoverHandler instance");return}if(this.isControlRegistered(t)){return}if(t.attachBeforePopoverOpens){t.attachBeforePopoverOpens(this._proxyOnBeforePopoverOpens)}if(t.attachNavigationTargetsObtained){t.attachNavigationTargetsObtained(this._proxyOnTargetsObtained)}if(t.attachInnerNavigate){t.attachInnerNavigate(this._proxyOnNavigate)}this._aRegisteredControls.push(t)};p.prototype.unregisterControl=function(t){if(!t){return}if(!this.isControlRegistered(t)){return}if(t.detachBeforePopoverOpens){t.detachBeforePopoverOpens(this._proxyOnBeforePopoverOpens)}if(t.detachNavigationTargetsObtained){t.detachNavigationTargetsObtained(this._proxyOnTargetsObtained)}if(t.detachInnerNavigate){t.detachInnerNavigate(this._proxyOnNavigate)}this._aRegisteredControls.splice(this._aRegisteredControls.indexOf(t),1)};p.prototype.setEnableAvailableActionsPersonalization=function(t){this.setProperty("enableAvailableActionsPersonalization",t,true);return this};p.prototype._onBeforePopoverOpens=function(t){var e=t.getParameters();if(this.hasListeners("beforePopoverOpens")){this.fireBeforePopoverOpens({semanticObject:e.semanticObject,semanticAttributes:e.semanticAttributes,semanticAttributesOfSemanticObjects:e.semanticAttributesOfSemanticObjects,setSemanticAttributes:e.setSemanticAttributes,setAppStateKey:e.setAppStateKey,originalId:e.originalId,open:e.open})}else{e.open()}};p.prototype._onTargetsObtained=function(t){var e=t.getParameters();if(!this.hasListeners("navigationTargetsObtained")){e.show();return}this.fireNavigationTargetsObtained({mainNavigation:e.mainNavigation,actions:e.actions,ownNavigation:e.ownNavigation,popoverForms:e.popoverForms,semanticObject:e.semanticObject,semanticAttributes:e.semanticAttributes,originalId:e.originalId,show:e.show})};p.prototype._onNavigate=function(t){if(t){var e=t.getParameters();var i={text:e.text,href:e.href,originalId:e.originalId,semanticObject:e.semanticObject,semanticAttributes:e.semanticAttributes};if(this.getBeforeNavigationCallback()&&!t.getSource().getBeforeNavigationCallback()){this.getBeforeNavigationCallback()(s({},i)).then(function(t){if(t===true){this.fireNavigate(e);c.navigate(e.internalHref)}}.bind(this))}else{this.fireNavigate(e);c.navigate(e.internalHref)}}};p.prototype.setIgnoredState=function(t){if(t&&t.isA("sap.ui.comp.navpopover.SmartLink")){t._updateEnabled()}};p.prototype.setIgnoredFields=function(t){this.setProperty("ignoredFields",t);this._aRegisteredControls.forEach(function(t){if(t._updateEnabled){t._updateEnabled()}});return this};p.prototype.setPrefetchNavigationTargets=function(t){this.setProperty("prefetchNavigationTargets",t);if(t!==true){return this}r.error("sap.ui.comp.navpopover.SemanticObjectController: Please be aware that in case of a large amount of semantic objects the performance may suffer significantly and the received links will be created out of context");var e=this;p.getDistinctSemanticObjects().then(function(t){p.getNavigationTargetActions(t).then(function(t){e.firePrefetchDone({semanticObjects:t})})});return this};p.prototype.getFieldSemanticObjectMap=function(){var t=this.getProperty("fieldSemanticObjectMap");if(t){return t}if(!this.getEntitySet()){r.warning("sap.ui.comp.navpopover.SemanticObjectController: FieldSemanticObjectMap is not set on SemanticObjectController, retrieval without EntitySet not possible");return null}var e=new a(this.getModel());t=e.getFieldSemanticObjectMap(this.getEntitySet());if(t){this.setProperty("fieldSemanticObjectMap",t,true)}return t};p.prototype.getEntitySet=function(){var t=this.getProperty("entitySet");if(t){return t}var e=this.getParent();while(e){if(e.getEntitySet){t=e.getEntitySet();if(t){this.setProperty("entitySet",t,true);break}}e=e.getParent()}return t};p.prototype.hasSemanticObjectLinks=function(t){return p.hasDistinctSemanticObject([t],p.oSemanticObjects)};p.prefetchDistinctSemanticObjects=function(){p.getJSONModel();if(!p.bHasPrefetchedDistinctSemanticObjects){p.getDistinctSemanticObjects()}};p.getDistinctSemanticObjects=function(){if(p.bHasPrefetchedDistinctSemanticObjects){return Promise.resolve(p.oSemanticObjects)}if(!p.oPromise){p.oPromise=new Promise(function(t){var e=i.getService("CrossApplicationNavigation");if(!e){r.error("sap.ui.comp.navpopover.SemanticObjectController: Service 'CrossApplicationNavigation' could not be obtained");p.bHasPrefetchedDistinctSemanticObjects=true;t({});return}e.getDistinctSemanticObjects().then(function(e){e.forEach(function(t){p.oSemanticObjects[t]={}});var i=p.getJSONModel();i.setProperty("/distinctSemanticObjects",p.oSemanticObjects);p.bHasPrefetchedDistinctSemanticObjects=true;return t(p.oSemanticObjects)},function(){r.error("sap.ui.comp.navpopover.SemanticObjectController: getDistinctSemanticObjects() of service 'CrossApplicationNavigation' failed");p.bHasPrefetchedDistinctSemanticObjects=true;return t({})})})}return p.oPromise};p.getNavigationTargetActions=function(t){if(p.bHasPrefetchedNavigationTargetActions){return Promise.resolve(p.oNavigationTargetActions)}if(!p.oPromiseLinks){p.oPromiseLinks=new Promise(function(e){var n=i.getService("CrossApplicationNavigation");var a=i.getService("URLParsing");if(!n||!a){r.error("sap.ui.comp.navpopover.SemanticObjectController: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");p.bHasPrefetchedNavigationTargetActions=true;e({});return}var o=Object.keys(t);var s=o.map(function(t){return[{semanticObject:t}]});n.getLinks(s).then(function(t){o.forEach(function(e,i){p.oNavigationTargetActions[e]=[];t[i][0].forEach(function(t){var i=a.parseShellHash(t.intent);if(i&&i.semanticObject===e){p.oNavigationTargetActions[e].push(i.action)}})});var i=p.getJSONModel();i.setProperty("/navigationTargetActions",p.oNavigationTargetActions);p.bHasPrefetchedNavigationTargetActions=true;return e(p.oNavigationTargetActions)},function(){r.error("sap.ui.comp.navpopover.SemanticObjectController: getLinks() of service 'CrossApplicationNavigation' failed");p.bHasPrefetchedNavigationTargetActions=true;return e({})})})}return p.oPromiseLinks};p.hasDistinctSemanticObject=function(t,e){return t.some(function(t){return!!e[t]})};p.getJSONModel=function(){var t=sap.ui.getCore().getModel("$sapuicompSemanticObjectController_DistinctSemanticObjects");if(t&&!jQuery.isEmptyObject(t.getData())){return t}t=new n({distinctSemanticObjects:{}});t.setDefaultBindingMode(o.OneTime);t.setSizeLimit(1e3);sap.ui.getCore().setModel(t,"$sapuicompSemanticObjectController_DistinctSemanticObjects");return t};p.destroyDistinctSemanticObjects=function(){p.oSemanticObjects={};p.oNavigationTargetActions={};p.oPromise=null;p.oPromiseActions=null;p.bHasPrefetchedDistinctSemanticObjects=false;p.bHasPrefetchedNavigationTargetActions=false;var t=sap.ui.getCore().getModel("$sapuicompSemanticObjectController_DistinctSemanticObjects");if(t){t.destroy()}};return p});
//# sourceMappingURL=SemanticObjectController.js.map