/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/library","sap/ui/base/Object"],function(e,t){"use strict";var r=e.CardDataMode;var s=t.extend("sap.ui.integration.util.CardObserver",{constructor:function(e){t.call(this);this._oCard=e;this._oObservedDomRef=null}});s.prototype.destroy=function(){t.prototype.destroy.apply(this,arguments);this._oCard=null;if(this._oObserver){this._oObserver.disconnect();this._oObserver=null}};s.prototype._createObserver=function(){if(!this._oObserver){this._oObserver=new window.IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){this.loadManifest()}}.bind(this),{threshold:[.1]})}.bind(this))}};s.prototype.observe=function(e){if(!this._oObserver){this._createObserver()}if(e!==this._oObservedDomRef){if(this._oObservedDomRef){this._oObserver.unobserve(this._oObservedDomRef)}this._oObserver.observe(e);this._oObservedDomRef=e}};s.prototype.unobserve=function(e){if(this._oObserver&&this._oObservedDomRef===e){this._oObserver.unobserve(e);this._oObservedDomRef=null}};s.prototype.loadManifest=function(){var e=this._oCard.getDomRef();this._oCard.setDataMode(r.Active);this.unobserve(e)};return s});
//# sourceMappingURL=CardObserver.js.map