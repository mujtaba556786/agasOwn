/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/util/DataProvider","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/model/odata/v4/ODataUtils","sap/ui/core/Core"],function(e,jQuery,t,r,s){"use strict";var i=[429,503];var n=["no-cors","same-origin","cors"];var o=["GET","POST","HEAD","PUT","PATCH","DELETE","OPTIONS"];var a=e.extend("sap.ui.integration.util.RequestDataProvider",{metadata:{library:"sap.ui.integration",properties:{allowCustomDataType:{type:"boolean",defaultValue:false}},associations:{host:{type:"sap.ui.integration.Host",multiple:false}}}});a.prototype.destroy=function(){if(this._iRetryAfterTimeout){clearTimeout(this._iRetryAfterTimeout)}e.prototype.destroy.apply(this,arguments)};a.prototype.getLastJQXHR=function(){return this._lastJQXHR};a.prototype.getData=function(){var e=this.getSettings().request,t=Promise.resolve(e);if(this._oDestinations){t=this._oDestinations.process(e)}if(this._oCsrfTokenHandler){t=t.then(function(e){return this._oCsrfTokenHandler.resolveToken(e)}.bind(this))}t=t.then(this._fetch.bind(this));if(this._oCsrfTokenHandler){t=t.catch(this._handleExpiredToken.bind(this))}return t};a.prototype._handleExpiredToken=function(e){if(this._oCsrfTokenHandler.isExpiredToken(this.getLastJQXHR())){this._oCsrfTokenHandler.resetTokenByRequest(this.getSettings().request);return this.getData().catch(function(e){throw e})}throw e};a.prototype._fetch=function(e){var s="Invalid request";if(!e||!e.url){t.error(s);return Promise.reject(s)}if(!this.getAllowCustomDataType()&&e.dataType){t.error("To specify dataType property in the Request Configuration, first set allowCustomDataType to 'true'.")}var i=e.parameters,n=e.url,o=this.getAllowCustomDataType()&&e.dataType||"json",a=e.headers||{},u=e.batch,f,d;if(!n.startsWith("/")){n=this._getRuntimeUrl(e.url)}if(this._hasHeader(e,"Content-Type","application/json")){i=JSON.stringify(e.parameters)}if(u){f=r.serializeBatchRequest(Object.values(u));o="text";i=f.body;a=Object.assign({},a,f.headers)}a=this._prepareHeaders(a,this.getSettings());d={mode:e.mode||"cors",url:n,method:e.method&&e.method.toUpperCase()||"GET",dataType:o,data:i,headers:a,timeout:15e3,xhrFields:{withCredentials:!!e.withCredentials}};if(!i){delete d.data}if(!this._isValidRequest(d)){t.error(s);return Promise.reject(s)}return this._request(d).then(function(e){var t=e[0];if(u){return this._deserializeBatchResponse(u,t)}return t}.bind(this))};a.prototype._request=function(e,t){return new Promise(function(r,s){jQuery.ajax(e).done(function(e,t,i){if(this.bIsDestroyed){s("RequestDataProvider is already destroyed before the response is received.");return}this._lastJQXHR=i;r([e,i])}.bind(this)).fail(function(i,n,o){var a=[o,i];if(this.bIsDestroyed){s("RequestDataProvider is already destroyed while error in the response occurred.");return}this._lastJQXHR=i;if(t){s(a);return}this._retryRequest(a,e).then(r,s)}.bind(this))}.bind(this))};a.prototype._retryRequest=function(e,r){var s=e[1],n=this._getRetryAfter(s);if(!i.includes(s.status)){return Promise.reject(e)}if(!n){t.warning("Request could be retried, but Retry-After header or configuration parameter retryAfter are missing.");return Promise.reject(e)}if(this._iRetryAfterTimeout){return Promise.reject("The retry was already scheduled.")}return new Promise(function(e,t){this._iRetryAfterTimeout=setTimeout(function(){this._request(r,true).then(e,t);this._iRetryAfterTimeout=null}.bind(this),n*1e3)}.bind(this))};a.prototype._getRetryAfter=function(e){var r=this.getSettings().request,s=e.getResponseHeader("Retry-After")||r.retryAfter;if(!s){return 0}if(Number.isInteger(s)){return s}if(!s.match(/^\d+$/)){t.error("Only number of seconds is supported as value of retry-after. Given '"+s+"'.");return 0}return parseInt(s)};a.prototype._hasHeader=function(e,t,r){if(!e.headers){return false}for(var s in e.headers){if(s.toLowerCase()===t.toLowerCase()&&e.headers[s]===r){return true}}return false};a.prototype._isValidRequest=function(e){if(!e){return false}if(n.indexOf(e.mode)===-1){return false}if(o.indexOf(e.method)===-1){return false}if(typeof e.url!=="string"){return false}return true};a.prototype._deserializeBatchResponse=function(e,t){return new Promise(function(s,i){var n=this.getLastJQXHR().getResponseHeader("Content-Type"),o=r.deserializeBatchResponse(n,t,false),a=Object.keys(e),u={};a.forEach(function(e,t){var r=o[t],s;if(!r){i("Batch responses do not match the batch requests.");return}s=new Response(r.responseText,r);if(!s.ok){i("One of batch requests fails with '"+s.status+" "+s.statusText+"'");return}u[e]=r.responseText?JSON.parse(r.responseText):{}});s(u)}.bind(this))};a.prototype._prepareHeaders=function(e,t){var r=s.byId(this.getCard()),i=s.byId(this.getHost());if(i&&i.modifyRequestHeaders){return i.modifyRequestHeaders(Object.assign({},e),t,r)}return e};a.prototype.getDetails=function(){return"Backend interaction - load data from URL: "+this.getSettings().request.url};return a});
//# sourceMappingURL=RequestDataProvider.js.map