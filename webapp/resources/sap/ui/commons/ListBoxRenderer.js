/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/security/encodeXML","sap/ui/core/Renderer","sap/ui/core/IconPool"],function(jQuery,e,t,i){"use strict";var a={};a.render=function(e,t){if(a.borderWidths===undefined){a.borderWidths=0}e.addClass("sapUiLbx");var i=true;if(!t.getEditable()){e.addClass("sapUiLbxRo");i=false}if(!t.getEnabled()){e.addClass("sapUiLbxDis");i=false}if(i){e.addClass("sapUiLbxStd")}e.write("<div");e.writeControlData(t);e.writeAttribute("tabindex","-1");var s=t.getWidth();if(s){e.addStyle("width",s);var r=t.getDisplaySecondaryValues();var l=t.getDisplayIcons();if(!r&&!l){e.addClass("sapUiLbxFixed")}}if(!s||s=="auto"||s=="inherit"){e.addClass("sapUiLbxFlexWidth")}e.writeClasses();var d=t.getMinWidth();var n=t.getMaxWidth();if(d){e.addStyle("min-width",d)}if(n){e.addStyle("max-width",n)}if(t._bHeightInItems){if(t._sTotalHeight!=null){e.addStyle("height",t._sTotalHeight)}}else{var o=t.getHeight();if(o){e.addStyle("height",o)}}e.writeStyles();var g=t.getTooltip_AsString();if(g){e.writeAttributeEscaped("title",g)}e.write(">");this.renderItemList(t,e);e.write("</div>")};a.renderItemList=function(t,s){s.write("<ul id='"+t.getId()+"-list'");s.writeAttribute("tabindex",this.getTabIndex(t));s.writeAccessibilityState(t,{role:"listbox",multiselectable:t.getAllowMultiSelect()});s.write(">");var r=t.getItems(),l=0,d=0;var n;for(n=0;n<r.length;n++){if(!(r[n]instanceof sap.ui.core.SeparatorItem)){d++}}var o=t.getDisplaySecondaryValues();for(n=0;n<r.length;n++){var g=r[n];if(g instanceof sap.ui.core.SeparatorItem){s.write("<div id='",g.getId(),"' class='sapUiLbxSep' role='separator'><hr>");if(t.getDisplayIcons()){s.write("<hr>")}if(o){s.write("<hr>")}s.write("</div>")}else{s.write("<li");s.writeElementData(g);s.writeAttribute("data-sap-ui-lbx-index",n);s.addClass("sapUiLbxI");if(!g.getEnabled()){s.addClass("sapUiLbxIDis")}s.writeAttribute("tabindex","-1");if(t.isIndexSelected(n)){s.addClass("sapUiLbxISel")}s.writeClasses();var c=g.getText();var p=g.getAdditionalText?g.getAdditionalText():"";if(g.getTooltip_AsString()){s.writeAttributeEscaped("title",g.getTooltip_AsString())}else{s.writeAttributeEscaped("title",c+(o&&p?"  --  "+p:""))}s.writeAccessibilityState(g,{role:"option",selected:n===t.getSelectedIndex(),setsize:d,posinset:l+1});s.write(">");if(t.getDisplayIcons()){var f;if(g.getIcon){f=g.getIcon()}s.write("<span");if(i.isIconURI(f)){s.addClass("sapUiLbxIIco");s.addClass("sapUiLbxIIcoFont");var w=i.getIconInfo(f);s.addStyle("font-family","'"+e(w.fontFamily)+"'");if(w&&!w.skipMirroring){s.addClass("sapUiIconMirrorInRTL")}s.writeClasses();s.writeStyles();s.write(">");s.writeEscaped(w.content)}else{s.write(" class='sapUiLbxIIco'><img src='");if(f){s.writeEscaped(f)}else{s.write(sap.ui.resource("sap.ui.commons","img/1x1.gif"))}s.write("'>")}s.write("</span>")}s.write("<span class='sapUiLbxITxt");s.write("'");s.writeAttribute("id",g.getId()+"-txt");var u=a.getTextAlign(t.getValueTextAlign(),null);if(u){s.write("style='text-align:"+u+"'")}s.write(">");if(c===""||c===null){s.write("&nbsp;")}else{s.writeEscaped(c)}if(o){s.write("</span><span class='sapUiLbxISec");s.write("'");var x=a.getTextAlign(t.getSecondaryValueTextAlign(),null);if(x){s.write("style='text-align:"+x+"'")}s.write(">");s.writeEscaped(p)}s.write("</span></li>");l++}}s.write("</ul>")};a.fixWidth=function(e){if(a.borderWidths>0){if(/px$/i.test(e)){var t=parseInt(e.substr(0,e.length-2));var i=t-a.borderWidths;if(i>=0){return i+"px"}}}return e};a.getTabIndex=function(e){if(e.getEnabled()&&e.getEditable()){return 0}else{return-1}};a.handleSelectionChanged=function(e){if(e.getDomRef()){var t=e.getItems();for(var i=0,a=t.length;i<a;i++){if(e.isIndexSelected(i)){t[i].$().addClass("sapUiLbxISel").attr("aria-selected","true")}else{t[i].$().removeClass("sapUiLbxISel").attr("aria-selected","false")}}}};a.handleARIAActivedescendant=function(e,t){var i=e.$("list");if(i.length>0){var a=i.children("li[data-sap-ui-lbx-index="+t+"]");i.attr("aria-activedescendant",a.attr("id"))}};a.getTextAlign=t.getTextAlign;return a},true);
//# sourceMappingURL=ListBoxRenderer.js.map