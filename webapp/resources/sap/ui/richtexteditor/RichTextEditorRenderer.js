/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Core"],function(e){"use strict";var t={apiVersion:2};t.render=function(t,i){var r=i.getAggregation("_toolbarWrapper");var s=r&&i._bCustomToolbarRequirementsFullfiled;var a=e.getLibraryResourceBundle("sap.ui.richtexteditor");t.openStart("div",i);t.class("sapUiRTE");if(i.getRequired()){t.class("sapUiRTEReq")}if(i.getUseLegacyTheme()){t.class("sapUiRTELegacyTheme")}if(s){t.class("sapUiRTEWithCustomToolbar")}t.style("width",i.getWidth());t.style("height",i.getHeight()||"200px");if(i.getTooltip_AsString()){t.attr("title",i.getTooltip_AsString())}t.accessibilityState(i,{role:"region",label:a.getText("RTE_ARIA_LABEL"),labelledby:null});t.openEnd();if(s){t.renderControl(r)}var o="render"+i.getEditorType()+"Editor";if(this[o]&&typeof this[o]==="function"){this[o].call(this,t,i)}t.close("div")};return t},true);
//# sourceMappingURL=RichTextEditorRenderer.js.map