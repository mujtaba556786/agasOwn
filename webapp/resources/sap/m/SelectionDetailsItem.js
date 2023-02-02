/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/m/ListItemBase","./library","sap/m/Button","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/ui/base/Interface","./SelectionDetailsListItemRenderer"],function(t,e,o,i,a,s,n,r){"use strict";var l=e.extend("sap.m.SelectionDetailsListItem",{renderer:r});l.prototype.onBeforeRendering=function(){var t;if(this._getParentElement().getEnableNav()){t=o.ListType.Navigation}else{t=o.ListType.Inactive}this.setProperty("type",t,true)};var p=t.extend("sap.m.SelectionDetailsItem",{metadata:{library:"sap.m",properties:{enableNav:{type:"boolean",defaultValue:false,group:"Behavior"}},aggregations:{lines:{type:"sap.m.SelectionDetailsItemLine",multiple:true,bindable:"bindable"},actions:{type:"sap.ui.core.Item",multiple:true},_overflowToolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"}}}});p.prototype.exit=function(){if(this._oListItem){this._oListItem.destroy();this._oListItem=null}};p.prototype._aFacadeMethods=["addCustomData","getCustomData","indexOfCustomData","insertCustomData","removeCustomData","removeAllCustomData","destroyCustomData","data","addEventDelegate","removeEventDelegate","setEnableNav","getEnableNav","addAction","removeAction"];p.prototype.getFacade=function(){var t=new n(this,p.prototype._aFacadeMethods);this.getFacade=function(){return t};return t};p.prototype._getListItem=function(){if(!this._oListItem){this._oListItem=new l({press:[this._onSelectionDetailsListItemPress,this]});this._oListItem._getParentElement=function(){return this}.bind(this);this._addOverflowToolbar()}return this._oListItem};p.prototype._onSelectionDetailsListItemPress=function(){this.fireEvent("_navigate")};p.prototype._addOverflowToolbar=function(){var t=this.getActions(),e,n;this.destroyAggregation("_overflowToolbar");if(t.length===0){return}var r=new a(this.getId()+"-action-toolbar");this.setAggregation("_overflowToolbar",r,true);r.addAggregation("content",new s,true);for(e=0;e<t.length;e++){n=new i(this.getId()+"-action-"+e,{text:t[e].getText(),type:o.ButtonType.Transparent,enabled:t[e].getEnabled(),press:[t[e],this._onActionPress,this]});r.addAggregation("content",n,true)}};p.prototype._onActionPress=function(t,e){this.fireEvent("_actionPress",{action:e,items:[this],level:o.SelectionDetailsActionLevel.Item})};return p});
//# sourceMappingURL=SelectionDetailsItem.js.map