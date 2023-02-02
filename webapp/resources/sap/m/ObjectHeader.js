/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/library","sap/ui/core/util/ResponsivePaddingsEnablement","sap/ui/Device","sap/m/Text","sap/ui/events/KeyCodes","./ObjectHeaderRenderer","./ObjectMarker","./ObjectNumber","sap/ui/thirdparty/jquery","sap/ui/core/Configuration"],function(e,t,i,r,s,n,o,a,l,u,p,jQuery,g){"use strict";var d=e.BackgroundDesign;var h=r.TextAlign;var c=e.ImageHelper;var f=e.ObjectMarkerType;var m=r.TitleLevel;var y=r.TextDirection;var v=r.ValueState;var b=e.ObjectHeaderPictureShape;var _=t.extend("sap.m.ObjectHeader",{metadata:{library:"sap.m",designtime:"sap/m/designtime/ObjectHeader.designtime",properties:{title:{type:"string",group:"Misc",defaultValue:null},number:{type:"string",group:"Misc",defaultValue:null},numberUnit:{type:"string",group:"Misc",defaultValue:null},intro:{type:"string",group:"Misc",defaultValue:null},introActive:{type:"boolean",group:"Misc",defaultValue:null},titleActive:{type:"boolean",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconActive:{type:"boolean",group:"Misc",defaultValue:null},iconAlt:{type:"string",group:"Accessibility",defaultValue:null},iconTooltip:{type:"string",group:"Accessibility",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},imageShape:{type:"sap.m.ObjectHeaderPictureShape",group:"Appearance",defaultValue:b.Square},markFavorite:{type:"boolean",group:"Misc",defaultValue:false,deprecated:true},markFlagged:{type:"boolean",group:"Misc",defaultValue:false,deprecated:true},showMarkers:{type:"boolean",group:"Misc",defaultValue:false,deprecated:true},showTitleSelector:{type:"boolean",group:"Misc",defaultValue:false},numberState:{type:"sap.ui.core.ValueState",group:"Misc",defaultValue:v.None},condensed:{type:"boolean",group:"Appearance",defaultValue:false},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance"},responsive:{type:"boolean",group:"Behavior",defaultValue:false},fullScreenOptimized:{type:"boolean",group:"Appearance",defaultValue:false},titleHref:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},titleTarget:{type:"string",group:"Behavior",defaultValue:null},introHref:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},introTarget:{type:"string",group:"Behavior",defaultValue:null},titleTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:y.Inherit},introTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:y.Inherit},numberTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:y.Inherit},titleSelectorTooltip:{type:"string",group:"Misc",defaultValue:"Options"},titleLevel:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:m.H1}},defaultAggregation:"attributes",aggregations:{attributes:{type:"sap.m.ObjectAttribute",multiple:true,singularName:"attribute"},firstStatus:{type:"sap.m.ObjectStatus",multiple:false,deprecated:true},secondStatus:{type:"sap.m.ObjectStatus",multiple:false,deprecated:true},statuses:{type:"sap.ui.core.Control",multiple:true,singularName:"status"},_objectNumber:{type:"sap.m.ObjectNumber",multiple:false,visibility:"hidden"},additionalNumbers:{type:"sap.m.ObjectNumber",multiple:true,singularName:"additionalNumber"},headerContainer:{type:"sap.m.ObjectHeaderContainer",multiple:false},markers:{type:"sap.m.ObjectMarker",multiple:true,singularName:"marker"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{titlePress:{parameters:{domRef:{type:"object"}}},introPress:{parameters:{domRef:{type:"object"}}},iconPress:{parameters:{domRef:{type:"object"}}},titleSelectorPress:{parameters:{domRef:{type:"object"}}}},dnd:{draggable:false,droppable:true}},renderer:l});_._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.m")};s.call(_.prototype,{header:{selector:".sapMOH, .sapMOHR"}});_.prototype.init=function(){this._oTitleArrowIcon=i.createControlByURI({id:this.getId()+"-titleArrow",src:i.getIconURI("arrow-down"),decorative:false,visible:false,tooltip:_._getResourceBundle().getText("OH_SELECT_ARROW_TOOLTIP"),size:"1.375rem",press:function(e){}});this._fNumberWidth=undefined;this._titleText=new o(this.getId()+"-titleText");this._titleText.setMaxLines(3);this._initResponsivePaddingsEnablement()};_.prototype.insertAttribute=function(e,t){var i=this.insertAggregation("attributes",e,t);this._registerControlListener(e);return i};_.prototype.addAttribute=function(e){var t=this.addAggregation("attributes",e);this._registerControlListener(e);return t};_.prototype.removeAttribute=function(e){var t=this.removeAggregation("attributes",e);this._deregisterControlListener(t);return t};_.prototype.removeAllAttributes=function(){var e=this.removeAllAggregation("attributes");e.forEach(this._deregisterControlListener,this);return e};_.prototype.destroyAttributes=function(){var e=this.getAggregation("attributes");if(e!==null){e.forEach(this._deregisterControlListener,this)}return this.destroyAggregation("attributes")};_.prototype.insertStatus=function(e,t){var i=this.insertAggregation("statuses",e,t);this._registerControlListener(e);return i};_.prototype.addStatus=function(e){var t=this.addAggregation("statuses",e);this._registerControlListener(e);return t};_.prototype.removeStatus=function(e){var t=this.removeAggregation("statuses",e);this._deregisterControlListener(t);return t};_.prototype.removeAllStatuses=function(){var e=this.removeAllAggregation("statuses");e.forEach(this._deregisterControlListener,this);return e};_.prototype.destroyStatuses=function(){var e=this.getAggregation("statuses");if(e!==null){e.forEach(this._deregisterControlListener,this)}return this.destroyAggregation("statuses")};_.prototype._registerControlListener=function(e){if(e){e.attachEvent("_change",this.invalidate,this)}};_.prototype._deregisterControlListener=function(e){if(e){e.detachEvent("_change",this.invalidate,this)}};_.prototype.setCondensed=function(e){this.setProperty("condensed",e);if(this.getCondensed()){this._oTitleArrowIcon.setSize("1rem")}else{this._oTitleArrowIcon.setSize("1.375rem")}return this};_.prototype.setNumber=function(e){this.setProperty("number",e);this._getObjectNumber().setNumber(e);return this};_.prototype.setNumberUnit=function(e){this.setProperty("numberUnit",e);this._getObjectNumber().setUnit(e);return this};_.prototype.setNumberState=function(e){this.setProperty("numberState",e);this._getObjectNumber().setState(e);return this};_.prototype.setTitleSelectorTooltip=function(e){this.setProperty("titleSelectorTooltip",e);this._oTitleArrowIcon.setTooltip(e);return this};_.prototype.setMarkFavorite=function(e){return this._setOldMarkers(f.Favorite,e)};_.prototype.setMarkFlagged=function(e){return this._setOldMarkers(f.Flagged,e)};_.prototype.setShowMarkers=function(e){var t,i=this.getMarkers(),r;this.setProperty("showMarkers",e);for(r=0;r<i.length;r++){t=i[r].getType();if(t===f.Flagged&&this.getMarkFlagged()||t===f.Favorite&&this.getMarkFavorite()){i[r].setVisible(e)}}return this};_.prototype.setIconAlt=function(e){this.setProperty("iconAlt",e);this.invalidate();return this};_.prototype._setOldMarkers=function(e,t){var i=this.getMarkers(),r=false,s,n={Flagged:"-flag",Favorite:"-favorite"};this.setProperty("mark"+e,t,false);if(!this.getShowMarkers()){t=false}for(s=0;s<i.length;s++){if(i[s].getType()===e){r=true;i[s].setVisible(t);break}}if(!r){this.insertAggregation("markers",new u({id:this.getId()+n[e],type:e,visible:t}))}return this};_.prototype._getVisibleMarkers=function(){var e=this.getMarkers(),t=[],i;for(i=0;i<e.length;i++){if(e[i].getVisible()){t.push(e[i])}}return t};_.prototype._getObjectNumber=function(){var e=this.getAggregation("_objectNumber");if(!e){e=new p(this.getId()+"-number",{emphasized:false});this.setAggregation("_objectNumber",e,true)}return e};_.prototype.getFocusDomRef=function(){if(this.getResponsive()){return this.$("txt")[0]}else{return this.$("title")[0]}};_.prototype.ontap=function(e){var t=e.target.id;if(this.getIntroActive()&&t===this.getId()+"-intro"){if(!this.getIntroHref()){this.fireIntroPress({domRef:window.document.getElementById(t)})}}else if(!this.getResponsive()&&this.getTitleActive()&&(t===this.getId()+"-title"||jQuery(e.target).parent().attr("id")===this.getId()+"-title"||t===this.getId()+"-titleText-inner")){if(!this.getTitleHref()){e.preventDefault();t=this.getId()+"-title";this.fireTitlePress({domRef:window.document.getElementById(t)})}}else if(this.getResponsive()&&this.getTitleActive()&&(t===this.getId()+"-txt"||jQuery(e.target).parent().attr("id")===this.getId()+"-txt")){if(!this.getTitleHref()){e.preventDefault();t=this.getId()+"-txt";this.fireTitlePress({domRef:window.document.getElementById(t)})}}else if(e.target.classList.contains("sapUiIconTitle")){this.fireTitleSelectorPress({domRef:e.target.parentElement})}else if(t.indexOf(this.getId())!==-1){e.setMarked();e.preventDefault()}};_.prototype._handleSpaceOrEnter=function(e){var t=e.target.id;e.setMarked();if(!this.getResponsive()&&this.getTitleActive()&&(t===this.getId()+"-title"||jQuery(e.target).parent().attr("id")===this.getId()+"-title"||t===this.getId()+"-titleText-inner")){t=this.getId()+"-title";if(!this.getTitleHref()){e.preventDefault();this.fireTitlePress({domRef:t?window.document.getElementById(t):null})}else{if(e.type==="sapspace"){this._linkClick(e,t)}}}else if(this.getResponsive()&&this.getTitleActive()&&(t===this.getId()+"-txt"||jQuery(e.target).parent().attr("id")===this.getId()+"-txt")){t=this.getId()+"-txt";if(!this.getTitleHref()){e.preventDefault();this.fireTitlePress({domRef:t?window.document.getElementById(t):null})}else{if(e.type==="sapspace"){this._linkClick(e,t)}}}else if(this.getIntroActive()&&t===this.getId()+"-intro"){if(!this.getIntroHref()){this.fireIntroPress({domRef:t?window.document.getElementById(t):null})}}else if(t===this.getId()+"-titleArrow"){this.fireTitleSelectorPress({domRef:t?window.document.getElementById(t):null})}};_.prototype.onkeyup=function(e){if(e.which===a.SPACE){this._handleSpaceOrEnter(e)}};_.prototype.onsapenter=_.prototype._handleSpaceOrEnter;_.prototype._linkClick=function(e,t){e.setMarked();var i=document.createEvent("MouseEvents");i.initEvent("click",false,true);(t?window.document.getElementById(t):null).dispatchEvent(i)};_.prototype._onOrientationChange=function(){var e=this.getId();if(n.system.tablet&&this.getFullScreenOptimized()&&(this._hasAttributes()||this._hasStatus())){this._rerenderStates()}if(n.system.phone){if(n.orientation.portrait){if(this.getTitle().length>50){this._rerenderTitle(50)}if(this.getIcon()){jQuery(document.getElementById(e+"-titlediv")).removeClass("sapMOHRTitleIcon");jQuery(document.getElementById(e+"-titleIcon")).addClass("sapMOHRHideIcon")}}else{if(n.orientation.landscape){if(this.getTitle().length>80){this._rerenderTitle(80)}if(this.getIcon()){jQuery(document.getElementById(e+"-titlediv")).addClass("sapMOHRTitleIcon");jQuery(document.getElementById(e+"-titleIcon")).removeClass("sapMOHRHideIcon")}}}this._adjustNumberDiv()}this._adjustIntroDiv()};_.prototype._rerenderTitle=function(e){var t=sap.ui.getCore().createRenderManager();this.getRenderer()._rerenderTitle(t,this,e);t.destroy()};_.prototype._rerenderStates=function(){var e=sap.ui.getCore().createRenderManager();this.getRenderer()._rerenderResponsiveStates(e,this);e.destroy()};_.prototype.exit=function(){if(!n.system.phone){this._detachMediaContainerWidthChange(this._rerenderOHR,this,n.media.RANGESETS.SAP_STANDARD)}if(n.system.tablet||n.system.phone){n.orientation.detachHandler(this._onOrientationChange,this)}if(this._oImageControl){this._oImageControl.destroy();this._oImageControl=undefined}if(this._oTitleArrowIcon){this._oTitleArrowIcon.destroy();this._oTitleArrowIcon=undefined}if(this._titleText){this._titleText.destroy();this._titleText=undefined}if(this._introText){this._introText.destroy();this._introText=undefined}};_.prototype._getImageControl=function(){var e=this.getId()+"-img";var t="2.5rem";var r=jQuery.extend({src:this.getIcon(),tooltip:this.getIconTooltip(),alt:this.isPropertyInitial("iconAlt")?_._getResourceBundle().getText("OH_ARIA_ICON"):this.getIconAlt(),useIconTooltip:false,densityAware:this.getIconDensityAware(),decorative:false},i.isIconURI(this.getIcon())?{size:t}:{});if(this.getIconActive()){r.press=function(e){this.fireIconPress({domRef:e.getSource().getDomRef()})}.bind(this);r.decorative=false}this._oImageControl=c.getImageControl(e,this._oImageControl,this,r);return this._oImageControl};_.prototype.onBeforeRendering=function(){if(n.system.tablet||n.system.phone){n.orientation.detachHandler(this._onOrientationChange,this)}if(!n.system.phone){this._detachMediaContainerWidthChange(this._rerenderOHR,this,n.media.RANGESETS.SAP_STANDARD)}if(this._introText){this._introText.destroy();this._introText=undefined}};_.prototype.onAfterRendering=function(){var e=this.getAggregation("_objectNumber");var t=g.getRTL();var i=this.$("titleArrow");i.attr("role","button");if(this.getResponsive()){this._adjustIntroDiv();if(e&&e.getNumber()){if(n.system.desktop&&jQuery("html").hasClass("sapUiMedia-Std-Desktop")&&this.getFullScreenOptimized()&&this._iCountVisAttrStat>=1&&this._iCountVisAttrStat<=3){e.setTextAlign(t?h.Right:h.Left)}else{e.setTextAlign(t?h.Left:h.Right)}}this._adjustNumberDiv();if(n.system.tablet||n.system.phone){n.orientation.attachHandler(this._onOrientationChange,this)}if(!n.system.phone){this._attachMediaContainerWidthChange(this._rerenderOHR,this,n.media.RANGESETS.SAP_STANDARD)}}else{var r=t?h.Left:h.Right;if(e&&e.getNumber()){e.setTextAlign(r)}if(this.getAdditionalNumbers()){this._setTextAlignANum(r)}}};_.prototype._rerenderOHR=function(){this.invalidate()};_.prototype._adjustNumberDiv=function(){var e=this.getId();var t=this.getAggregation("_objectNumber");var i=g.getRTL();if(t&&t.getNumber()){var r=jQuery(document.getElementById(e+"-number"));var s=jQuery(document.getElementById(e+"-titlediv"));if(this._isMediaSize("Phone")){if(r.hasClass("sapMObjectNumberBelowTitle")){t.setTextAlign(i?h.Left:h.Right);r.removeClass("sapMObjectNumberBelowTitle");s.removeClass("sapMOHRTitleDivFull")}var n=r.parent().width()*.4;if(r.outerWidth()>n){t.setTextAlign(i?h.Right:h.Left);r.addClass("sapMObjectNumberBelowTitle");s.addClass("sapMOHRTitleDivFull")}}}};_.prototype._adjustIntroDiv=function(){var e=this.getId();var t=jQuery(document.getElementById(e+"-txt"));var i=jQuery(document.getElementById(e+"-titleArrow"));var r=jQuery(document.getElementById(e+"-intro"));if(r.parent().hasClass("sapMOHRIntroMargin")){r.parent().removeClass("sapMOHRIntroMargin")}if(i.height()!==null&&t.height()<i.height()){r.parent().addClass("sapMOHRIntroMargin")}};_._escapeId=function(e){return e?"#"+e.replace(/(:|\.)/g,"\\$1"):""};_.prototype._hasBottomContent=function(){return this._hasAttributes()||this._hasStatus()||this._hasMarkers()};_.prototype._hasIcon=function(){return!!this.getIcon().trim()};_.prototype._hasAttributes=function(){var e=this.getAttributes();if(e&&e.length>0){for(var t=0;t<e.length;t++){if(!e[t]._isEmpty()){return true}}}return false};_.prototype._hasStatus=function(){var e=this.getFirstStatus()&&!this.getFirstStatus()._isEmpty()||this.getSecondStatus()&&!this.getSecondStatus()._isEmpty();if(!e&&this.getStatuses()&&this.getStatuses().length>0){var t=this.getStatuses();for(var i=0;i<t.length;i++){if(t[i]&&t[i].isA("sap.m.ObjectStatus")&&!t[i]._isEmpty()){e=true;break}else if(t[i]&&t[i].isA("sap.m.ProgressIndicator")){e=true;break}}}return e};_.prototype._hasMarkers=function(){var e=this.getMarkers(),t=this.getShowMarkers()&&(this.getMarkFavorite()||this.getMarkFlagged()),i=e&&e.length;return t||i};_.prototype._getDefaultBackgroundDesign=function(){if(this.getCondensed()){return d.Solid}else{if(this.getResponsive()){return d.Translucent}else{return d.Transparent}}};_.prototype._getBackground=function(){if(this.getBackgroundDesign()===undefined){return this._getDefaultBackgroundDesign()}else{return this.getBackgroundDesign()}};_.prototype._setTextAlignANum=function(e){var t=this.getAdditionalNumbers();for(var i=0;i<t.length;i++){t[i].setTextAlign(e)}};_.prototype._isMediaSize=function(e){return this._getCurrentMediaContainerRange(n.media.RANGESETS.SAP_STANDARD).name===e};return _});
//# sourceMappingURL=ObjectHeader.js.map