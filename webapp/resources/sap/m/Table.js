/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/events/KeyCodes","sap/ui/core/Core","./library","./ListBase","./ListItemBase","./CheckBox","./TableRenderer","sap/ui/base/Object","sap/ui/core/ResizeHandler","sap/ui/core/util/PasteHelper","sap/ui/thirdparty/jquery","sap/m/ListBaseRenderer","sap/ui/core/Icon","sap/m/table/Util","sap/ui/dom/jquery/Selectors"],function(t,e,i,s,o,n,r,a,l,h,jQuery,u,p,d){"use strict";var c=i.ListKeyboardMode;var f=i.ListGrowingDirection;var g=i.BackgroundDesign;var y=i.PopinLayout;var m=i.ScreenSizes;var C=s.extend("sap.m.Table",{metadata:{library:"sap.m",properties:{backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:g.Translucent},fixedLayout:{type:"any",group:"Behavior",defaultValue:true},showOverlay:{type:"boolean",group:"Appearance",defaultValue:false},alternateRowColors:{type:"boolean",group:"Appearance",defaultValue:false},popinLayout:{type:"sap.m.PopinLayout",group:"Appearance",defaultValue:y.Block},contextualWidth:{type:"string",group:"Behavior",defaultValue:"Inherit"},autoPopinMode:{type:"boolean",group:"Behavior",defaultValue:false},hiddenInPopin:{type:"sap.ui.core.Priority[]",group:"Behavior"}},aggregations:{columns:{type:"sap.m.Column",multiple:true,singularName:"column",dnd:{draggable:true,droppable:true,layout:"Horizontal"}},_noColumnsMessage:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{beforeOpenContextMenu:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ColumnListItem"},column:{type:"sap.m.Column"}}},paste:{allowPreventDefault:true,parameters:{data:{type:"string[][]"}}},popinChanged:{parameters:{hasPopin:{type:"boolean"},visibleInPopin:{type:"sap.m.Column[]"},hiddenInPopin:{type:"sap.m.Column[]"}}}},designtime:"sap/m/designtime/Table.designtime"},renderer:r});C.prototype.sNavItemClass="sapMListTblRow";C.prototype.init=function(){this._iItemNeedsColumn=0;s.prototype.init.call(this)};C.prototype.setContextualWidth=function(t){var e=this.getContextualWidth();if(t==e){return this}if(typeof t==="number"){this._sContextualWidth=t+"px";this._sContextualWidth=this._sContextualWidth.toLowerCase()}else{var i=t.toLowerCase(),s=m[i];if(s){this._sContextualWidth=s+"px"}else{this._sContextualWidth=t}}var o=this._validateContextualWidth(this._sContextualWidth);this._iLastContextualWidth=e;if(o){this.setProperty("contextualWidth",t,true)}else{return this}if(this._iLastContextualWidth.toLowerCase()==="auto"){this._deregisterResizeHandler()}if(this._sContextualWidth.toLowerCase()==="auto"){this._registerResizeHandler();this._applyContextualWidth(this.$().width())}else{this._applyContextualWidth(this._sContextualWidth)}return this};C.prototype._validateContextualWidth=function(t){if(!t){return}if(typeof t!="string"){throw new Error('expected string for property "contextualWidth" of '+this)}if(t.toLowerCase()==="auto"||t.toLowerCase()==="inherit"){return true}if(!/^\d+(\.\d+)?(px)$/i.test(t)){throw new Error('invalid CSS size("px", "Auto", "auto", Inherit", "inherit" required) or sap.m.ScreenSize enumeration for property "contextualWidth" of '+this)}return true};C.prototype._applyContextualWidth=function(t){t=parseFloat(t)||0;if(Math.abs(this._oContextualSettings.contextualWidth-t)<=16){return}if(t&&this._oContextualSettings.contextualWidth!=t){this._applyContextualSettings({contextualWidth:t})}};C.prototype.setNoData=function(t){s.prototype.setNoData.apply(this,arguments);if(t&&typeof t!=="string"&&t.isA("sap.m.IllustratedMessage")){var i=this.getAggregation("_noColumnsMessage");if(!i){i=d.getNoColumnsIllustratedMessage();this.setAggregation("_noColumnsMessage",i)}}else if(t&&(typeof t==="string"||!t.isA("sap.m.IllustratedMessage"))){this.removeAllAggregation("_noColumnsMessage")}if(!this.shouldRenderItems()){if(this.getAggregation("_noColumnsMessage")){this.invalidate()}else{this.$("nodata-text").text(e.getLibraryResourceBundle("sap.m").getText("TABLE_NO_COLUMNS"))}}return this};C.prototype._onResize=function(t){this._applyContextualWidth(t.size.width)};C.prototype._registerResizeHandler=function(){if(!this._iResizeHandlerId){var t=this;window.requestAnimationFrame(function(){t._iResizeHandlerId=l.register(t,t._onResize.bind(t))})}};C.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){l.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null}};C.prototype.onBeforeRendering=function(){s.prototype.onBeforeRendering.call(this);this._bHasDynamicWidthCol=this._hasDynamicWidthColumn();if(this.getAutoPopinMode()){this._configureAutoPopin()}this._applyContextualWidth(this._sContextualWidth);this._ensureColumnsMedia();this._notifyColumns("ItemsRemoved")};C.prototype._hasDynamicWidthColumn=function(t,e){if(this.getFixedLayout()!="Strict"){return true}return this.getColumns().some(function(i){if(i.getVisible()&&!i.isPopin()){var s=t&&t==i?e:i.getWidth();return!s||s=="auto"}})};C.prototype._ensureColumnsMedia=function(){this.getColumns().forEach(function(t){if(t._bShouldAddMedia){t._addMedia()}})};C.prototype.onAfterRendering=function(){s.prototype.onAfterRendering.call(this);this.updateSelectAllCheckbox();this._adaptBlockLayer();if(this._bFirePopinChanged){this._firePopinChangedEvent();this._bFirePopinChanged=false}else{var t=this._getPopins();if(this._aPopins&&this.getVisibleItems().length){if(this._aPopins.length!=t.length||!t.every(function(t){return this._aPopins.indexOf(t)>-1},this)){this._aPopins=t;this._firePopinChangedEvent()}}else if(this._aPopins==null){this._aPopins=t}}if(this._bCheckLastColumnWidth&&e.isThemeApplied()){window.requestAnimationFrame(this._checkLastColumnWidth.bind(this))}};C.prototype.setHiddenInPopin=function(t){var e=this.getHiddenInPopin()||[],i=t||[];this.setProperty("hiddenInPopin",t);if(i.length!==e.length){this._bFirePopinChanged=true}else{this._bFirePopinChanged=!i.every(function(t){return e.includes(t)})}this._aPopins=this._getPopins();return this};C.prototype._adaptBlockLayer=function(t){if(!this.getShowOverlay()){return}var e=this.getDomRef("blockedLayer");if(e){var i=["id","class","tabindex"];e.getAttributeNames().forEach(function(t){if(!i.includes(t)){e.removeAttribute(t)}});e.setAttribute("role","region");e.setAttribute("aria-labelledby",[r.getAriaLabelledBy(this),r.getAriaAnnouncement("TABLE_INVALID")].join(" ").trimLeft())}else if(!t){setTimeout(this._adaptBlockLayer.bind(this,true))}};C.prototype._checkLastColumnWidth=function(){var t=this.$();var e=this.getTableDomRef();if(!t.length||!e){return}if(t[0].clientWidth<e.clientWidth){t.find(".sapMListTblCell:visible").eq(0).addClass("sapMTableLastColumn").width("")}this._bCheckLastColumnWidth=false};C.prototype.setShowOverlay=function(t){this.setProperty("showOverlay",t,true);this.setBlocked(this.getShowOverlay());this._adaptBlockLayer();return this};C.prototype.exit=function(){s.prototype.exit.call(this);if(this._selectAllCheckBox){this._selectAllCheckBox.destroy();this._selectAllCheckBox=null}if(this._clearAllButton){this._clearAllButton.destroy();this._clearAllButton=null}if(this._aPopinHeaders){this._aPopinHeaders.forEach(function(t){t.destroy()});this._aPopinHeaders=null}};C.prototype.destroyItems=function(){this._notifyColumns("ItemsRemoved");return s.prototype.destroyItems.apply(this,arguments)};C.prototype.removeAllItems=function(){this._notifyColumns("ItemsRemoved");return s.prototype.removeAllItems.apply(this,arguments)};C.prototype.removeSelections=function(){s.prototype.removeSelections.apply(this,arguments);this.updateSelectAllCheckbox();return this};C.prototype.selectAll=function(){s.prototype.selectAll.apply(this,arguments);this.updateSelectAllCheckbox();return this};C.prototype.getColumns=function(t){var e=this.getAggregation("columns",[]);if(t){e.sort(function(t,e){return t.getOrder()-e.getOrder()})}return e};C.prototype.setFixedLayout=function(t){if(t==undefined||t=="true"){t=true}else if(t=="false"){t=false}if(typeof t=="boolean"||t=="Strict"){return this.setProperty("fixedLayout",t)}throw new Error('"'+t+'" is an invalid value, expected false, true or "Strict" for the property fixedLayout of '+this)};C.prototype.onBeforePageLoaded=function(){if(this.getAlternateRowColors()){this._sAlternateRowColorsClass=this._getAlternateRowColorsClass()}s.prototype.onBeforePageLoaded.apply(this,arguments)};C.prototype.onAfterPageLoaded=function(){this.updateSelectAllCheckbox();if(this.getAlternateRowColors()&&this._sAlternateRowColorsClass!=this._getAlternateRowColorsClass()){var t=this.$("tblBody").removeClass(this._sAlternateRowColorsClass);t.addClass(this._getAlternateRowColorsClass())}s.prototype.onAfterPageLoaded.apply(this,arguments)};C.prototype.shouldRenderItems=function(){return this.getColumns().some(function(t){return t.getVisible()})};C.prototype.shouldGrowingSuppressInvalidation=function(){if(this.getAutoPopinMode()){return false}return s.prototype.shouldGrowingSuppressInvalidation.call(this)};C.prototype.onItemTypeColumnChange=function(t,e){this._iItemNeedsColumn+=e?1:-1;if(this._iItemNeedsColumn==1&&e){this._setTypeColumnVisibility(true)}else if(this._iItemNeedsColumn==0){this._setTypeColumnVisibility(false)}};C.prototype.onItemSelectedChange=function(t,e){s.prototype.onItemSelectedChange.apply(this,arguments);setTimeout(function(){this.updateSelectAllCheckbox()}.bind(this),0)};C.prototype.getTableDomRef=function(){return this.getDomRef("listUl")};C.prototype.getItemsContainerDomRef=function(){return this.getDomRef("tblBody")};C.prototype.setNavigationItems=function(t){var e=this.$("tblHeader").not(".sapMListTblHeaderNone");var i=this.$("tblBody").children(".sapMLIB");var s=this.$("tblFooter");var o=e.add(i).add(s).get();t.setItemDomRefs(o);if(t.getFocusedIndex()==-1){if(this.getGrowing()&&this.getGrowingDirection()==f.Upwards){t.setFocusedIndex(o.length-1)}else{t.setFocusedIndex(e[0]?1:0)}}};C.prototype.checkGrowingFromScratch=function(){if(this.hasPopin()){return false}return this.getColumns().some(function(t){return t.getVisible()&&t.getMergeDuplicates()})};C.prototype.onColumnPress=function(t){var e=t._getHeaderMenuInstance();e&&e.openBy(t);if(this.bActiveHeaders&&!e){this.fireEvent("columnPress",{column:t})}};C.prototype.onColumnResize=function(t){if(!this.hasPopin()&&!this._mutex){var e=this.getColumns().some(function(t){return t.isPopin()});if(!e){t.setDisplay(this.getTableDomRef(),!t.isHidden());this._firePopinChangedEvent();this._oGrowingDelegate&&this._oGrowingDelegate.adaptTriggerButtonWidth(this);return}}this._dirty=this._getMediaContainerWidth()||window.innerWidth;if(!this._mutex){var i=this._getMediaContainerWidth()||window.innerWidth;this._mutex=true;this._bFirePopinChanged=true;this.rerender();setTimeout(function(){if(this._dirty!=i){this._dirty=0;this._bFirePopinChanged=true;this.rerender()}this._mutex=false}.bind(this),200)}};C.prototype.setTableHeaderVisibility=function(t){if(!this.getDomRef()){return}if(!this.shouldRenderItems()){return this.invalidate()}var e=this.$("tblHeader"),i=!e.hasClass("sapMListTblHeaderNone"),s=e.find(".sapMListTblCell:visible"),o=s.eq(0);if(s.length==1){if(this.getFixedLayout()=="Strict"){this._checkLastColumnWidth()}else{o.width("")}}else{o.removeClass("sapMTableLastColumn");s.each(function(){this.style.width=this.getAttribute("data-sap-width")||""})}this._colCount=s.length+3+!!u.ModeOrder[this.getMode()];this.$("tblBody").find(".sapMGHLICell").attr("colspan",this.getColSpan());this.$("nodata-text").attr("colspan",this.getColCount());if(this.hasPopin()){this.$("tblBody").find(".sapMListTblSubRowCell").attr("colspan",this.getColSpan())}if(!t&&i){e[0].className="sapMListTblRow sapMLIBFocusable sapMListTblHeader";this._headerHidden=false}else if(t&&!i&&!s.length){e[0].className="sapMListTblHeaderNone";this._headerHidden=true}};C.prototype._setTypeColumnVisibility=function(t){jQuery(this.getTableDomRef()).toggleClass("sapMListTblHasNav",t)};C.prototype.onkeydown=function(e){if(e.which===t.F2||e.which===t.F7){var i=false,o=this.$("tblHeader"),n=o.find(":sapTabbable");if(e.target.classList.contains("sapMColumnHeader")){this._iLastFocusPosOfItem=n.length&&n.index(e.target);o.trigger("focus");i=true}else if(e.target===o[0]){var r=this._iLastFocusPosOfItem||0;r=n[r]?r:-1;n.eq(r).trigger("focus");i=true}if(i){e.preventDefault();e.setMarked();if(e.which===t.F2){this.setKeyboardMode(this.getKeyboardMode()==="Edit"?"Navigation":"Edit")}}}s.prototype.onkeydown.apply(this,arguments)};C.prototype._notifyColumns=function(t,e,i){this.getColumns().forEach(function(s){s["on"+t](e,i)})};C.prototype._getClearAllButton=function(){if(!this._clearAllButton){this._clearAllButton=new p({id:this.getId()+"-clearSelection",src:"sap-icon://clear-all",tooltip:e.getLibraryResourceBundle("sap.m").getText("TABLE_CLEARBUTTON_TOOLTIP"),decorative:false,press:this.removeSelections.bind(this,false,true,false)}).setParent(this,null,true).addEventDelegate({onAfterRendering:function(){this._clearAllButton.getDomRef().setAttribute("tabindex",-1)}},this)}return this._clearAllButton};C.prototype._getSelectAllCheckbox=function(){if(this.bPreventMassSelection){return}if(!this._selectAllCheckBox){this._selectAllCheckBox=new n({id:this.getId("sa"),activeHandling:false}).addStyleClass("sapMLIBSelectM").setParent(this,null,true).attachSelect(function(){if(this._selectAllCheckBox.getSelected()){this.selectAll(true)}else{this.removeSelections(false,true)}},this).setTabIndex(-1)}this._selectAllCheckBox.useEnabledPropagator(false);return this._selectAllCheckBox};C.prototype.updateSelectAllCheckbox=function(){if(this.getMode()!=="MultiSelect"){return}d.hideSelectionLimitPopover();if(this._selectAllCheckBox&&this.getMultiSelectMode()!="ClearAll"){var t=this.getItems(),e=this.getSelectedItems().length,i=t.filter(function(t){return t.isSelectable()}).length;this._selectAllCheckBox.setSelected(t.length>0&&e==i)}else if(this._clearAllButton){this._clearAllButton.toggleStyleClass("sapMTableDisableClearAll",!this.getSelectedItems().length)}};C.prototype.enhanceAccessibilityState=function(t,i){if(t==this._clearAllButton){i.label=e.getLibraryResourceBundle("sap.m").getText("TABLE_ICON_DESELECT_ALL")}else if(t==this._selectAllCheckBox){i.label=e.getLibraryResourceBundle("sap.m").getText("TABLE_CHECKBOX_SELECT_ALL")}};C.prototype.getColSpan=function(){var t=this.shouldRenderDummyColumn()?3:2;return(this._colCount||1)-t};C.prototype.getColCount=function(){return this._colCount||0};C.prototype.shouldRenderDummyColumn=function(){return!this._bHasDynamicWidthCol&&this.shouldRenderItems()};C.prototype.hasPopin=function(){return!!this._hasPopin};C.prototype.isHeaderRowEvent=function(t){var e=this.$("tblHeader");return!!jQuery(t.target).closest(e,this.getTableDomRef()).length};C.prototype.isFooterRowEvent=function(t){var e=this.$("tblFooter");return!!jQuery(t.target).closest(e,this.getTableDomRef()).length};C.prototype.getAccessibilityType=function(){return e.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_TABLE")};C.prototype._setHeaderAnnouncement=function(){var t=e.getLibraryResourceBundle("sap.m"),i=t.getText("ACC_CTR_TYPE_HEADER_ROW")+" ";if(this.isAllSelectableSelected()){i+=t.getText("LIST_ALL_SELECTED")}var s=this._getHiddenInPopin();this.getColumns(true).forEach(function(t,e){if(!t.getVisible()||s.indexOf(t)>-1){return}var n=t.getHeader();if(n&&n.getVisible()){i+=o.getAccessibilityText(n,false,true)+" . "}});this.updateInvisibleText(i)};C.prototype._setFooterAnnouncement=function(){var t=e.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_FOOTER_ROW")+" ";this.getColumns(true).forEach(function(e,i){if(!e.getVisible()){return}var s=e.getFooter();if(s&&s.getVisible()){var n=e.getHeader();if(n&&n.getVisible()){t+=o.getAccessibilityText(n)+" "}t+=o.getAccessibilityText(s)+" "}});this.updateInvisibleText(t)};C.prototype._setNoColumnsMessageAnnouncement=function(t){if(!this.shouldRenderItems()){var e=this.getNoData();if(e&&typeof e!=="string"&&e.isA("sap.m.IllustratedMessage")){var i=o.getAccessibilityText(this.getAggregation("_noColumnsMessage"));this.updateInvisibleText(i,t)}}};C.prototype.onsapspace=function(t){if(t.isMarked()){return}if(t.target.id==this.getId("tblHeader")){t.preventDefault();var e=this.getMultiSelectMode();if(this._selectAllCheckBox&&e!="ClearAll"){this._selectAllCheckBox.setSelected(!this._selectAllCheckBox.getSelected()).fireSelect();t.setMarked()}else if(this._clearAllButton&&e=="ClearAll"&&!this._clearAllButton.hasStyleClass("sapMTableDisableClearAll")){this._clearAllButton.firePress();t.setMarked()}}};C.prototype.onsaptabnext=function(t){if(t.isMarked()||this.getKeyboardMode()==c.Edit){return}var e=jQuery();if(t.target.id==this.getId("nodata")){e=this.$("nodata")}else if(this.isHeaderRowEvent(t)){e=this.$("tblHeader")}else if(this.isFooterRowEvent(t)){e=this.$("tblFooter")}var i=e.find(":sapTabbable").get(-1)||e[0];if(t.target===i){this.forwardTab(true);t.setMarked()}};C.prototype.onsaptabprevious=function(t){if(t.isMarked()||this.getKeyboardMode()==c.Edit){return}var e=t.target.id;if(e==this.getId("nodata")||e==this.getId("tblHeader")||e==this.getId("tblFooter")){this.forwardTab(false)}else if(e==this.getId("trigger")){this.focusPrevious();t.preventDefault()}};C.prototype.focus=function(t){this._oFocusInfo=t;s.prototype.focus.apply(this,arguments);delete this._oFocusInfo};C.prototype.getFocusDomRef=function(){var t=this._oFocusInfo&&this._oFocusInfo.targetInfo&&a.isA(this._oFocusInfo.targetInfo,"sap.ui.core.message.Message");if(t){var e=this.$("tblHeader");var i=e.find(".sapMListTblCell:visible");if(i.length){return e[0]}var o=this.$("nodata");if(o.length){return o[0]}}return s.prototype.getFocusDomRef.apply(this,arguments)};C.prototype.onfocusin=function(t){var e=t.target;if(e.id==this.getId("tblHeader")){if(!this.hasPopin()&&this.shouldRenderDummyColumn()){e.classList.add("sapMTableRowCustomFocus")}this._setHeaderAnnouncement();this._setFirstLastVisibleCells(e)}else if(e.id==this.getId("tblFooter")){this._setFooterAnnouncement();this._setFirstLastVisibleCells(e)}else if(e.id==this.getId("nodata")){this._setFirstLastVisibleCells(e)}s.prototype.onfocusin.call(this,t);this._setNoColumnsMessageAnnouncement(e)};C.prototype.onThemeChanged=function(){s.prototype.onThemeChanged.call(this);if(this._bCheckLastColumnWidth){this._checkLastColumnWidth()}};C.prototype._getAlternateRowColorsClass=function(){if(this.isGrouped()){return"sapMListTblAlternateRowColorsGrouped"}if(this.hasPopin()){return"sapMListTblAlternateRowColorsPopin"}return"sapMListTblAlternateRowColors"};C.prototype.onpaste=function(t){if(t.isMarked()||/^(input|textarea)$/i.test(t.target.tagName)){return}var e=h.getPastedDataAs2DArray(t.originalEvent);if(!e||e.length===0||e[0].length===0){return}this.firePaste({data:e})};C.prototype.ondragenter=function(t){var e=t.dragSession;if(!e||!e.getDropControl()||!e.getDropControl().isA("sap.m.Column")){return}e.setIndicatorConfig({height:this.getTableDomRef().clientHeight})};C.prototype._configureAutoPopin=function(){if(this._mutex){return}var t=this.getColumns(true).filter(function(t){return t.getVisible()});if(!t.length){return}var e=this.getItems();var i={High:[],Medium:[],Low:[]};t.forEach(function(t){var e=t.getImportance();if(e==="None"){e="Medium"}i[e].push(t)});var s=Object.values(i);var o=s.find(String)[0];s.reduce(function(t,e){return C._updateAccumulatedWidth(e,o,t)},this._getInitialAccumulatedWidth(e))};C.prototype._getInitialAccumulatedWidth=function(t){var e=this.getInset()?4:0;var s=this.$(),o=3;if(s.closest(".sapUiSizeCompact").length||jQuery(document.body).hasClass("sapUiSizeCompact")){o=2}else{var n=false;s.find(".sapMTableTH[aria-hidden=true]:not(.sapMListTblHighlightCol):not(.sapMListTblDummyCell):not(.sapMListTblNavigatedCol)").get().forEach(function(t){var e=jQuery(t).width();if(!n&&e>0){o=e/parseFloat(i.BaseFontSize);n=true}})}var r=u.ModeOrder[this.getMode()]?o:0;var a=t.some(function(t){var e=t.getType();return e==="Detail"||e==="DetailAndActive"||e==="Navigation"})?o:0;return e+r+a+.25};C._updateAccumulatedWidth=function(t,e,s){t.forEach(function(t){var o=t.getWidth();var n=o.replace(/[^a-z]/gi,"");var r=parseFloat(i.BaseFontSize)||16;if(n==="px"){s+=parseFloat(o)/r}else if(n==="em"||n==="rem"){s+=parseFloat(o)}else{s+=t.getAutoPopinWidth()}t.setDemandPopin(t!==e);t.setMinScreenWidth(t!==e?parseFloat(s).toFixed(2)+"rem":"")});return s};C.prototype._getHiddenInPopin=function(){return this._getPopins().filter(function(t){return!t.isPopin()})};C.prototype._getVisiblePopin=function(){return this._getPopins().filter(function(t){return t.isPopin()})};C.prototype._getPopins=function(){var t=this.getColumns().filter(function(t){return t.getVisible()&&t.getDemandPopin()});return t.filter(function(t){return t._media&&!t._media.matches})};C.prototype._firePopinChangedEvent=function(){this.fireEvent("popinChanged",{hasPopin:this.hasPopin(),visibleInPopin:this._getVisiblePopin(),hiddenInPopin:this._getHiddenInPopin()})};C.prototype._fireUpdateFinished=function(t){s.prototype._fireUpdateFinished.apply(this,arguments);var e=this.getVisibleItems().length;if(!this._iVisibleItemsLength&&e>0){this._iVisibleItemsLength=e;this._firePopinChangedEvent()}else if(this._iVisibleItemsLength>0&&!e){this._iVisibleItemsLength=e;this._firePopinChangedEvent()}};C.prototype.onItemFocusIn=function(t,i){s.prototype.onItemFocusIn.apply(this,arguments);if(t!=i||!e.getConfiguration().getAccessibility()){return}this._setFirstLastVisibleCells(t.getDomRef())};C.prototype._setFirstLastVisibleCells=function(t){var e=jQuery(t);if(!e.hasClass("sapMTableRowCustomFocus")){return}e.find(".sapMTblLastVisibleCell").removeClass("sapMTblLastVisibleCell");e.find(".sapMTblFirstVisibleCell").removeClass("sapMTblFirstVisibleCell");for(var i=t.firstChild;i&&!i.clientWidth;i=i.nextSibling){}for(var s=t.lastChild.previousSibling;s&&!s.clientWidth;s=s.previousSibling){}jQuery(i).addClass("sapMTblFirstVisibleCell");jQuery(s).addClass("sapMTblLastVisibleCell")};C.prototype.getAriaRole=function(){return""};C.prototype.setLastGroupHeader=function(){};return C});
//# sourceMappingURL=Table.js.map