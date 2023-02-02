/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./AccordionSection","sap/ui/core/Configuration"],function(e,t){"use strict";var i={};i.render=function(e,r){e.write("<div");e.writeControlData(r);if(t.getAccessibility()){e.writeAttribute("role","tablist")}e.addClass("sapUiAcd");e.addStyle("width",r.getWidth());e.writeClasses();e.writeStyles();e.write(">");e.write("<div id='"+r.getId()+"-dropTarget"+"' style='width:"+r.getWidth()+"' tabindex='-1' class='sapUiAcd-droptarget'></div>");var a=r.getSections();var d=r.getOpenedSectionsId().split(",");for(var s=0;s<a.length;s++){if(r.bInitialRendering){if(d.indexOf(a[s].getId())!=-1){a[s]._setCollapsed(false)}else{a[s]._setCollapsed(true)}}i.renderSection(e,a[s])}e.write('<span id="'+r.getId()+'-Descr" style="visibility: hidden; display: none;">');e.write(r.rb.getText("ACCORDION_DSC"));e.write("</span>");e.write("</div>");r.bInitialRendering=false};i.renderSection=function(i,r){var a=t.getAccessibility();var d=e._isSizeSet(r.getMaxHeight());var s=e._isSizeSet(r.getParent().getWidth());i.write("<div");i.writeElementData(r);i.addClass("sapUiAcdSection");if(r.getParent().isLastSection(r)){i.addClass("sapUiAcdSectionLast")}i.addStyle("width",r.getParent().getWidth());if(!r.getCollapsed()){i.addStyle("height",r.getMaxHeight())}else{i.addClass("sapUiAcdSectionColl")}i.addClass("sapUiAcdSectionArea");if(!d){i.addClass("sapUiAcdSectionFlexHeight")}if(!r.getEnabled()){i.addClass("sapUiAcdSectionDis")}i.writeClasses();i.writeStyles();i.write("><div class='sapUiAcdSectionHdr'");if(r.getEnabled()){i.write(" tabindex='0'")}i.writeAttribute("id",r.getId()+"-hdr");if(a){i.writeAttribute("role","tab");i.writeAttribute("aria-labelledby",r.getId()+"-lbl");i.writeAttribute("aria-describedby",r.getParent().getId()+"-Descr");if(r.getEnabled()){if(r.getCollapsed()){i.writeAttribute("aria-expanded","false")}else{i.writeAttribute("aria-expanded","true")}}}i.write(">");i.write("<div ");i.writeAttribute("id",r.getId()+"-trgt");i.write(">");i.write("<span id='"+r.getId()+"-hdrL'>");if(r.getEnabled()){i.write("<a id='"+r.getId()+"-minL' class='sapUiAcdSectionMinArrow' href='# title='Collapse/Expand'")}else{i.write("<a id='"+r.getId()+"-minL' class='sapUiAcdSectionMinArrow sapUiAcdCursorText' href='#' title='Collapse/Expand'")}i.write(" tabindex='-1' ");if(a){i.writeAttribute("aria-labelledby",r.getId()+"-lbl");if(r.getCollapsed()){i.writeAttribute("aria-selected","false")}else{i.writeAttribute("aria-selected","true")}if(r.getEnabled()){i.writeAttribute("aria-disabled","false");i.writeAttribute("aria-grabbed","false")}else{i.writeAttribute("aria-disabled","true");i.writeAttribute("aria-grabbed","")}}i.write("></a>");i.write("<span tabindex='-1' id='"+r.getId()+"-lbl' class='sapUiAcdSectionLabel'");if(r.getCollapsed()){i.writeAttribute("aria-selected","false");i.addStyle("font-weight","normal");i.writeStyles()}else{i.writeAttribute("aria-selected","true");i.addStyle("font-weight","bold");i.writeStyles()}if(a){i.writeAttribute("role","heading");if(r.getEnabled()){i.writeAttribute("aria-disabled","false")}else{i.writeAttribute("aria-disabled","true")}}i.write(">");i.writeEscaped(r.getTitle());i.write("</span>");i.write("</span>");i.write("</div></div>");if(!r.getCollapsed()){i.write("<div class='sapUiAcdSectionCont' tabindex='-1' id='"+r.getId()+"-cont'");if(d&&s){i.write(" style='position:absolute;'")}else{i.write(" style='position:relative;top:0px;'")}if(t.getAccessibility()){i.writeAttribute("role","tabpanel")}i.write(">");var l=r.getContent(),n=l.length;for(var w=0;w<n;w++){i.renderControl(l[w])}i.write("</div>")}i.write("</div>")};return i},true);
//# sourceMappingURL=AccordionRenderer.js.map