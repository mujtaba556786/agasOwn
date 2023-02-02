/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/comp/library","sap/ui/base/EventProvider","sap/ui/comp/odata/ODataType","sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/util/FormatUtil","sap/ui/comp/util/DateTimeUtil","sap/base/Log","sap/m/Token","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/table/Util"],function(jQuery,t,e,i,a,s,o,n,r,l,h,d){"use strict";var u=t.smartfilterbar.DisplayBehaviour;var p=t.ANALYTICAL_PARAMETER_PREFIX;var f=e.extend("sap.ui.comp.providers.BaseValueListProvider",{constructor:function(t){e.call(this);this.sFieldName=t.fieldName;this.oControl=t.control;this.oODataModel=t.model;this.oFilterModel=t.filterModel;this.oFilterProvider=t.filterProvider;this.sDisplayFormat=t.displayFormat;this._oDateFormatSettings=t.dateFormatSettings;this._aValidationPromises=[];this.sContext=t.context;this.fnAsyncWritePromise=t.fnAsyncWritePromise;this._selectedODataRowHandler=t.selectedODataRowHandler;if(!this._oDateFormatSettings){this._oDateFormatSettings={}}if(!this._oDateFormatSettings.hasOwnProperty("UTC")){this._oDateFormatSettings["UTC"]=true}this._fieldViewMetadata=t.fieldViewMetadata;this.sValueListEntitySetName=null;this.bResolveInOutParams=t.resolveInOutParams===false?false:true;this.sDisplayBehaviour=t.displayBehaviour;this.sDDLBDisplayBehaviour=this.sDisplayBehaviour;if(!this.sDDLBDisplayBehaviour||this.sDDLBDisplayBehaviour===u.auto){this.sDDLBDisplayBehaviour=this.oFilterProvider?this.oFilterProvider.sDefaultDropDownDisplayBehaviour:u.descriptionOnly}this._sType=t.type;this._sMaxLength=t.maxLength;this.sPropertyTypePath="";if(this.bResolveInOutParams&&!this.oFilterModel&&!this.oFilterProvider){this._resolvePropertyPath()}if(t.loadAnnotation&&t.fullyQualifiedFieldName){this._oMetadataAnalyser=t.metadataAnalyser;this._sFullyQualifiedFieldName=t.fullyQualifiedFieldName;this._attachAnnotationLoadOnRender()}else{if(t.loadAnnotation){n.error("BaseValueListProvider","loadAnnotation is true, but no fullyQualifiedFieldName set for field '"+(this._sFullyQualifiedFieldName||this.sFieldName)+"'! Please check your annotations")}this._onAnnotationLoad({primaryValueListAnnotation:t.annotation,additionalAnnotations:t.additionalAnnotations})}}});f.prototype._attachAnnotationLoadOnRender=function(){this.oBeforeRenderingEventDelegate={onBeforeRendering:function(){this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate,this);delete this.oBeforeRenderingEventDelegate;if(!this._bValueListRequested){if(this.bInitialised){if(this._onMetadataInitialised&&this.sAggregationName&&!this.bTypeAheadEnabled&&this.oControl.$()){this._onMetadataInitialised()}}else{this._loadAnnotation()}}}};this.oControl.addEventDelegate(this.oBeforeRenderingEventDelegate,this)};f.prototype.loadAnnotation=function(){if(this.oBeforeRenderingEventDelegate){this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate,this);delete this.oBeforeRenderingEventDelegate}if(this.oAfterRenderingEventDelegate){this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate,this);delete this.oAfterRenderingEventDelegate}return this._loadAnnotation()};f.prototype._loadAnnotation=function(){if(!this._bValueListRequested){this._bValueListRequested=true;if(!this._oMetadataAnalyser){this._oMetadataAnalyser=new a(this.oODataModel);this._bCleanupMetadataAnalyser=true}return this.getValueListAnnotation().then(this._onAnnotationLoad.bind(this),function(t){this._oError=t;this.bInitialised=true;n.debug(t)}.bind(this))}return Promise.resolve()};f.prototype.getValueListAnnotation=function(){var t;if(a.hasValueListRelevantQualifiers(this._fieldViewMetadata)){t=this.oControl.getBindingContext()&&this.oControl.getBindingContext().getPath()}return this._oMetadataAnalyser.getValueListAnnotationLazy(this._sFullyQualifiedFieldName,t)};f.prototype.attachValueListChanged=function(t,e){this.attachEvent("valueListChanged",t,e)};f.prototype.detachValueListChanged=function(t,e){this.detachEvent("valueListChanged",t,e)};f.prototype._onAnnotationLoad=function(t){var e={};this.oPrimaryValueListAnnotation=t.primaryValueListAnnotation;this.additionalAnnotations=t.additionalAnnotations;this._resolveAnnotationData(this.oPrimaryValueListAnnotation);this.bInitialised=true;if(this._fBaseValueListProviderResolve){this._fBaseValueListProviderResolve()}if(this._onMetadataInitialised&&this.sAggregationName&&!this.bTypeAheadEnabled&&this.oControl.$()){this._onMetadataInitialised()}if(t.primaryValueListAnnotation&&t.primaryValueListAnnotation.annotation||t.primaryValueListAnnotationWithPVQualifier&&t.primaryValueListAnnotationWithPVQualifier.annotation){e.primaryValueListAnnotation=t.primaryValueListAnnotation||t.primaryValueListAnnotationWithPVQualifier}if(Array.isArray(t.additionalAnnotations)&&t.additionalAnnotations.length>0){e.additionalAnnotations=t.additionalAnnotations}if(Array.isArray(t.additionalAnnotationsWithPVQualifier)&&t.additionalAnnotationsWithPVQualifier.length>0){if(Array.isArray(e.additionalAnnotations)){e.additionalAnnotations=e.additionalAnnotations.concat(t.additionalAnnotationsWithPVQualifier)}else{e.additionalAnnotations=t.additionalAnnotationsWithPVQualifier}}return e};f.prototype._resolvePropertyPath=function(){var t=this.oControl.getBindingInfo("value"),e,i,a;if(t&&t.parts){e=t.parts[0]?t.parts[0].path:""}if(e){a=e.split("/");if(a.length>1){i=a[a.length-1];this.sPropertyTypePath=e.replace("/"+i,"")}}};f.prototype._resolveAnnotationData=function(t){var e=0,i=0,a,s,o;if(this.oODataModel&&t){this.bSupportBasicSearch=t.isSearchSupported;this.sValueListTitle=t.valueListTitle||t.qualifier;this.sKey=t.keyField;this._aKeys=t.keys;this.sValueListEntitySetName=t.valueListEntitySetName;this.mInParams=t.inParams;this.mOutParams=t.outParams;this.mConstParams=t.constParams;this.sTokenDisplayBehaviour=this.sDisplayBehaviour;if(!this.sTokenDisplayBehaviour||this.sTokenDisplayBehaviour===u.auto){this.sTokenDisplayBehaviour=this.oFilterProvider?this.oFilterProvider.sDefaultTokenDisplayBehaviour:u.descriptionAndId}this.sSingleFieldDisplayBehaviour=this.sDisplayBehaviour;if(!this.sSingleFieldDisplayBehaviour||this.sSingleFieldDisplayBehaviour===u.auto){this.sSingleFieldDisplayBehaviour=this.oFilterProvider?this.oFilterProvider.sDefaultSingleFieldDisplayBehaviour:u.descriptionAndId}if(!t.descriptionField){this.sTokenDisplayBehaviour=u.idOnly;this.sSingleFieldDisplayBehaviour=u.idOnly}this.sDescription=t.descriptionField||this.sKey;if(this.sValueListEntitySetName&&this.sKey){this._aCols=[];this._aCombinedDescriptionColNames=[];this.aSelect=[];a=t.valueListFields;o=t.aHighImportanceFields;if(o&&o.length){this._aHighImportanceCols=[]}e=a.length;for(i=0;i<e;i++){s=a[i];if(s.visible){var r=this._getColumnConfigFromField(s);if(r&&o&&o.indexOf(s)!==-1){this._aHighImportanceCols.push(r)}if(r){this._aCols.push(r)}}this.aSelect.push(s.name)}if(t.descriptionField){this.aSelect.push(t.descriptionField)}if(t.deprecationCodeField){this.aSelect.push(t.deprecationCodeField)}}else{if(!this.sKey){n.error("BaseValueListProvider","key for ValueListEntitySetName '"+this.sValueListEntitySetName+"' missing! Please check your annotations")}}}};f.prototype._getColumnConfigFromField=function(t){if(this._aCombinedDescriptionColNames&&this._aCombinedDescriptionColNames.includes(t.name)){return}var e=null,s=null,o,n,r=t.displayBehaviour||this._oMetadataAnalyser&&this._oMetadataAnalyser.getTextArrangementValue(t.fullName),l=this._oMetadataAnalyser&&this._oMetadataAnalyser.getDescriptionFieldName(t.name,this.sValueListEntitySetName),h=t.maxLength||0,p=0,f=0,m=t.name;if(t.type==="Edm.Boolean"){e="boolean"}else if(t.type==="Edm.DateTime"&&t.displayFormat==="Date"){e="date";n=this._oDateFormatSettings;o={displayFormat:"Date"}}else if(t.type==="Edm.Decimal"){e="decimal";o={precision:t.precision,scale:t.scale}}else if(t.type==="Edm.String"){if(t.isCalendarDate){e="stringdate"}else{e="string"}}if(a.hasTextArrangementAnnotation(t)&&l&&r&&(r===u.idAndDescription||r===u.descriptionAndId)){var y=this.oPrimaryValueListAnnotation.valueListFields.find(function(t){return t.name===l});p=y?y.maxLength:0;f=1;m=[t.name,l];this._aCombinedDescriptionColNames.push(l)}o=Object.assign({maxLength:""+(parseInt(h)+parseInt(p)+f)},o);s=i.getType(t.type,n,o,t.isCalendarDate);return{description:t.description,displayBehaviour:r,label:t.fieldLabel,tooltip:t.quickInfo||t.fieldLabel,type:e,oType:s,suggestionsWidth:d.calcColumnWidth(s,t.fieldLabel),width:d.calcColumnWidth(s,t.fieldLabel,{headerGap:true}),template:m,sort:t.sortable?t.name:undefined,sorted:t.sortable&&t.name===this.sKey,sortOrder:"Ascending"}};f.prototype._getFilterData=function(){var t,e={};if(this.oFilterProvider&&this.oFilterProvider._oSmartFilter){t=this.oFilterProvider._oSmartFilter.getFilterData();if(this.sFieldName&&this.sFieldName.indexOf(p)===0){Object.keys(t).forEach(function(i){var a=i.split(p);e[a[a.length-1]]=t[i]});return e}}return t};f.prototype._setFilterData=function(t){var e=t,i={};if(this.oFilterProvider){if(this.sFieldName&&this.sFieldName.indexOf(p)===0){Object.keys(t).forEach(function(e){i[p+e]=t[e]});e=i}this.oFilterProvider.setFilterData(e)}};f.prototype._adaptPropertyValue=function(t,e){var i=e;if((e instanceof Date||typeof e==="string"&&!isNaN(e))&&this.oPrimaryValueListAnnotation&&this.oPrimaryValueListAnnotation.fields){var a=null;this.oPrimaryValueListAnnotation.fields.some(function(e){if(e.name===t){a=e}return a!==null});if(a&&a.type==="Edm.DateTime"&&a.displayFormat==="Date"){i=o.utcToLocal(e)}if(a&&a.isDigitSequence){var s=new RegExp("^[0]*$");if(s.test(e)){i=null}}}return i};f.prototype._calculateFilterInputData=function(){var t,e,i=null,a,s;delete this.mFilterInputData;this.mFilterInputData={};this.aFilterField=[];if(this.oFilterProvider&&this.oFilterProvider._oSmartFilter){i=this._getFilterData()}else if(this.oFilterModel){i=this.oFilterModel.getData()}if(this.mInParams&&i){for(t in this.mInParams){if(t){e=this.mInParams[t];e=e.replace("/",".");if(e!==this.sKey){if(this.sContext==="mdcFilterPanel"||this.sContext==="SmartFilterBar"&&this._isFieldHiddenInFilterBar(this.oFilterProvider._oSmartFilter,t)){continue}if(i[t]||i[p+t]){this.mFilterInputData[e]=i[t]||i[p+t];if(typeof this.mFilterInputData[e]==="object"){if(this.mFilterInputData[e].ranges&&this.mFilterInputData[e].ranges.length>0){for(var o=0;o<this.mFilterInputData[e].ranges.length;o++){this.mFilterInputData[e].ranges[o].keyField=e}}}this.aFilterField.push(e)}}}}}else if(this.oODataModel&&this.bResolveInOutParams){a=this.oControl.getBindingContext();if(this.mInParams&&a){for(t in this.mInParams){if(t){e=this.mInParams[t];e=e.replace("/",".");if(e!==this.sKey){var n=this.sPropertyTypePath?this.sPropertyTypePath+"/"+t:t;var r=a.getProperty(n);if(r||r===false){r=this._adaptPropertyValue(e,r);this.mFilterInputData[e]=r;this.aFilterField.push(e)}}}}}}if(this.mConstParams){for(s in this.mConstParams){this.mFilterInputData[s]=this.mConstParams[s];this.aFilterField.push(s)}}};f.prototype._isFieldHiddenInFilterBar=function(t,e){var i=t&&(t._getFilterItemByName(e)||t._getFilterItemByName(p+e));return!i||!i.getVisibleInAdvancedArea()};f.prototype._calculateAndSetFilterOutputData=function(t){var e,i,a,n=null,r,l,h,d,u,p,f;if(this.mOutParams&&t&&(this.oFilterProvider||this.oFilterModel)){n={};u=function(t){return t.key===h.key};p=function(t){if(h.value1 instanceof Date&&t.value1 instanceof Date){return t.operation==="EQ"&&h.value1.getTime()===t.value1.getTime()}return t.operation==="EQ"&&h.value1===t.value1};f=function(t){return t.operation==="EQ"&&h.key===t.value1};for(e in this.mOutParams){if(e){if(!this.oFilterProvider&&Object.keys(this.mOutParams).length>1){if(e!==this.sFieldName){continue}}var m=this.oFilterProvider&&this.oFilterProvider._getFieldMetadata(e);a=this.mOutParams[e];if(t.length>0){for(var d=0;d<this._aCols.length;d++){if(this._aCols[d].template===a){var y=this._aCols[d].description;i=t[0][y]}}}if(a!==this.sKey){l=null;d=t.length;while(d--){r=t[d];if(this.sContext==="mdcFilterPanel"||this.sContext==="SmartFilterBar"&&this._isFieldHiddenInFilterBar(this.oFilterProvider._oSmartFilter,e)){continue}if(r[a]){var g=r[a];var v=m&&(m.type==="Edm.DateTime"||!m.hasValueListAnnotation);if(v){if(m.type==="Edm.DateTime"&&this._oDateFormatSettings.UTC==true){g=o.utcToLocal(g)}h={exclude:false,operation:"EQ",keyField:e,value1:g,value2:null}}else{h={key:g,text:s.getFormattedExpressionFromDisplayBehaviour(this.sTokenDisplayBehaviour,g,i)}}if(!n[e]){if(!l&&this.oFilterModel){l=this.oFilterModel.getData()}if(l&&l[e]&&l[e].items){n[e]=l[e];if(!n[e].ranges){n[e].ranges=[]}}else{n[e]={items:[],ranges:[]}}}var c=n[e];if(v){if(c.ranges.filter(p).length<=0){c.ranges.push(h)}}else if(c.items.filter(u).length<=0){if(!c.ranges||c.ranges.filter(f).length<=0){c.items.push(h)}}}}}}}if(n){if(this.oFilterProvider){this._setFilterData(n);if(!jQuery.isEmptyObject(n)){this.fireEvent("valueListChanged",{changes:Object.keys(n)})}}else if(this.oFilterModel){this.oFilterModel.setData(n,true)}}}else if(this.oODataModel&&this.bResolveInOutParams){this._calculateAndSetODataModelOutputData(t[0])}};f.prototype._calculateAndSetODataModelOutputData=function(t){var e,i,a,s,o,n={};if(t&&this.mOutParams){e=this.oControl.getBindingContext();for(i in this.mOutParams){if(i){a=this.mOutParams[i];if(a!==this.sKey){o=t[a];n[i]=o;s=this.sPropertyTypePath?this.sPropertyTypePath+"/"+i:i;this.oODataModel.setProperty(s,o,e,true)}}}if(n&&!jQuery.isEmptyObject(n)){this.fireEvent("valueListChanged",{changes:n})}}};f.prototype._handleRowsSelect=function(t){var e,i,a,o,n,l=[],h,d;if(!(this.oControl&&this.oControl.addToken)){return}h=this.oControl.getTokens();for(e=0;e<t.length;e++){a=t[e][this.sKey];o=t[e][this.sDescription];if(a||a===""){o=s.getFormattedExpressionFromDisplayBehaviour(this.sTokenDisplayBehaviour,a,o);n=new r({key:a,text:o,tooltip:o});n.data("row",t[e]);l.push(n);for(i=0;i<h.length;i++){d=h[i];var u=d.getKey();if(u||u===""&&u===a){break}else if(d.data("range")&&!d.data("range").exclude&&d.data("range").operation==="EQ"&&d.data("range").value1==a){break}}if(i<h.length){h.splice(i,1)}}}if(l.length){this.oControl.setTokens(h.concat(l))}};f.prototype.readData=function(t){var e=[],i;this._oReadPromise=new Promise(function(t){this._fBaseValueListProviderResolve=t}.bind(this));if(this.bInitialised){this._fBaseValueListProviderResolve()}this._oReadPromise.then(function(){this._fBaseValueListProviderResolve=null;for(var a=0;a<t.length;a++){i=this.sDisplayFormat==="UpperCase"?t[a].toUpperCase():t[a];e.push(new l(this.sKey,h.EQ,i))}if(!this.sValueListEntitySetName){return}this.oODataModel.read("/"+this.sValueListEntitySetName,{filters:e,success:function(e,i){if(e){if(e.results&&e.results.length!==t.length){n.error("Expecting "+t.length+" result rows, but received "+e.results.length+" rows...");return}var a=e.results;if(this.oControl&&this.oControl.isA("sap.m.MultiInput")&&this.oControl.getTokens().length!==t.length){a=this._getUpdatedDataModelRows(a)}this._handleRowsSelect(a)}}.bind(this),error:function(t){n.error("Error occured reading /"+this.sValueListEntitySetName)}.bind(this)})}.bind(this))};f.prototype._getUpdatedDataModelRows=function(t){var e=this.oControl.getTokens(),i=[];for(var a=0;a<e.length;a++){var s=e[a];var o=s.getKey();if(o){i.push(o)}else if(s.data("range")&&s.data("range").value1){i.push(s.data("range").value1)}}var n=[];for(var a=0;a<t.length;a++){var r=t[a][this.sKey];if(i.indexOf(r)!==-1){n.push(t[a])}}return n};f.prototype._addValidationPromise=function(t){var e,i,a,s=false;for(e=0;e<this._aValidationPromises.length;e++){a=this._aValidationPromises[e];if(a===null){this._aValidationPromises[e]=t;i=e;s=true;break}}if(!s){this._aValidationPromises.push(t);i=this._aValidationPromises.length-1}t.finally(function(){this._removeValidationPromise(i)}.bind(this))};f.prototype._removeValidationPromise=function(t){this._aValidationPromises[t]=null};f.prototype._getCurrentValidationPromises=function(){var t,e,i=[];for(t=0;t<this._aValidationPromises.length;t++){e=this._aValidationPromises[t];this._removeValidationPromise(t);i.push(e)}return i};f.prototype._isMultiFilterField=function(t){return t.isA("sap.m.MultiInput")};f.prototype._getDisplayBehaviour=function(){return this._isMultiFilterField(this.oControl)?this.sTokenDisplayBehaviour:this.sSingleFieldDisplayBehaviour};f.prototype.destroy=function(){e.prototype.destroy.apply(this,arguments);if(this._bCleanupMetadataAnalyser&&this._oMetadataAnalyser){this._oMetadataAnalyser.destroy()}this._oMetadataAnalyser=null;if(this.oBeforeRenderingEventDelegate){this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate);delete this.oBeforeRenderingEventDelegate}if(this.oAfterRenderingEventDelegate){this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate);delete this.oAfterRenderingEventDelegate}this.oControl=null;this.sFieldName=null;this.mFilterInputData=null;this.aFilterField=null;this.sValueListEntitySetName=null;this.oODataModel=null;this.oFilterModel=null;this.oFilterProvider=null;this.oPrimaryValueListAnnotation=null;this.additionalAnnotations=null;this.sDisplayFormat=null;this.bSupportBasicSearch=null;this.bInitialised=null;this._oError=null;this.sValueListTitle=null;this.sKey=null;this._aKeys=null;this.mInParams=null;this.mOutParams=null;this.sDescription=null;this.aSelect=null;this._aCols=null;this._aHighImportanceCols=null;this.sDDLBDisplayBehaviour=null;this.sTokenDisplayBehaviour=null;this._oDateFormatSettings=null;this._fieldViewMetadata=null;this._oReadPromise=null;this._fBaseValueListProviderResolve=null;this.bIsDestroyed=true;this._aValidationPromises=null};return f});
//# sourceMappingURL=BaseValueListProvider.js.map