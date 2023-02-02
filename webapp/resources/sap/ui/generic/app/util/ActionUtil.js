/*
 * ! SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/m/MessageBox","sap/ui/comp/smartform/SmartForm","sap/ui/comp/smartform/Group","sap/ui/comp/smartform/GroupElement","sap/ui/comp/smartfield/SmartField","sap/ui/comp/smartfield/SmartLabel","sap/m/Dialog","sap/ui/generic/app/util/ModelUtil","sap/m/VBox","sap/m/Text","sap/base/strings/formatMessage","sap/base/Log"],function(jQuery,e,t,r,a,o,n,i,s,l,u,p,c,m){"use strict";var f=e.extend("sap.ui.generic.app.util.ActionUtil",{metadata:{properties:{controller:{type:"object",group:"Misc",defaultValue:null},applicationController:{type:"object",group:"Misc",defaultValue:null},contexts:{type:"object",group:"Misc",defaultValue:null},successCallback:{type:"function",group:"Misc",defaultValue:null},operationGrouping:{type:"string",group:"Misc",defaultValue:null}}}});f.prototype._getObjectsDifference=function(e,t){var r=[];var a=Object.keys(e);for(var o=0;o<a.length;o++){if(e[a[o]]!==t[a[o]]){r.push(a[o])}}return r};f.prototype.call=function(e,r,a,o,n,i,s){var l=this;return new Promise(function(u,p){var m;l._oActionPromiseCallback={resolve:u,reject:p};l._sFunctionImportPath=e;var f=l.getController();if(!f||!f.getView()){p("No View Controller provided")}l._oMetaModel=f.getView().getModel().getMetaModel();var d=e.split("/")[1];l._oFunctionImport=l._oMetaModel.getODataFunctionImport(d);l._sFunctionImportLabel=r;l._sFunctionImportButtonActionButtonText=s||r;l._oSkipProperties=o||{};var g=function(){var e=l.getContexts();m=l._prepareParameters(e,a,i);m=m||[{}];m.expand=i?i.expand:undefined;var t=l.getApplicationController().getTransactionController().getDefaultValues(e,m.map(function(e){return e.parameterData}),undefined,d);if(t instanceof Promise){var r=function(e){for(var t=0;t<m.length;t++){m[t].propertiesOverridenByDefault=l._getObjectsDifference(m[t].parameterData,e[t]);m[t].parameterData=e[t]}l._initiateCall(m,a,n)};t.then(r,r)}else{l._initiateCall(m,a,n)}};if(!l._oFunctionImport){p("Unknown Function Import "+d)}if(l._isActionCritical()){var v="ACTION_CONFIRM|"+d;var h;var y=f.getOwnerComponent().getAppComponent&&f.getOwnerComponent().getAppComponent().getModel("i18n")&&f.getOwnerComponent().getAppComponent().getModel("i18n").getResourceBundle();if(y&&y.hasText(v)){h=y.getText(v)}else{h=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ACTION_CONFIRM");h=c(h,l._sFunctionImportLabel)}t.confirm(h,{title:l._sFunctionImportLabel,onClose:function(e){if(e==="OK"){g()}else if(e==="CANCEL"){l._oActionPromiseCallback.reject()}},sClass:l._getCompactModeStyleClass()})}else{g()}})};f.prototype._getCompactModeStyleClass=function(){if(this.getController().getView().$().closest(".sapUiSizeCompact").length){return"sapUiSizeCompact"}return""};f.prototype._isActionCritical=function(){var e=this._oFunctionImport["com.sap.vocabularies.Common.v1.IsActionCritical"];if(!e){return false}if(e.Bool===undefined){return true}return this._toBoolean(e.Bool)};f.prototype._toBoolean=function(e){if(typeof e==="string"){var t=e.toLowerCase();return!(t=="false"||t==""||t==" ")}return!!e};f.prototype._prepareParameters=function(e,t,r){if(!Array.isArray(e)&&!e.length){return undefined}var a=[];e.forEach(function(e){var o=null;var n=e.getObject();if(e&&e.getPath()){var i=l.getEntitySetFromContext(e);var s=e.getModel().getMetaModel().getODataEntitySet(i,false);o=e.getModel().getMetaModel().getODataEntityType(s.entityType,false)}var u=this._getPropertyKeys(o);var p;var c={parameterData:{},additionalParameters:[],isDraftEnabled:t};if(this._oFunctionImport.parameter){for(var f=0;f<this._oFunctionImport.parameter.length;f++){var d=this._oFunctionImport.parameter[f];this._addParameterLabel(d,o);var g=d.name;var v=!!u[g];p=undefined;if(g==="ResultIsActiveEntity"){if(d.nullable!=="false"){continue}p=false}if(n&&n.hasOwnProperty(g)){p=n[g]}else if(v&&n&&this._oFunctionImport["sap:action-for"]){m.error("Key parameter of action not found in current context: "+g);throw new Error("Key parameter of action not found in current context: "+g)}c.parameterData[g]=r&&r[g]||p;var h=!!this._oSkipProperties[g];if(!h&&(!v||!this._oFunctionImport["sap:action-for"])&&d.mode.toUpperCase()=="IN"){c.additionalParameters.push(d)}}a.push(c)}else{a.push(c)}}.bind(this));return a};f.prototype._getPropertyKeys=function(e){var t={};if(e&&e.key&&e.key.propertyRef){for(var r=0;r<e.key.propertyRef.length;r++){var a=e.key.propertyRef[r].name;t[a]=true}}return t};f.prototype._setAdditionalParameters=function(e,t,r,a,o){e.forEach(function(e){if(t===e.name){if(e.hasOwnProperty("com.sap.vocabularies.UI.v1.Hidden")||o&&o.includes(t)){a.oModel.setProperty(t,r[t],a)}else{a.oModel.setProperty(t,undefined,a)}}})};f.prototype._initiateCall=function(e,t,r){var a=e[0];var o=r?"strict":"lenient";var i={Prefer:"handling="+o};if(a!=undefined&&a.additionalParameters&&a.additionalParameters.length==0){this._call(a.parameterData,a.isDraftEnabled,i)}else if(a!=undefined&&a.additionalParameters&&a.additionalParameters.length>0){var l=this;var u={urlParameters:{},headers:i,expand:e.expand};var p=this.getContexts();var c=this.getApplicationController()._getChangeSetFunc(p,this.getOperationGrouping());var m=p.map(function(e,t){u.changeSetId=c(t);return this.getApplicationController().getNewActionContext(this._sFunctionImportPath,e,u)}.bind(this));var f=m.map(function(e){return e.context});Promise.all(f).then(function(t){var o=t[0];var i=a.additionalParameters.map(function(e){return e.name});t.forEach(function(r,a){var o=e[a].parameterData;for(var n in o){if(t.length>1&&i.indexOf(n)>-1){l._setAdditionalParameters(e[a].additionalParameters,n,o,r,e[a].propertiesOverridenByDefault)}else{r.oModel.setProperty(n,o[n],r)}}});if(r){var u=l._buildParametersForm(a,o);var c=false;var f=new s({title:l._sFunctionImportLabel,content:[u.form],beginButton:new sap.m.Button({text:l._sFunctionImportButtonActionButtonText,type:"Emphasized",press:function(e){var o=u.form?u.form.check():Promise.resolve();o.then(function(e){if(u.hasNoClientErrors()){f.close();c=l._triggerActionPromise(m,p,a,t,r)}})}}),endButton:new sap.m.Button({text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ACTION_CANCEL"),press:function(){m[0].abort();f.close();l._oActionPromiseCallback.reject();c=true}}),afterClose:function(e){f.destroy();if(!c){l._oActionPromiseCallback.reject()}}}).addStyleClass("sapUiNoContentPadding");f.addStyleClass(l._getCompactModeStyleClass());f.setModel(o.oModel);if(this.getController().getView().getModel("@i18n")){f.setModel(this.getController().getView().getModel("@i18n"),"@i18n")}var d=f.getAggregation("content")[0].mAggregations["content"];var g=d.getFormContainers()[0].getFormElements();var v=true;for(var h=0;h<g.length;h++){var y=g[h].getFields()[0];if(y instanceof n&&y.getVisible()===true){v=false;break}}if(g.length===0||v){l._triggerActionPromise(m,p,a,t,r);f.destroy()}else{f.open()}}else{l._triggerActionPromise(m,p,a,t)}}.bind(this))}else{this._call(null,a!=undefined?a.isDraftEnabled:t,i)}};f.prototype._triggerActionPromise=function(e,t,r,a,o){var n=this;var i={};n._oActionPromiseCallback.resolve({executionPromise:n.getApplicationController()._newPromiseAll(e.map(function(e){return e.result})).then(function(e){n._bExecutedSuccessfully=n.getApplicationController()._checkAtLeastOneSuccess(t,e);if(o){e.forEach(function(e){e.userEnteredAdditionalParams=i})}if(n._bExecutedSuccessfully){return e}else{return Promise.reject(e)}},function(e){n._bExecutedSuccessfully=false;e.forEach(function(e){e.userEnteredAdditionalParams=i});throw e})});var s=a[0].getObject();r.additionalParameters.forEach(function(e){var t=s[e.name];if(e.type=="Edm.Boolean"&&t==undefined){s[e.name]=false;t=false}i[e.name]=t;a.forEach(function(r){r.oModel.setProperty(e.name,t,r)})});var l=n._sFunctionImportPath.split("/")[1];t.forEach(function(e,t){n.getApplicationController().submitActionContext(e,a[t],l)});if(o){return true}};f.prototype._call=function(e,t,r){var a=this.getContexts();var o={urlParameters:e,operationGrouping:this.getOperationGrouping(),triggerChanges:t,headers:r};var n=this.getController();var i=this.getApplicationController()||n.getApplicationController();var s=this;s._oActionPromiseCallback.resolve({executionPromise:i.invokeActions(this._sFunctionImportPath,a,o).then(function(e){s._bExecutedSuccessfully=true;return e},function(e){s._bExecutedSuccessfully=false;throw e})})};f.prototype._getActionParameterData=function(e){var t=[];var r=e.getObject("/");var a={};for(var o=0;o<this._oFunctionImport.parameter.length;o++){var n=this._oFunctionImport.parameter[o];var i=n.name;if(r.hasOwnProperty(i)){var s=r[i];if(s===undefined){if(!this._toBoolean(n.nullable)){if(n.type==="Edm.Boolean"){a[i]=false}else{t.push(n)}}}else{a[i]=s}}else{throw new Error("Unknown parameter: "+i)}}return{preparedParameterData:a,missingMandatoryParameters:t}};f.prototype._buildParametersForm=function(e,t){var s=new r({editable:true,validationMode:"Async"});s.setBindingContext(t);var l;var u=[];var p;var c;var m=new a;for(var f=0;f<e.additionalParameters.length;f++){var d=e.additionalParameters[f];if(d["com.sap.vocabularies.UI.v1.Hidden"]&&!d["com.sap.vocabularies.UI.v1.Hidden"].Path&&!(d["com.sap.vocabularies.UI.v1.Hidden"].Bool==="false")){continue}c=d["com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]?"fixed-values":undefined;if(c==undefined){c=d["sap:value-list"]=="fixed-values"?"fixed-values":undefined}l=new n("ActionUtil-"+this._sFunctionImportPath.replace("/","-")+"-"+d.name,{value:"{"+d.name+"}",textLabel:this._getParameterName(d),width:"100%"});l.data("configdata",{configdata:{isInnerControl:false,path:d.name,entitySetObject:{},annotations:{valuelist:d["com.sap.vocabularies.Common.v1.ValueList"],valuelistType:c},modelObject:t.oModel,entityType:d.type,property:{property:d,typePath:d.name}}});if(d.nullable=="false"){l.setMandatory(true)}u.push(l);p=new i;p.setLabelFor(l);var g=new o;g.addElement(l);m.addGroupElement(g)}s.addGroup(m);var v=function(){var e=true;for(var t=0;t<u.length;t++){if(u[t].getValueState()!="None"){e=false;break}}return e};return{form:s,hasNoClientErrors:v}};f.prototype._getParameterName=function(e){return e["com.sap.vocabularies.Common.v1.Label"]?e["com.sap.vocabularies.Common.v1.Label"].String:e.name};f.prototype._addParameterLabel=function(e,t){if(t&&e&&!e["com.sap.vocabularies.Common.v1.Label"]){var r=this._oMetaModel.getODataProperty(t,e.name,false);if(r&&r["com.sap.vocabularies.Common.v1.Label"]){e["com.sap.vocabularies.Common.v1.Label"]=r["com.sap.vocabularies.Common.v1.Label"]}}};f.prototype.getFunctionImportLabel=function(){return this._sFunctionImportLabel};f.prototype.getExecutedSuccessfully=function(){return this._bExecutedSuccessfully};return f});
//# sourceMappingURL=ActionUtil.js.map