/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/field/FieldBase","sap/ui/mdc/field/FieldBaseRenderer","sap/ui/mdc/enum/FieldDisplay","sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/mdc/enum/BaseType","sap/base/util/deepEqual","sap/base/util/merge","sap/ui/model/BindingMode","sap/ui/model/Context","sap/ui/mdc/condition/Condition"],function(t,e,i,a,n,o,s,r,l,p){"use strict";var h=t.extend("sap.ui.mdc.Field",{metadata:{library:"sap.ui.mdc",designtime:"sap/ui/mdc/designtime/field/Field.designtime",properties:{value:{type:"any",defaultValue:null},additionalValue:{type:"any",defaultValue:null}},events:{change:{parameters:{value:{type:"string"},valid:{type:"boolean"},promise:{type:"Promise"}}}},defaultProperty:"value"},renderer:e});h.prototype.init=function(){this._vValue=null;this._vAdditionalValue=null;t.prototype.init.apply(this,arguments);this.setMaxConditions(1);this._oObserver.observe(this,{properties:["value","additionalValue"]})};h.prototype.exit=function(){t.prototype.exit.apply(this,arguments);if(this._iConditionUpdateTimer){clearTimeout(this._iConditionUpdateTimer);delete this._iConditionUpdateTimer;delete this._bPendingConditionUpdate}this._oBindingContext=undefined};h.prototype.bindProperty=function(e,i){if(e==="value"&&!i.formatter){i.targetType="raw";var a=this._getContentFactory().getDataType();if(i.type&&(!a||a.getMetadata().getName()!==i.type.getMetadata().getName()||!o(a.getFormatOptions(),i.type.getFormatOptions())||!o(a.getConstraints(),i.type.getConstraints())||a._bCreatedByOperator!==i.type._bCreatedByOperator)){this._getContentFactory().setDataType(i.type);this._getContentFactory().setDateOriginalType(undefined);this._getContentFactory().setUnitOriginalType(undefined);this._getContentFactory().setIsMeasure(false);if(i.type.isA("sap.ui.model.CompositeType")&&i.parts){var n=[];for(var s=0;s<i.parts.length;s++){n.push(i.parts[s].type)}this._getContentFactory().setCompositeTypes(n)}this._getContentFactory().updateConditionType();this.invalidate()}}t.prototype.bindProperty.apply(this,arguments)};h.prototype._handleModelContextChange=function(e){t.prototype._handleModelContextChange.apply(this,arguments);var i=this.getBinding("value");if(i){var a=i.isA("sap.ui.model.CompositeBinding")?i.getBindings()[0].getContext():i.getContext();if(l.hasChanged(this._oBindingContext,a)){this._oBindingContext=a;this._getContentFactory().updateConditionType();if(this._bParseError||this.getFieldHelp()){if(this._oManagedObjectModel){this._oManagedObjectModel.checkUpdate(true,true)}this._bParseError=false}}if(!this._getContentFactory().getDataType()){this._getContentFactory().setDataType(i.getType());this.invalidate()}}};h.prototype._initDataType=function(){t.prototype._initDataType.apply(this,arguments);var e=this.getBinding("value");if(e){this._getContentFactory().setDataType(e.getType())}};h.prototype.setProperty=function(e,i,a){if(e==="value"&&this._bParseError&&o(this.getValue(),this.validateProperty(e,i))){if(this._oManagedObjectModel){this._oManagedObjectModel.checkUpdate(true,true)}this._bParseError=false}return t.prototype.setProperty.apply(this,arguments)};h.prototype.setMaxConditions=function(t){if(t!==1){throw new Error("Only one condition allowed for Field "+this)}return this.setProperty("maxConditions",t,true)};h.prototype._observeChanges=function(e){t.prototype._observeChanges.apply(this,arguments);if(e.name==="value"){var i=c.call(this,e.current,e.old);if(this._vAdditionalValue!==null&&v.call(this)&&!f.call(this,i,this._vValue,true)){this._vAdditionalValue=this.getAdditionalValue()}this._vValue=i;C.call(this,e.current);g.call(this)}if(e.name==="additionalValue"){this._vAdditionalValue=e.current;g.call(this)}if(e.name==="conditions"){if(this._getContent().length<=1){_.call(this,e.current)}}};function d(){return this._vValue}function u(){return this._vAdditionalValue}function g(){if(!this.bDelegateInitialized){this.awaitControlDelegate().then(function(){if(!this.bIsDestroyed){g.call(this)}}.bind(this));return}if(this.getDisplay()===i.Value){y.call(this,d.call(this),u.call(this))}else if(!this._iConditionUpdateTimer){this._iConditionUpdateTimer=setTimeout(function(){y.call(this,d.call(this),u.call(this));this._iConditionUpdateTimer=undefined;this._bPendingConditionUpdate=false}.bind(this),0);this._bPendingConditionUpdate=true}}function y(t,e){var i=this.getConditions();if(this._checkValueInitial(t)&&!e){if(i.length>0){this.setConditions([])}}else{var a=i[0];var n=a&&a.values[0];var o=a&&a.values[1]?a.values[1]:null;if(!a||a.operator!=="EQ"||!f.call(this,n,t)||o!==e){var s=this.getControlDelegate();var r=this.getPayload();var l=s.createCondition(r,this,[t,e],a);if(!p.compareConditions(a,l)){this.setConditions(l?[l]:[])}}}}function c(t,e){var i=this._getContentFactory().getDataType()?this._getContentFactory().getDataType().getMetadata().getName():this.getDataType();if(t&&e&&(i==="sap.ui.model.odata.type.Unit"||i==="sap.ui.model.odata.type.Currency")&&!t[2]&&e[2]!==undefined){t=s([],t);t[2]=e[2];if(this._bPendingChange){var a=this.getConditions()[0];if(a){if(t[0]===e[0]&&t[0]!==a.values[0][0]){t[0]=a.values[0][0]}if(t[1]===e[1]&&t[1]!==a.values[0][1]){t[1]=a.values[0][1]}}}}return t}function f(t,e,i){var a=t===e;var s=this._getContentFactory().getDataType()?this._getContentFactory().getDataType().getMetadata().getName():this.getDataType();if(!a&&this.getTypeUtil().getBaseType(s)===n.Unit&&Array.isArray(t)&&Array.isArray(e)){var r=t[0];var l=t[1];var p=t.length>=3?t[2]:null;var h=e[0];var d=e[1];var u=e.length>=3?e[2]:null;if(r===h&&l===d&&((this._bUnitSet||i)&&(!p||!u)||o(p,u))){a=true}if((p||u)&&!i){this._bUnitSet=true}}return a}function C(t){if(!this._bTypeInitialized){if(!this.bDelegateInitialized){this.awaitControlDelegate().then(function(){if(!this.bIsDestroyed){C.call(this,t)}}.bind(this));return}var e=this.getBinding("value");var i=e?e.getType():this._getContentFactory().getDataType();this._oTypeInitialization=this.getControlDelegate().initializeTypeFromBinding(this.getPayload(),i,t);this._bTypeInitialized=this._oTypeInitialization.bTypeInitialized;if(this._bTypeInitialized&&this._getContentFactory().getUnitOriginalType()){this.getControlDelegate().initializeInternalUnitType(this.getPayload(),this._getContentFactory().getDataType(),this._oTypeInitialization);this.getControlDelegate().initializeInternalUnitType(this.getPayload(),this._getContentFactory().getUnitType(),this._oTypeInitialization)}}}h.prototype._fireChange=function(t,e,i,a){var n;if(t){if(e){n=this._getResultForPromise(t)}else{n=i}}if(this._getContent().length>1){if(t){_.call(this,this.getConditions())}else if(a){a=a.then(function(t){_.call(this,this.getConditions());return t}.bind(this))}}this.fireChange({value:n,valid:e,promise:a})};h.prototype._getResultForPromise=function(t){var e;if(t.length===0&&this._getContentFactory().getDataType()){e=this._getContentFactory().getDataType().parseValue("","string",[])}else if(t.length===1){e=t[0].values[0]}return e};function _(t){if(!this.bDelegateInitialized){this.awaitControlDelegate().then(function(){if(!this.bIsDestroyed){_.call(this,t)}}.bind(this));return}var e=null;var i=null;var a=this.getValue();var n=this.getAdditionalValue();if(t.length===0&&a===null&&n===null){return}e=this._getResultForPromise(t);if(t.length===0&&!n){i=n}else if(t.length===1&&t[0].values.length>1){i=t[0].values[1]}this._vValue=e;this._vAdditionalValue=i;if(!f.call(this,e,a,true)){this.setProperty("value",e,true)}if(i!==n&&!v.call(this)){this.setProperty("additionalValue",i,true)}}h.prototype._getOperators=function(){return["EQ"]};function v(){var t=this.getBinding("additionalValue");if(t&&t.getBindingMode()===r.OneWay){return true}return false}h.prototype._checkCreateInternalContent=function(){if(!this.bIsDestroyed&&this._getContentFactory().getDataType()&&!this._isPropertyInitial("editMode")&&!this._isPropertyInitial("multipleLines")){t.prototype._checkCreateInternalContent.apply(this,arguments)}};h.prototype.getOverflowToolbarConfig=function(){var e=t.prototype.getOverflowToolbarConfig.apply(this,arguments);e.propsUnrelatedToSize.push("value");e.propsUnrelatedToSize.push("additionalValue");return e};return h});
//# sourceMappingURL=Field.js.map