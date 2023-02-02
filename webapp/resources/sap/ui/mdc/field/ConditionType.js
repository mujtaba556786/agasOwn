/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/SimpleType","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/type/String","sap/ui/mdc/enum/FieldDisplay","sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/mdc/condition/Operator","sap/ui/mdc/condition/Condition","sap/ui/mdc/enum/BaseType","sap/ui/mdc/enum/ConditionValidated","sap/base/util/merge","sap/base/strings/whitespaceReplacer","sap/ui/base/SyncPromise"],function(e,t,a,i,r,n,o,s,l,u,d,f,c,h){"use strict";var p="sap.ui.mdc.raw";var v="sap.ui.mdc.raw:";var m=e.extend("sap.ui.mdc.field.ConditionType",{constructor:function(t,a){e.apply(this,arguments);this.sName="Condition";this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");this._oCalls={active:0,last:0,condition:undefined,exception:undefined}}});m.prototype.destroy=function(){e.prototype.destroy.apply(this,arguments);if(this._oDefaultType){this._oDefaultType.destroy();delete this._oDefaultType}this._bDestroyed=true};m.prototype.formatValue=function(e,a){if(e==undefined||e==null||this._bDestroyed){return null}if(typeof e!=="object"||!e.operator||!e.values||!Array.isArray(e.values)){throw new t("No valid condition provided")}if(!a){a="string"}var i=F.call(this);var r=I(i);var s=this.oFormatOptions.preventGetDescription;M.call(this,e,i);switch(this.getPrimitiveType(a)){case"string":case"any":var l=w.call(this);var u=x.call(this);var c=o.getEQOperator(u);if(!this.oFormatOptions.maxConditions||this.oFormatOptions.maxConditions===1){this._oCalls.active++;this._oCalls.last++}var v=this._oCalls.last;if(!s&&l!==n.Value&&e.validated===d.Validated&&(r||e.operator===c.name&&!e.values[1])){var m=this.oFormatOptions.bindingContext;var g=this.oFormatOptions.conditionModel;var O=this.oFormatOptions.conditionModelName;var C=r?e.values[0][1]:e.values[0];return h.resolve().then(function(){return j.call(this,C,e,i,m,g,O)}.bind(this)).then(function(t){if(t){e=f({},e);if(r){i=T.call(this);e.operator=c.name;if(typeof t!=="object"){t={key:C,description:t}}}if(typeof t==="object"){e=A.call(this,e,t)}else if(e.values.length===1){e.values.push(t)}else{e.values[1]=t}}return y.call(this,e,undefined,v,true,i)}.bind(this)).catch(function(a){var r;if(!(a instanceof t)||!U.call(this)){r=a}return y.call(this,e,r,v,true,i)}.bind(this)).unwrap()}return y.call(this,e,undefined,v,true,i);default:var V=K(a);if(V>=0){if(N.call(this,i)){return e.values.length>=1?e.values[0][V]:null}}else if(a===p){return e.values.length>=1?e.values[0]:null}else if(i&&e.values.length>=1){return i.formatValue(e.values[0],a)}throw new t("Don't know how to format Condition to "+a)}};function g(e,a){var i=w.call(this);var r=I(a);if(r&&e.values.length>1&&e.values[0][1]===e.values[1][1]){e=f({},e);e.operator="EQ";e.values.splice(1)}var s=this.oFormatOptions.hideOperator&&e.values.length===1||r;var l=o.getOperator(e.operator);var d=E.call(this);if(!l){throw new t("No valid condition provided, Operator wrong.")}var h=l.format(e,a,i,s,d);var p=this.oFormatOptions.convertWhitespaces;if(p&&(Q.call(this,a)===u.String||i!==n.Value)){h=c(h)}return h}function y(e,t,a,i,r){if(this._oCalls.active>0){this._oCalls.active--}if(a<this._oCalls.last&&(this._oCalls.condition!==undefined||this._oCalls.exception!==undefined)){e=this._oCalls.condition;t=this._oCalls.exception}if(a===this._oCalls.last&&this._oCalls.active>0){this._oCalls.condition=f({},e);this._oCalls.exception=t}else if(this._oCalls.active===0&&this._oCalls.last>0){this._oCalls={active:0,last:0,condition:undefined,exception:undefined}}if(t){throw t}var n;if(i){n=g.call(this,e,r)}else{n=O.call(this,e,r)}return n}m.prototype.parseValue=function(e,t){if(this._bDestroyed){return null}if(!t){t="string"}else if(t==="any"&&typeof e==="string"){t="string"}var i=this.oFormatOptions.navigateCondition;if(i){var r=this.formatValue(i,t);if(r===e){return f({},i)}}var n=w.call(this);var s=B.call(this);var u=F.call(this);var c=P.call(this);var h=x.call(this);var v=I(u);var m;if(e===null||e===undefined||e===""&&!s){if(!N.call(this,u)){return null}}S.call(this,u);switch(this.getPrimitiveType(t)){case"string":var g;var O=false;var V=false;if(h.length===1){g=o.getOperator(h[0]);V=true}else{var _=o.getMatchingOperators(h,e);if(_.length===0){g=L.call(this,h,u);if(s&&!N.call(this,u)){var T=o.getEQOperator(h);if(h.indexOf(T.name)>=0){O=!!g&&g.name!==T.name;g=T}}V=true}else{var b=_.filter(function(e){return e.valueTypes.length===0});if(b.length>=1){g=b[0]}else{g=_[0]}}}if(g){if(v&&g!==o.getEQOperator(h)){throw new a("unsupported operator")}var D;var M=N.call(this,u);var A=E.call(this);this._oCalls.active++;this._oCalls.last++;var Q=this._oCalls.last;if((!M||v)&&g.validateInput&&s){D=C.call(this,g,e,u,V,O,h,n,true);if(D instanceof Promise){return k.call(this,D)}else{return D}}else{try{if(e===""&&M&&V){D=l.createCondition(g.name,[u.parseValue(e,"string",u._aCurrentValue)],undefined,undefined,d.NotValidated)}else{D=g.getCondition(e,u,n,V,A)}}catch(t){var U=t;if(U instanceof a&&c&&!M){try{c.parseValue(e,"string",c._aCurrentValue)}catch(e){U=e}}return y.call(this,undefined,U,Q,false,u)}}if(D){return y.call(this,D,undefined,Q,false,u)}}throw new a("Cannot parse value "+e);default:if(u){if(h.length===1){m=h[0]}else{m=L.call(this,h,u).name;if(h.indexOf(m)<0){m=undefined}}if(m){var R=K(t);if(R>=0){if(N.call(this,u)){var j=f([],u._aCurrentValue);j[R]=e;return l.createCondition(m,[j],undefined,undefined,d.NotValidated)}}else if(t===p){return l.createCondition(m,[e],undefined,undefined,d.NotValidated)}else{return l.createCondition(m,[u.parseValue(e,t)],undefined,undefined,d.NotValidated)}}}throw new a("Don't know how to parse Condition from "+t)}};function O(e,t){var a=I(t);var i=N.call(this,t);if(e&&!a&&i){var r=P.call(this)||t;var n=r.getMetadata().getName();var o=r.getFormatOptions();var s=r.getConstraints();var l=this.oFormatOptions.delegate;var d=this.oFormatOptions.payload;var f=l&&l.getTypeUtil(d).getBaseType(n,o,s);if((f===u.Unit||f===u.DateTime)&&!e.values[0][1]&&t._aCurrentValue){var c=t._aCurrentValue[1]?t._aCurrentValue[1]:null;e.values[0][1]=c;if(e.operator==="BT"){e.values[1][1]=c}}}M.call(this,e,t);return e}function C(e,r,o,u,f,c,p,v){var m;var g;var O=true;var w=false;var F;var T;var P=this.oFormatOptions.bindingContext;var b=this.oFormatOptions.conditionModel;var x=this.oFormatOptions.conditionModelName;var D;if(r===""){D=[];m=r;F=r}else{D=e.getValues(r,p,u);m=v?D[0]:D[1];g=v?D[1]:D[0];w=p!==n.Value;F=m||g}var N=function(i){if(i&&!(i instanceof a)&&!(i instanceof t)){throw i}if(!i._bNotUnique){if(r===""){return null}if(v&&D[0]&&D[1]){return C.call(this,e,r,o,u,f,c,p,false)}if(f){return V.call(this,o,c,r,p)}}if(U.call(this)){return _.call(this,o,c,r,p)}throw new a(i.message)};var E=function(t){if(t){var i=[t.key];if(e.valueTypes.length>1&&e.valueTypes[1]!==s.ValueType.Static){i.push(t.description)}return l.createCondition(e.name,i,t.inParameters,t.outParameters,d.Validated,t.payload)}else if(r===""){return null}else{return N.call(this,new a(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[r])))}};var M=this._oCalls.last;var S=function(t,i){var n;var s;try{n=i.call(this,t);if(I(o)){if(n){if(n.operator!=="EQ"){throw new a("unsupported operator")}var u=o._aCurrentValue&&o._aCurrentValue[0]!==undefined?o._aCurrentValue[0]:null;var f=n.values[0];n.values=[[u,f]]}else if(r===""){n=l.createCondition(e.name,[o.parseValue(r,"string",o._aCurrentValue)],undefined,undefined,d.NotValidated)}}}catch(e){s=e}return y.call(this,n,s,M,false,o)};try{if(I(o)){T=o.parseValue(F,"string",o._aCurrentValue);o.validateValue(T);T=T[1]}else{T=o.parseValue(F,"string");o.validateValue(T)}}catch(e){if(e&&!(w&&(e instanceof a||e instanceof i))){throw e}O=false;T=undefined}return h.resolve().then(function(){return R.call(this,F,T,o,P,O,w,b,x)}.bind(this)).then(function(e){return S.call(this,e,E)}.bind(this)).catch(function(e){return S.call(this,e,N)}.bind(this)).unwrap()}function V(e,t,a,i){var r=L.call(this,t,e);var o;if(r&&t.indexOf(r.name)>=0){o=r.getCondition(a,e,n.Value,true);o.validated=d.NotValidated}return o}function _(e,t,i,r){var s;if(I(e)){s=o.getEQOperator("EQ")}else if(t.length===1){s=o.getOperator(t[0])}else{s=o.getEQOperator(t);if(t.indexOf(s.name)<0){s=undefined}}if(!s){throw new a("Cannot parse value "+i)}var l=s.getCondition(i,e,n.Value,true);if(l){l.validated=d.NotValidated;if(I(e)&&Array.isArray(l.values[0])){l.values[0]=l.values[0][1]}}return l}m.prototype.validateValue=function(e){var t=F.call(this);var a=P.call(this);var r=x.call(this);var n=I(t);var s=N.call(this,t);var l=E.call(this);var u=0;if(e===undefined||this._bDestroyed){return null}else if(e===null){if(o.onlyEQ(r)){try{if(t.hasOwnProperty("_sParsedEmptyString")&&t._sParsedEmptyString!==null){t.validateValue(t._sParsedEmptyString)}else{t.validateValue(null)}}catch(e){if(e instanceof i){throw e}else{return null}}}return null}if(typeof e!=="object"||!e.operator||!e.values||!Array.isArray(e.values)){throw new i(this._oResourceBundle.getText("field.VALUE_NOT_VALID"))}var d=o.getOperator(e.operator);if(n){d=o.getEQOperator();u=1}if(!d||r.indexOf(d.name)===-1){throw new i("No valid condition provided, Operator wrong.")}try{d.validate(e.values,t,l,u)}catch(t){if(t instanceof i&&a&&!s){d.validate(e.values,a,l,u)}throw t}};function w(){var e=this.oFormatOptions.display;if(!e){e=n.Value}return e}function F(){var e=this.oFormatOptions.valueType;if(!e){e=T.call(this)}return e}function T(){if(!this._oDefaultType){this._oDefaultType=new r}return this._oDefaultType}function P(){return this.oFormatOptions.originalDateType}function b(){return this.oFormatOptions.additionalType}function x(){var e=this.oFormatOptions.operators;if(!e||e.length===0){e=o.getOperatorsForType(u.String)}return e}function D(){var e=this.oFormatOptions.fieldHelpID;if(e){var t=sap.ui.getCore().byId(e);if(t&&t.isValidationSupported()){return t}}return null}function N(e){return e&&e.isA("sap.ui.model.CompositeType")}function E(){return this.oFormatOptions.compositeTypes}function I(e){if(N(e)){var t=e.getFormatOptions();var a=!t||!t.hasOwnProperty("showMeasure")||t.showMeasure;var i=!t||!t.hasOwnProperty("showNumber")||t.showNumber;var r=!t||!t.hasOwnProperty("showTimezone")||t.showTimezone;var n=!t||!t.hasOwnProperty("showDate")||t.showDate;var o=!t||!t.hasOwnProperty("showTime")||t.showTime;if(a&&!i||r&&!n&&!o){return true}}return false}function M(e,t){if(N.call(this,t)&&e&&e.values[0]){t._aCurrentValue=f([],e.values[0]);var a=b.call(this);if(N.call(this,a)){a._aCurrentValue=f([],e.values[0])}var i=P.call(this);if(N.call(this,i)){i._aCurrentValue=f([],e.values[0])}}}function S(e){if(N.call(this,e)){var t=b.call(this);if(N.call(this,t)){if(!t._aCurrentValue){t._aCurrentValue=[]}e._aCurrentValue=t._aCurrentValue}}}function A(e,t){e.values=[t.key,t.description];if(t.inParameters){e.inParameters=t.inParameters}if(t.outParameters){e.outParameters=t.outParameters}return e}function k(e){if(this.oFormatOptions.asyncParsing){this.oFormatOptions.asyncParsing(e)}return e}function Q(e){var t=e.getMetadata().getName();var a=e.getFormatOptions();var i=e.getConstraints();var r=this.oFormatOptions.delegate;var n=this.oFormatOptions.payload;var o=r?r.getTypeUtil(n).getBaseType(t,a,i):u.String;if(o===u.Unit){o=u.Numeric}return o}function B(){var e=D.call(this);var t=this.oFormatOptions.delegate;var a=this.oFormatOptions.payload;if(t){return t.isInputValidationEnabled(a,e)}else{return!!e}}function U(){var e=D.call(this);var t=this.oFormatOptions.delegate;var a=this.oFormatOptions.payload;if(t){return t.isInvalidInputAllowed(a,e)}else if(e){return!e.getValidateInput()}else{return true}}function R(e,t,i,r,n,o,s,l){var u=D.call(this);var d=this.oFormatOptions.delegate;var f=this.oFormatOptions.payload;var c=this.oFormatOptions.control;var h={value:e,parsedValue:t,dataType:i,inParameters:undefined,outParameters:undefined,bindingContext:r,checkKey:n,checkDescription:o,conditionModel:s,conditionModelName:l,exception:a,control:c};if(d){return d.getItemForValue(f,u,h)}else if(u){return u.getItemForValue(h)}}function j(e,a,i,r,n,o){var s=D.call(this);var l=this.oFormatOptions.delegate;var u=this.oFormatOptions.payload;var d=this.oFormatOptions.control;if(l){return l.getDescription(u,s,e,a.inParameters,a.outParameters,r,n,o,a.payload,d,i)}else if(s){if(s.isA("sap.ui.mdc.ValueHelp")){var f={value:e,parsedValue:e,dataType:i,context:{inParameters:a.inParameters,outParameters:a.outParameters,payload:a.payload},bindingContext:r,conditionModel:n,conditionModelName:o,checkKey:true,checkDescription:false,caseSensitive:true,exception:t,control:d};return s.getItemForValue(f)}else{return s.getTextForKey(e,a.inParameters,a.outParameters,r,n,o)}}}function L(e,t){var a=this.oFormatOptions.defaultOperatorName;var i;if(a){i=o.getOperator(a)}else{i=o.getDefaultOperator(Q.call(this,t))}if(i&&e.indexOf(i.name)<0){for(var r=0;r<e.length;r++){i=o.getOperator(e[r]);if(i.exclude||!i.hasRequiredValues()){i=undefined}else{break}}}return i}function K(e){var t=-1;if(e.startsWith(v)){t=parseInt(e[v.length])}return t}return m});
//# sourceMappingURL=ConditionType.js.map