/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/Renderer","sap/ui/core/AccessKeysEnablement","sap/m/library","sap/ui/core/library","sap/m/HyphenationSupport","sap/ui/core/LabelEnablement"],function(e,t,a,i,s,l,r){"use strict";var n=s.TextDirection;var o=s.VerticalAlign;var p=i.LabelDesign;var c={apiVersion:2};c.render=function(t,i){var s=c,g=i.getTextDirection(),d=i.getTextAlign(),b=i.getWidth(),f=i.getText(),L=i.getTooltip_AsString(),u=i.getLabelForRendering(),y=u?"label":"span",x=i.isDisplayOnly(),h=i.getVAlign();t.openStart(y,i);t.class("sapMLabel");t.class("sapUiSelectable");if(i.isWrapping()){t.class("sapMLabelWrapped")}if(i.getDesign()==p.Bold){t.style("font-weight","bold")}if(i.isRequired()){t.class("sapMLabelRequired")}if(i.getShowColon()){t.class("sapMLabelShowColon")}if(u){r.writeLabelForAttribute(t,i)}else if(i.getParent()&&i.getParent().isA("sap.m.Toolbar")){t.class("sapMLabelTBHeader")}if(g!==n.Inherit){t.attr("dir",g.toLowerCase())}if(b){t.style("width",b)}else{t.class("sapMLabelMaxWidth")}if(d){d=s.getTextAlign(d,g);if(d){t.style("text-align",d)}}if(f==""){t.class("sapMLabelNoText")}if(x){t.class("sapMLabelDisplayOnly")}if(h!=o.Inherit){t.style("vertical-align",h.toLowerCase())}l.writeHyphenationClass(t,i);if(L){t.attr("title",L)}t.openEnd();t.openStart("span",i.getId()+"-text");t.class("sapMLabelTextWrapper");if(i.getProperty("highlightAccKeysRef")){t.class(a.CSS_CLASS)}t.openEnd();t.openStart("bdi",i.getId()+"-bdi");if(g!==n.Inherit){t.attr("dir",g.toLowerCase())}t.openEnd();if(f){f=l.getTextForRender(i,"main");t.text(f)}t.close("bdi");t.close("span");t.openStart("span");t.class("sapMLabelColonAndRequired");t.attr("data-colon",e.getLibraryResourceBundle("sap.m").getText("LABEL_COLON"));if(u||i._isInColumnHeaderContext){t.accessibilityState({hidden:"true"})}t.openEnd();t.close("span");t.close(y)};c.getTextAlign=t.getTextAlign;return c},true);
//# sourceMappingURL=LabelRenderer.js.map