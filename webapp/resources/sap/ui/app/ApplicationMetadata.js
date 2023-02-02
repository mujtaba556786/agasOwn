/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/ComponentMetadata","jquery.sap.sjax"],function(t,e,jQuery){"use strict";var a=function(t,a){e.apply(this,arguments)};a.prototype=Object.create(e.prototype);a.prototype.constructor=a;a.preprocessClassInfo=function(t){if(t&&typeof t.metadata==="string"){t.metadata={_src:t.metadata}}return t};a.prototype.applySettings=function(a){var o=a.metadata;e.prototype.applySettings.call(this,a);if(o._src){t.warning("The metadata of the application "+this.getName()+" is loaded from file "+o._src+". This is a design time feature and not for productive usage!");var r=this.getName().replace(/\.\w+?$/,"");var s=sap.ui.require.toUrl(r.replace(/\./g,"/")+"/"+o._src);var n=jQuery.sap.syncGetJSON(s);if(n.success){Object.assign(o,n.data)}else{t.error('Failed to load application metadata from "'+o._src+'"! Reason: '+n.error)}}this._mRootComponent=o.rootComponent||null};a.prototype.getRootComponent=function(){return this._mRootComponent};return a},true);
//# sourceMappingURL=ApplicationMetadata.js.map