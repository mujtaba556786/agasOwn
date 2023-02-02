/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/util/ResponsivePaddingsEnablement","./TabContainerRenderer","./TabStrip","./TabStripItem","./Button","sap/ui/Device"],function(t,e,i,o,r,n,a,s,p){"use strict";var d=t.ButtonType;var u=t.PageBackgroundDesign;var g=e.extend("sap.m.TabContainer",{metadata:{library:"sap.m",properties:{showAddNewButton:{type:"boolean",group:"Misc",defaultValue:false},backgroundDesign:{type:"sap.m.PageBackgroundDesign",group:"Appearance",defaultValue:u.List}},aggregations:{items:{type:"sap.m.TabContainerItem",multiple:true,singularName:"item",bindable:"bindable"},_addNewButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_tabStrip:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.m.TabContainerItem",multiple:false}},events:{itemClose:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabContainerItem"}}},itemSelect:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabContainerItem"}}},addNewButtonPress:{}},designtime:"sap/m/designtime/TabContainer.designtime",dnd:{draggable:false,droppable:true}},constructor:function(t,i){var o=[];if(!i&&typeof t==="object"){i=t}if(i&&Array.isArray(i["items"])){o=i["items"];delete i["items"]}e.prototype.constructor.apply(this,arguments);var r=new n(this.getId()+"--tabstrip",{hasSelect:true,itemSelect:function(t){var e=t.getParameter("item"),i=this._fromTabStripItem(e);this.setSelectedItem(i,t)}.bind(this),itemClose:function(t){var e=t.getParameter("item"),i=this._fromTabStripItem(e);t.preventDefault();if(this.fireItemClose({item:i})){if(!this.getBinding("items")){this.removeItem(i)}}}.bind(this)});this.setAggregation("_tabStrip",r,true);if(i&&i["showAddNewButton"]){this.setShowAddNewButton(true)}o.forEach(function(t){this.addItem(t)},this);this.data("sap-ui-fastnavgroup","true",true)},renderer:r});var m={name:"text",additionalText:"additionalText",icon:"icon",iconTooltip:"iconTooltip",modified:"modified"};o.call(g.prototype,{header:{selector:".sapMTabStripContainer"}});g.prototype.init=function(){this._initResponsivePaddingsEnablement()};g.prototype.onBeforeRendering=function(){if(this.getSelectedItem()){return}this._setDefaultTab()};g.prototype._getAddNewTabButton=function(){var t=this.getAggregation("_addNewButton");var e=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(!t){t=new s({type:d.Transparent,tooltip:e.getText("TABCONTAINER_ADD_NEW_TAB"),icon:i.getIconURI("add"),press:function(){this.getParent().getParent().fireAddNewButtonPress()}});t.addStyleClass("sapMTSAddNewTabBtn");this.setAggregation("_addNewButton",t,true)}return t};g.prototype._getTabStrip=function(){return this.getAggregation("_tabStrip")};g.prototype._fromTabStripItem=function(t){var e=this.getItems()||[],i=e.length,o=0;for(;o<i;o++){if(e[o].getId()===t.getKey()){return e[o]}}return null};g.prototype._toTabStripItem=function(t){var e=0,i=t,o,r,n=this._getTabStrip();if(!n){return null}o=n.getItems();r=o.length;if(typeof t==="object"){i=t.getId()}for(;e<r;e++){if(o[e].getKey()===i){return o[e]}}return null};g.prototype._getSelectedItemContent=function(){var t=this._getTabStrip(),e=this.getSelectedItem(),i=sap.ui.getCore().byId(e),o=this._toTabStripItem(i);if(t){t.setSelectedItem(o)}return i?i.getContent():null};g.prototype._moveToNextItem=function(t){if(!this._getTabStrip()._oItemNavigation){return}var e=this.getItems().length,i=this._getTabStrip()._oItemNavigation.getFocusedIndex(),o=e===i?--i:i,r=this.getItems()[o],n=function(){if(this._getTabStrip()._oItemNavigation){this._getTabStrip()._oItemNavigation.focusItem(o)}},a=document.activeElement.classList;if(t){this.setSelectedItem(r);this.fireItemSelect({item:r})}if(a.contains("sapMTabStripSelectListItemCloseBtn")||a.contains("sapMTabStripItem")){setTimeout(n.bind(this),0)}};g.prototype._attachItemPropertyChanged=function(t){t.attachItemPropertyChanged(function(t){var e=t["mParameters"].propertyKey;if(m[e]){e=m[e];var i=this._toTabStripItem(t.getSource());var o="set"+e.substr(0,1).toUpperCase()+e.substr(1);i&&i[o](t["mParameters"].propertyValue)}}.bind(this))};g.prototype.removeItem=function(t){var e=this._getTabStrip(),i,o;if(typeof t==="undefined"||t===null){return null}t=this.removeAggregation("items",t);i=t.getId()===this.getSelectedItem();o=this._toTabStripItem(t);if(o.getId()===e.getSelectedItem()){e.removeAllAssociation("selectedItem",true)}e.removeItem(o);this._moveToNextItem(i);return t};g.prototype.addAggregation=function(t,i,o){if(t==="items"){this._attachItemPropertyChanged(i)}return e.prototype.addAggregation.call(this,t,i,o)};g.prototype.insertAggregation=function(t,i,o,r){if(t==="items"){this._attachItemPropertyChanged(i)}return e.prototype.insertAggregation.call(this,t,i,o,r)};g.prototype.addItem=function(t){this.addAggregation("items",t,false);this._getTabStrip().addItem(new a({key:t.getId(),text:t.getName(),additionalText:t.getAdditionalText(),icon:t.getIcon(),iconTooltip:t.getIconTooltip(),modified:t.getModified(),tooltip:t.getTooltip(),customData:t.getCustomData()}));return this};g.prototype.destroyItems=function(){this._getTabStrip().destroyItems();this.setAssociation("selectedItem",null);return this.destroyAggregation("items")};g.prototype.insertItem=function(t,e){this._getTabStrip().insertItem(new a({key:t.getId(),text:t.getName(),additionalText:t.getAdditionalText(),icon:t.getIcon(),iconTooltip:t.getIconTooltip(),modified:t.getModified(),tooltip:t.getTooltip(),customData:t.getCustomData()}),e);return this.insertAggregation("items",t,e)};g.prototype.removeAllItems=function(){this._getTabStrip().removeAllItems();this.setSelectedItem(null);return this.removeAllAggregation("items")};g.prototype.setAddButton=function(t){return this._getTabStrip().setAddButton(t)};g.prototype.getAddButton=function(){return this._getTabStrip().getAddButton()};g.prototype.setShowAddNewButton=function(t){this.setProperty("showAddNewButton",t,true);if(p.system.phone){t?this.addStyleClass("sapUiShowAddNewButton"):this.removeStyleClass("sapUiShowAddNewButton")}var e=this._getTabStrip();if(e){e.setAddButton(t?this._getAddNewTabButton():null)}return this};g.prototype.setSelectedItem=function(t,e){if(this.fireItemSelect({item:t})){var i=this._getTabStrip();if(t&&i){i.setSelectedItem(this._toTabStripItem(t));this._rerenderContent(t.getContent())}this.setAssociation("selectedItem",t,true);return this}if(e){e.preventDefault()}return this};g.prototype._rerenderContent=function(t){var e=this.$("content"),i;if(!t||e.length<=0){return}i=sap.ui.getCore().createRenderManager();for(var o=0;o<t.length;o++){i.renderControl(t[o])}i.flush(e[0]);i.destroy()};g.prototype._setDefaultTab=function(){var t=this.getItems()[0]||null;this.setSelectedItem(t);return t};return g});
//# sourceMappingURL=TabContainer.js.map