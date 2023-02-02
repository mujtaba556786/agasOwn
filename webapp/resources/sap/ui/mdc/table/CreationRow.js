/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library","sap/ui/core/Element"],function(e,t){"use strict";var n=e.TableType;var o=t.extend("sap.ui.mdc.table.CreationRow",{metadata:{library:"sap.ui.mdc",properties:{applyEnabled:{type:"boolean",group:"Behavior",defaultValue:true},busy:{type:"boolean",group:"Behavior",defaultValue:false},visible:{type:"boolean",group:"Appearance",defaultValue:true}},events:{apply:{allowPreventDefault:true}}}});o.prototype.init=function(){this._oInnerCreationRow=null;this._mBindingContexts={}};o.prototype.exit=function(){if(this._oInnerCreationRow){this._oInnerCreationRow.destroy();this._oInnerCreationRow=null}this._mBindingContexts=null};o.prototype.setBusy=function(e){this.setProperty("busy",e,true);if(this._oInnerCreationRow){this._oInnerCreationRow.setBusy(e)}return this};o.prototype.setBindingContext=function(e,n){t.prototype.setBindingContext.call(this,e,n);this._mBindingContexts[n]={context:e,modelName:n};if(this._oInnerCreationRow){this._oInnerCreationRow.setBindingContext(e,n)}return this};o.prototype.setApplyEnabled=function(e){this.setProperty("applyEnabled",e,true);if(this._oInnerCreationRow){this._oInnerCreationRow.setApplyEnabled(e)}return this};o.prototype.setVisible=function(e){this.setProperty("visible",e,true);if(this._oInnerCreationRow){this._oInnerCreationRow.setVisible(e);this._getTable()._oTable.getRowMode().setHideEmptyRows(e)}return this};o.prototype._onInnerApply=function(e){if(!this.fireApply()){e.preventDefault()}};o.prototype.update=function(){return this._updateInnerCreationRow()};o.prototype._updateInnerCreationRow=function(){var e=this._getTable();var t;if(!e||!e._oTable){return Promise.resolve()}if(e._isOfType(n.Table,true)){if(!this._oInnerCreationRow||this._oInnerCreationRow.isDestroyed()){t=this._createGridTableCreationRow();e._oTable.getRowMode().setHideEmptyRows(this.getVisible())}else{t=Promise.resolve()}}else{t=this._createResponsiveTableCreationRow()}return t.then(function(t){r(e,t)})};function i(e){return new Promise(function(t,n){sap.ui.require([e],function(e){t(e)},function(e){n(e)})})}o.prototype._createGridTableCreationRow=function(){return i("sap/ui/table/CreationRow").then(function(e){s(this);this._oInnerCreationRow=new e(this.getId()+"-inner",{visible:this.getVisible(),applyEnabled:this.getApplyEnabled(),apply:[this._onInnerApply,this]});this._getTable()._oTable.getRowMode().setHideEmptyRows(this.getVisible());for(var t in this._mBindingContexts){var n=this._mBindingContexts[t];this._oInnerCreationRow.setBindingContext(n.context,n.modelName)}return this._oInnerCreationRow}.bind(this))};o.prototype._createResponsiveTableCreationRow=function(){s(this);return Promise.resolve()};function r(e,t){if(e&&e._oTable&&t){e._oTable.setCreationRow(t)}}function s(e){if(e&&e._oInnerCreationRow){e._oInnerCreationRow.destroy();e._oInnerCreationRow=null}}o.prototype._getTable=function(){var e=this.getParent();return e&&e.isA("sap.ui.mdc.Table")?e:null};return o});
//# sourceMappingURL=CreationRow.js.map