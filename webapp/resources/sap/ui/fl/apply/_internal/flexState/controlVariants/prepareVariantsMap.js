/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/each","sap/base/util/includes","sap/base/util/isEmptyObject","sap/base/util/merge","sap/base/util/ObjectPath","sap/base/util/values","sap/base/Log","sap/ui/fl/apply/_internal/controlVariants/Utils","sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory","sap/ui/fl/apply/_internal/flexObjects/States","sap/ui/fl/LayerUtils","sap/ui/fl/registry/Settings"],function(e,n,t,a,r,i,s,c,o,u,f,g){"use strict";function l(e,n){var t=a({},e);n.forEach(function(e){t[e.fileName]={instance:o.createFromFileContent(e),controlChanges:[],variantChanges:{}}});return t}function v(e,n,t){var r=a({},e);n.forEach(function(e){var n=o.createFromFileContent(e);n.setState(u.LifecycleState.PERSISTED);var a=r[e.variantReference];a=a||x(e.variantReference,t);a.controlChanges.push(n);r[e.variantReference]=a});return r}function h(e,n,t){var r=a({},e);n.forEach(function(e){var n=r[e.selector.id];n=n||x(e.selector.id,t);var a=n.variantChanges[e.changeType]||[];a.push(e);n.variantChanges[e.changeType]=a;r[e.selector.id]=n});return r}function p(e){var n=a({},e);i(e).forEach(function(e){var t=r.get("variantChanges.setVisible",e);if(t&&t.length>0){var a=F(t);if(!a.getContent().visible&&a.getContent().createdByReset){delete n[e.instance.getId()]}}});return n}function C(e,n){var t=a({},e);i(t).forEach(function(e){var a=e.instance.getVariantReference();var r;if(a){r=b(t,a,e.instance.getVariantManagementReference(),n)}e.controlChanges=d(r,e.instance.getLayer()).concat(e.controlChanges)});return t}function d(e,n){if(!e){return[]}return i(a({},e.controlChanges)).filter(function(e){return f.compareAgainstCurrentLayer(e.getLayer(),n)===-1})}function b(e,n,t,a){var r=e[n];if(!r&&n===t){r=x(n,a);e[n]=r}return r}function m(e){var n=a({},e);i(n).forEach(function(e){var n=e.instance.getSupportInformation();if(!n.user){var t=g.getInstanceOrUndef()&&g.getInstanceOrUndef().getUserId();if(t){n.user=t;e.instance.setSupportInformation(n)}}});return n}function R(e,n){var t={};t=l(t,e.variants);t=v(t,e.variantDependentControlChanges,n);t=h(t,e.variantChanges,n);t=p(t);t=C(t,n);t=m(t);return t}function E(){return{variantManagementChanges:{},variants:[]}}function T(e,t,r){var s=a({},e);i(t).forEach(function(e){var t=e.instance.getVariantManagementReference();if(!s[t]){s[t]=E()}e=A(e);if(!s[t].currentVariant&&e.instance.getVisible()&&n(r,e.instance.getId())){s[t].currentVariant=e.instance.getId()}s[t].defaultVariant=t;var a=c.getIndexToSortVariant(s[t].variants,e);s[t].variants.splice(a,0,e)});return s}function V(e,n){var t=a({},e);n.forEach(function(e){var n=e.selector.id;if(!t[n]){t[n]=E()}var a=e.changeType;if(!t[n].variantManagementChanges[a]){t[n].variantManagementChanges[a]=[]}t[n].variantManagementChanges[a].push(e);t[n]=S(t[n])});return t}function y(n,t){var r=a({},n);e(r,function(e,n){var a=n.variants.findIndex(function(n){return n.instance.getId()===e});var r;if(a===-1){r=x(e,t)}else{r=n.variants[a];n.variants.splice(a,1)}n.variants.unshift(r)});return r}function I(e,n,t,a){var r={};r=T(r,e,t);r=V(r,n);r=y(r,a);return r}function x(e,n){var t=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");return{instance:o.createFlVariant({id:e,variantManagementReference:e,variantName:t.getText("STANDARD_VARIANT_TITLE"),user:c.DEFAULT_AUTHOR,reference:n}),variantChanges:{},controlChanges:[]}}function S(e){var n=a({},e);var r=n.variantManagementChanges;var i;if(!t(r)){i=F(r["setDefault"]);if(i){n.defaultVariant=i.getContent().defaultVariant}}return n}function A(n){var t=a({},n);var r=t.variantChanges;var i;e(r,function(e,n){switch(e){case"setTitle":i=F(n);if(i){t.instance.setName(i.getText("title"),true)}break;case"setFavorite":i=F(n);if(i){t.instance.setFavorite(i.getContent().favorite)}break;case"setExecuteOnSelect":i=F(n);if(i){t.instance.setExecuteOnSelection(i.getContent().executeOnSelect)}break;case"setVisible":i=F(n);if(i){t.instance.setVisible(i.getContent().visible)}break;case"setContexts":i=F(n);if(i){t.instance.setContexts(i.getContent().contexts)}break;default:s.error("No valid changes on variant "+t.content.content.title+" available")}});return t}function F(e){if(e.length>0){return o.createFromFileContent(e[e.length-1])}return false}return function(e){if(t(e)||!r.get("storageResponse.changes.variants",e)){return{}}var n=r.get(["technicalParameters",c.VARIANT_TECHNICAL_PARAMETER],e.componentData)||[];var a=R(e.storageResponse.changes,e.reference);a=I(a,e.storageResponse.changes.variantManagementChanges,n,e.reference);return a}});
//# sourceMappingURL=prepareVariantsMap.js.map