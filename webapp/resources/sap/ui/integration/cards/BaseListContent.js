/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/cards/BaseContent","sap/ui/integration/util/BindingResolver","sap/ui/integration/library","sap/base/Log","sap/ui/model/Sorter"],function(t,e,i,n,r){"use strict";var s=t.extend("sap.ui.integration.cards.BaseListContent",{metadata:{library:"sap.ui.integration"},renderer:{apiVersion:2}});s.prototype.init=function(){t.prototype.init.apply(this,arguments);this._oAwaitingPromise=null;this._fMinHeight=0;this._bIsFirstRendering=true};s.prototype.exit=function(){t.prototype.exit.apply(this,arguments);this._oAwaitingPromise=null};s.prototype.onAfterRendering=function(){if(!this._bIsFirstRendering){this._keepHeight()}this._bIsFirstRendering=false};s.prototype._keepHeight=function(){if(!this.getDomRef()){return}var t=this.getDomRef().getBoundingClientRect().height;if(t>this._fMinHeight){this._fMinHeight=t}if(this._fMinHeight){this.getDomRef().style.minHeight=this._fMinHeight+"px"}this._keepPlaceholderMinItems()};s.prototype._keepPlaceholderMinItems=function(){var t=this.getAggregation("_loadingPlaceholder"),e=!!this.getAggregation("_content"),i,n;if(!t||!t.getMinItems||!e){return}i=this.getInnerList().getItems().length;n=Math.max(t.getMinItems(),i);t.setMinItems(n)};s.prototype.setConfiguration=function(e){t.prototype.setConfiguration.apply(this,arguments);e=this.getConfiguration();if(!e){return this}var i=this.getInnerList(),n=this.getCard()?this.getCardInstance().hasPaginator():false,r=e.maxItems;if(!Number.isNaN(parseInt(r))){r=parseInt(r)}if(i&&r&&!n){i.applySettings({growing:true,growingThreshold:r});i.addStyleClass("sapFCardMaxItems")}this._fMinHeight=0;return this};s.prototype.getInnerList=function(){return null};s.prototype._checkHiddenNavigationItems=function(t){if(!t.actions){return}if(!this.getInnerList()){return}var i=this.getInnerList(),r=this.isA("sap.ui.integration.cards.TimelineContent")?i.getContent():i.getItems(),s=[],a=t.actions[0],o,g=0;if(!a||!a.service||a.type!=="Navigation"){return}if(a.service==="object"){o=a.service.name}else{o=a.service}r.forEach(function(t){var i=e.resolveValue(a.parameters,this,t.getBindingContext().getPath());s.push(this._oServiceManager.getService(o).then(function(t){if(!t.hidden){return false}return t.hidden({parameters:i})}).then(function(e){t.setVisible(!e);if(!e){g++}}).catch(function(t){n.error(t)}))}.bind(this));this.awaitEvent("_filterNavItemsReady");var h=this._oAwaitingPromise=Promise.all(s).then(function(){if(this._oAwaitingPromise===h){if(this.getModel("parameters")){this.getModel("parameters").setProperty("/visibleItems",g)}this.fireEvent("_filterNavItemsReady")}}.bind(this))};s.prototype._handleNoItemsError=function(t){if(!this.getInnerList()){return}var e=this.getInnerList(),i=e.getBinding(e.getMetadata().getDefaultAggregationName()),n=i.getModel(),r=i.getPath(),s=n.getProperty(r);if(s&&s.length===0){this.getParent()._handleError("No items available",true)}};s.prototype._getGroupSorter=function(t){var i=false;if(t.order.dir&&t.order.dir==="DESC"){i=true}var n=new r(t.order.path,i,function(i){return e.resolveValue(t.title,i.getModel(),i.getPath())});return n};s.prototype.sliceData=function(t,e){this.getModel().sliceData(t,e);if(t!==0){this._keepHeight()}};s.prototype.getDataLength=function(){var t=this.getModel().getProperty(this.getInnerList().getBindingContext().getPath());if(Array.isArray(t)){return t.length}return Object.getOwnPropertyNames(t).length};return s});
//# sourceMappingURL=BaseListContent.js.map