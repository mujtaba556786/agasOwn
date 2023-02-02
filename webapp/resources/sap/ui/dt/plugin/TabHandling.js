/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/Plugin","sap/ui/dt/Overlay","sap/ui/dt/OverlayRegistry"],function(t,e,i){"use strict";var a=t.extend("sap.ui.dt.plugin.TabHandling",{metadata:{library:"sap.ui.dt",properties:{},associations:{},events:{}}});a.prototype.registerElementOverlay=function(t){if(t.isRoot()){this.removeTabIndex()}};a.prototype.deregisterElementOverlay=function(t){if(t.isRoot()){this.restoreTabIndex()}};a.prototype.setDesignTime=function(i){t.prototype.setDesignTime.apply(this,arguments);if(i){if(!this._oMutationObserver){this._oMutationObserver=e.getMutationObserver();this._oMutationObserver.attachDomChanged(this._onDomChanged,this)}}else{if(this._oMutationObserver){this._oMutationObserver.detachDomChanged(this._onDomChanged,this);delete this._oMutationObserver}this.restoreTabIndex()}};a.prototype.removeTabIndex=function(){var t=this._getRootOverlays();t.forEach(function(t){var e=t.getAssociatedDomRef();if(e){e.find(":focusable:not([tabIndex=-1], #overlay-container *)").each(function(t,e){e.setAttribute("data-sap-ui-dt-tabindex",e.tabIndex);e.setAttribute("tabindex",-1)})}})};a.prototype.removeOverlayTabIndex=function(){var t=this._getRootOverlays();t.forEach(function(t){var e=t.getDomRef();if(e){e.querySelectorAll("[tabindex]:not([tabindex='-1'])").forEach(function(t){t.setAttribute("data-sap-ui-overlay-tabindex",t.tabIndex);t.setAttribute("tabindex",-1)})}})};a.prototype._getRootOverlays=function(){var t=this.getDesignTime();var e=t.getRootElements();return e.map(function(t){return i.getOverlay(t)})};a.prototype.restoreTabIndex=function(){document.querySelectorAll("[data-sap-ui-dt-tabindex]").forEach(function(t){t.setAttribute("tabindex",t.getAttribute("data-sap-ui-dt-tabindex"));t.removeAttribute("data-sap-ui-dt-tabindex")})};a.prototype.restoreOverlayTabIndex=function(){document.querySelectorAll("[data-sap-ui-overlay-tabindex]").forEach(function(t){t.setAttribute("tabindex",t.getAttribute("data-sap-ui-overlay-tabindex"));t.removeAttribute("data-sap-ui-overlay-tabindex")})};a.prototype._onDomChanged=function(){if(this.getDesignTime().getEnabled()){this.removeTabIndex()}};return a});
//# sourceMappingURL=TabHandling.js.map