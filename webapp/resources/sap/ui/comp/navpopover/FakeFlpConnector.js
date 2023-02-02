/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./Factory"],function(jQuery,e){"use strict";function t(){}t.enableFakeConnector=function(r){if(t.getServiceReal){return}t.getServiceReal=e.getService;e.getService=t._createFakeService(r)};t._createFakeService=function(e){return function(r){switch(r){case"CrossApplicationNavigation":return{hrefForExternal:function(e){if(!e||!e.target||!e.target.shellHash){return null}return e.target.shellHash},getDistinctSemanticObjects:function(){var t=[];for(var r in e){t.push(r)}var n=jQuery.Deferred();setTimeout(function(){n.resolve(t)},0);return n.promise()},getLinks:function(t){var r=[];if(!Array.isArray(t)){e[t.semanticObject]?r=e[t.semanticObject].links:r=[]}else{t.forEach(function(t){e[t[0].semanticObject]?r.push([e[t[0].semanticObject].links]):r.push([[]])})}var n=jQuery.Deferred();setTimeout(function(){n.resolve(r)},0);return n.promise()}};case"URLParsing":return{parseShellHash:function(t){var r=function(e){var r=e.filter(function(e){return e.intent===t});return r[0]};for(var n in e){var i=r(e[n].links);if(i){return{semanticObject:n,action:i.action}}}return{semanticObject:null,action:null}}};default:return t.getServiceReal(r)}}};t.disableFakeConnector=function(){if(t.getServiceReal){e.getService=t.getServiceReal;t.getServiceReal=undefined}};return t},true);
//# sourceMappingURL=FakeFlpConnector.js.map