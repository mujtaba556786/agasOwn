/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Configuration","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/Device","./PanelRenderer","sap/m/Button"],function(e,t,a,n,o,i,r){"use strict";var p=e.PanelAccessibleRole;var s=e.BackgroundDesign;var l=e.ButtonType;var d=a.extend("sap.m.Panel",{metadata:{library:"sap.m",properties:{headerText:{type:"string",group:"Data",defaultValue:""},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},expandable:{type:"boolean",group:"Appearance",defaultValue:false},expanded:{type:"boolean",group:"Appearance",defaultValue:false},expandAnimation:{type:"boolean",group:"Behavior",defaultValue:true},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:s.Translucent},accessibleRole:{type:"sap.m.PanelAccessibleRole",group:"Accessibility",defaultValue:p.Form}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},headerToolbar:{type:"sap.m.Toolbar",multiple:false},infoToolbar:{type:"sap.m.Toolbar",multiple:false}},events:{expand:{parameters:{expand:{type:"boolean"},triggeredByInteraction:{type:"boolean"}}}},dnd:{draggable:true,droppable:true},designtime:"sap/m/designtime/Panel.designtime"},renderer:i});d.prototype.init=function(){this._bInteractiveExpand=false;this.data("sap-ui-fastnavgroup","true",true)};d.prototype.onThemeChanged=function(){this._setContentHeight()};d.prototype.setExpanded=function(e){var t=this;if(e===this.getExpanded()){return this}this.setProperty("expanded",e,true);if(!this.getExpandable()){return this}this._toggleExpandCollapse(function(){t.invalidate()});this._toggleButtonIcon(e);this.fireExpand({expand:e,triggeredByInteraction:this._bInteractiveExpand});this._bInteractiveExpand=false;return this};d.prototype.onBeforeRendering=function(){if(this.getExpandable()&&!this._oExpandButton){this._oExpandButton=this._createExpandButton()}if(t.getAccessibility()){this.$().attr("role",this.getAccessibleRole().toLowerCase())}};d.prototype.onAfterRendering=function(){var e=this.$(),t=this.getDomRef("content"),a,n=this.getDomRef();if(n){n.style.width=this.getWidth();a=this.getHeight();n.style.height=a;if(parseFloat(a)!=0){n.querySelector(".sapMPanelContent").style.height=a}}this._setContentHeight();if(this.getExpandable()){this.getHeaderToolbar()&&t&&this._oExpandButton.$().attr("aria-controls",t.id);if(!this.getExpanded()){e.children(".sapMPanelExpandablePart").css("display","none")}}};d.prototype.ontap=function(e){var t=this.getDomRef(),a=t&&t.querySelector(".sapMPanelWrappingDiv");if(!this.getExpandable()||this.getHeaderToolbar()||!a){return}if(a.contains(e.target)){this._bInteractiveExpand=true;this.setExpanded(!this.getExpanded())}};d.prototype.onsapspace=function(e){var t=[this.getDomRef().querySelector(".sapMPanelWrappingDiv"),this.getDomRef("expandButton")];if(t.includes(e.target)){e.preventDefault()}this.ontap(e)};d.prototype.onsapenter=function(e){this.ontap(e)};d.prototype.exit=function(){if(this._oExpandButton){this._oExpandButton.destroy();this._oExpandButton=null}};d.prototype._createExpandButton=function(){var e=this,t=this.getExpanded()?n.getIconURI("slim-arrow-down"):n.getIconURI("slim-arrow-right"),a=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("PANEL_ICON"),o;if(!this.getHeaderToolbar()){return n.createControlByURI({src:t,tooltip:a})}o=new r(this.getId()+"-expandButton",{icon:t,tooltip:a,type:l.Transparent,press:function(){e._bInteractiveExpand=true;e.setExpanded(!e.getExpanded())}}).addEventDelegate({onAfterRendering:function(){o.$().attr("aria-expanded",this.getExpanded())}.bind(this)},this);this.addDependent(o);return o};d.prototype._toggleButtonIcon=function(e){var t=e?n.getIconURI("slim-arrow-down"):n.getIconURI("slim-arrow-right");if(!this._oExpandButton){return}if(this.getHeaderToolbar()){this._oExpandButton.setIcon(t)}else{this._oExpandButton.setSrc(t)}};d.prototype._setContentHeight=function(){var e,t=this.getDomRef(),a=t&&t.querySelector(".sapMPanelContent");if(this.getHeight()==="auto"||!a){return}e="calc("+"100%"+" - "+a.offsetTop+"px)";a.style.height=e};d.prototype._toggleExpandCollapse=function(e){var t={complete:e};if(!this.getExpandAnimation()){t.duration=0}this.$().children(".sapMPanelExpandablePart").slideToggle(t)};d.prototype._getLabellingElementId=function(){var e=this.getHeaderToolbar(),t=this.getHeaderText(),a=null;if(e){a=e.getTitleId()}else if(t){a=this.getId()+"-header"}return a};return d});
//# sourceMappingURL=Panel.js.map