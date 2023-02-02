/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.ui.mdc.field.InParameter",{metadata:{library:"sap.ui.mdc",properties:{value:{type:"any",byValue:true,defaultValue:null},helpPath:{type:"string"},initialValueFilterEmpty:{type:"boolean",defaultValue:false}},defaultProperty:"value"}});e.prototype.init=function(){this.attachEvent("modelContextChange",i,this)};e.prototype.exit=function(){};e.prototype.bindProperty=function(e,i){if(e==="value"&&!i.formatter){i.targetType="raw"}t.prototype.bindProperty.apply(this,arguments)};e.prototype.getFieldPath=function(){var t=this.getBinding("value");var e;if(t){e=t.getPath()}else{var i=this.getBindingInfo("value");if(i){if(i.path){e=i.path}else if(i.parts&&i.parts.length===1){e=i.parts[0].path}}}if(e&&e.startsWith("/")){e=e.slice(1)}if(!e){e=this.getHelpPath()}return e};function i(t){var e=this.getBinding("value");this._bBound=false;this._bConditionModel=false;if(e){this._bBound=true;var i=e.getModel();if(i&&i.isA("sap.ui.mdc.condition.ConditionModel")){this._bConditionModel=true}}}e.prototype.getUseConditions=function(){var t=false;if(this._bConditionModel){t=true}else if(!this._bBound){var e=this.getBindingInfo("value");if(e){var i;if(e.path){i=e.path}else if(e.parts&&e.parts.length===1){i=e.parts[0].path}if(i.startsWith("/conditions/")){t=true}}else{var a=this.getValue();if(Array.isArray(a)&&(a.length===0||a[0].hasOwnProperty("operator"))){t=true}}}return t};e.prototype.getDataType=function(){var t;if(!this.getUseConditions()){var e=this.getBinding("value");if(e){t=e.getType()}}return t};return e});
//# sourceMappingURL=InParameter.js.map