/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/m/library","sap/ui/comp/library","./ColumnsController","./FilterController","./GroupController","./SortController","./DimeasureController","./SelectionController","./Util","./ChartWrapper","./SelectionWrapper","./ColumnHelper","sap/m/MessageStrip","sap/m/P13nDialog","./Validator","sap/ui/model/json/JSONModel","sap/ui/Device","sap/ui/model/BindingMode"],function(t,jQuery,e,n,i,a,o,r,s,l,h,u,g,p,c,C,_,f,d,y,D){"use strict";var m=e.extend("sap.ui.comp.personalization.Controller",{constructor:function(t,n){e.apply(this,arguments)},metadata:{library:"sap.ui.comp",interfaces:["sap.ui.mdc.p13n.AdaptationProvider"],properties:{setting:{type:"object",defaultValue:{}},resetToInitialTableState:{type:"boolean",defaultValue:true},columnKeys:{type:"string[]",defaultValue:[]}},associations:{table:{type:"object",multiple:false}},events:{beforePotentialTableChange:{},afterPotentialTableChange:{},afterP13nModelDataChange:{parameters:{persistentData:{type:"object"},persistentDataChangeType:{type:"sap.ui.comp.personalization.ChangeType"},runtimeDeltaData:{type:"object"},runtimeDeltaDataChangeType:{type:"sap.ui.comp.personalization.ChangeType"}}},requestColumns:{parameters:{columnKeys:{type:"string"}}},dialogAfterClose:{parameters:{cancel:{type:"boolean"}}},dialogAfterOpen:{},dialogConfirmedReset:{}}}});m.prototype.applySettings=function(t){e.prototype.applySettings.apply(this,arguments);this._initialize()};m.prototype._initialize=function(){this._bInitCalled=true;var t=this.getTable();if(!t){throw"The table instance should be passed into constructor."}this._createSettingCurrent(this.getSetting());var e=t.getColumns();if(!this.getColumnKeys().length){this.setProperty("columnKeys",u.getColumnKeys(e),true)}var n=this._createInternalModel(this.getColumnKeys());this._callControllers(this._oSettingCurrent,"initializeInternalModel",n);this._oColumnHelper=new c({callbackOnSetVisible:this._onSetVisible.bind(this),callbackOnSetSummed:this._onSetSummed.bind(this),callbackOnSetGrouped:t.fireGroup?this._onSetGrouped.bind(this):null});this._oColumnHelper.addColumns(e);this._callControllers(this._oSettingCurrent,"setColumnHelper",this._oColumnHelper);this._callControllers(this._oSettingCurrent,"setTriggerModelChangeOnColumnInvisible");this._callControllers(this._oSettingCurrent,"setTable",t);this._callControllers(this._oSettingCurrent,"setColumnKeys",this.getColumnKeys());this._callControllers(this._oSettingCurrent,"setIgnoreColumnKeys");this._callControllers(this._oSettingCurrent,"setStableColumnKeys");this._callControllers(this._oSettingCurrent,"checkConsistency");this._callControllers(this._oSettingCurrent,"calculateIgnoreData");var i=m._getOrderedColumnKeys(this._oColumnHelper.getColumnMap(),this.getColumnKeys());this._extendModelStructure(i);this._callControllers(this._oSettingCurrent,"calculateControlData");this._suspendTable();this._syncTableUi();this._resumeTable(true);this._fireChangeEvent()};m.prototype.init=function(){this._oDialog=null;this._bInitCalled=false;this._bSuspend=false;this._bUnconfirmedResetPressed=false;this._oColumnHelper=null;this._oSettingCurrent={}};m.prototype.setSetting=function(t){if(this._bInitCalled){throw"The setting instance should be passed only into constructor."}t=this.validateProperty("setting",t);this.setProperty("setting",t,true);return this};m.prototype.setResetToInitialTableState=function(t){if(this._bInitCalled){throw"The resetToInitialTableState property should be passed only into constructor."}t=this.validateProperty("resetToInitialTableState",t);this.setProperty("resetToInitialTableState",t,true);return this};m.prototype.setColumnKeys=function(e){if(this._bInitCalled){throw"The columnKeys array should be passed only into constructor."}e=this.validateProperty("columnKeys",e);var n=e.filter(function(n,i){var a=e.indexOf(n,i+1)>-1;if(a){t.warning("The provided columnKeys is inconsistent as columnKey "+n+" is not unique and therefore the duplicate entry is deleted from columnKeys.")}return!a});this.setProperty("columnKeys",n,true);return this};m.prototype.setTable=function(t){if(this._bInitCalled){throw"The table instance should be passed only into constructor."}this.setAssociation("table",t);return this};m.prototype._createSettingCurrent=function(t){var e=u.getTableType(this.getTable());var a,o;switch(e){case i.personalization.TableType.ChartWrapper:a=[n.P13nPanelType.dimeasure,n.P13nPanelType.sort,n.P13nPanelType.filter];break;case i.personalization.TableType.SelectionWrapper:a=[n.P13nPanelType.selection];break;default:a=[n.P13nPanelType.columns,n.P13nPanelType.sort,n.P13nPanelType.filter,n.P13nPanelType.group]}for(o in t){if(t[o].visible===false&&a.indexOf(o)>-1){a.splice(a.indexOf(o),1)}if(t[o].visible===true&&a.indexOf(o)<0){a.push(o)}}a.forEach(function(e){this._oSettingCurrent[e]={visible:true,controller:t[e]&&t[e].controller?t[e].controller:this._controllerFactory(e),payload:t[e]&&t[e].payload?t[e].payload:undefined,ignoreColumnKeys:t[e]&&t[e].ignoreColumnKeys?t[e].ignoreColumnKeys:[],triggerModelChangeOnColumnInvisible:t[e]&&t[e].triggerModelChangeOnColumnInvisible?t[e].triggerModelChangeOnColumnInvisible:undefined,createMessageStrip:t[e]&&t[e].createMessageStrip?t[e].createMessageStrip:undefined};if(e=="columns"){this._oSettingCurrent.columns.stableColumnKeys=t.stableColumnKeys}},this)};m.prototype._mixSetting=function(t,e){if(!e){return t}if(e.useAvailablePanels){return Object.assign(t,e)}for(var n in e){if(e[n].visible===true&&t[n]&&t[n].visible===true){e[n].controller=t[n].controller;e[n].payload=e[n].payload||t[n].payload}}return e};m.prototype.openLegacyDialog=function(t){this._suspendTable();this._prepareDialogUi();var e=this._mixSetting(this._oSettingCurrent,t);this._bCancelPressed=false;this._oDialog=new _(this.getId()+"-P13nDialog",{stretch:y.system.phone,showReset:t&&t.showReset!==undefined?t.showReset:true,showResetEnabled:{path:"$sapuicomppersonalizationBaseController>/isDirty"},initialVisiblePanelType:this._oInitialVisiblePanelType,validationExecutor:function(){var t=u.getTableType(this.getTable());var n=this._oColumnHelper.getColumnMap();var i=this._callControllers(e,"getUnionData",this._getControlDataInitial(),this._getControlDataReduce());return f.checkGroupAndColumns(t,e,n,i,[]).then(function(n){var i=this._callControllers(e,"getUnionData",this._getControlDataBase(),this._getControlDataReduce());var a=this._callControllers(e,"getUnionData",this._getControlDataInitial(),i);var o=this._callControllers(e,"getChangeData",a,this._getAlreadyKnownPersistentData());return f.checkSaveChanges(t,e,o,n)}.bind(this)).then(function(n){return f.checkChartConsistency(t,e,i,n)}).then(function(t){return t})}.bind(this)});this._oDialog.setModel(this._getInternalModel(),"$sapuicomppersonalizationBaseController");this._oDialog.toggleStyleClass("sapUiSizeCompact",!!jQuery(this.getTable().getDomRef()).closest(".sapUiSizeCompact").length);if(t&&t.contentWidth){this._oDialog.setContentWidth(t.contentWidth)}if(t&&t.contentHeight){this._oDialog.setContentHeight(t.contentHeight)}if(t&&t.styleClass){this._oDialog.addStyleClass(t.styleClass)}this._callControllers(this._oSettingCurrent,"setMessageStrip");var n=this._callControllers(e,"getPanel");var i=[];for(var a in n){if(n[a]){i.push(n[a])}}Promise.all(i).then(function(t){t.forEach(function(t){this._oDialog.addPanel(t)},this);this._oDialog.attachOk(this._handleDialogOk,this);this._oDialog.attachCancel(this._handleDialogCancel,this);this._oDialog.attachReset(this._handleDialogReset,this);this._oDialog.attachAfterClose(this._handleDialogAfterClose,this);this._oDialog.isPopupAdaptationAllowed=function(){return false};this._oDialog.setEscapeHandler(function(){this._handleDialogCancel().bind(this)}.bind(this));this._oDialog.open();this.fireDialogAfterOpen()}.bind(this))};m.prototype.getUISettings=function(){var t=this._oUISetting;var e=this._callControllers(t,"retrieveAdaptationUI");var n={resetEnabled:t.showReset,contentHeight:t.contentHeight,contentWidth:t.contentWidth};var i=[];var a=Object.keys(e);var o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var r={columns:o.getText("p13nDialog.TAB_Column"),dimeasure:o.getText("p13nDialog.TAB_Chart"),filter:o.getText("p13nDialog.TAB_Filter"),sort:o.getText("p13nDialog.TAB_Sort"),group:o.getText("p13nDialog.TAB_Group"),selection:o.getText("info.SELECTION_DIALOG_ALIGNEDTITLE")};var s=this._callControllers(t,"getResetWarningText");a.forEach(function(t){var a=r[t];var o=e[t];n[t]={resetEnabled:true,adaptationUI:o instanceof Promise?o:Promise.resolve(),reset:{warningText:s[t]},containerSettings:{title:a,tabText:a,contentHeight:n.contentHeight,contentWidth:n.contentWidth}};i.push(e[t])},this);Promise.all(i).then(function(t){this._callControllers(this._oSettingCurrent,"setModelFunction")}.bind(this));return n};m.prototype.initAdaptation=function(){return Promise.resolve()};m.prototype.reset=function(e,n){this._resetMessageStrip();return new Promise(function(n){this.resetPersonalization();this._syncDialogUi();this._callControllers(this._oSettingCurrent,"setBeforeOpenData2Model",this._getControlDataBase());for(var i in this._oSettingCurrent){var a=this._oSettingCurrent[i].controller;if(a&&a.getAdaptationUI()&&a.getAdaptationUI().setP13nData){a.getAdaptationUI().setP13nData(a.getAdaptationData())}}return new Promise(function(n){if(e){sap.ui.getCore().loadLibrary("sap.ui.fl",{async:true}).then(function(){sap.ui.require(["sap/ui/comp/navpopover/FlexConnector"],function(i){return i.discardChangesForControl(e._container).then(function(){n(true)},function(e){t.error("Changes could not be discarded in LRep: "+e);n(false)})})})}else{n(false)}}).then(function(){this._syncDialogUi();for(var t in this._oSettingCurrent){var e=this._oSettingCurrent[t].controller;if(e&&e.getAdaptationUI()&&e.getAdaptationUI().setP13nData){e.getAdaptationUI().setP13nData(e.getAdaptationData())}}n()}.bind(this))}.bind(this))};m.prototype.validateP13n=function(t,e,n){var i=u.getTableType(this.getTable());var a=this._oColumnHelper.getColumnMap();var o=this._callControllers(this._oSettingCurrent,"getUnionData",this._getControlDataInitial(),this._getControlDataReduce());return f.checkGroupAndColumns(i,this._oSettingCurrent,a,o,[]).then(function(t){return f.checkChartConsistency(i,this._oSettingCurrent,o,t)}.bind(this)).then(function(t){return f.checkVisibleItemsThreshold(i,this._oSettingCurrent,o,t)}.bind(this)).then(function(t){if(t.length>0){t.forEach(function(t){for(var e in this._oSettingCurrent){var n=this._oSettingCurrent[e].controller;if(t.panelTypes.indexOf(e)>-1&&n){n.getAdaptationUI().setMessageStrip(new C({type:t.messageType,text:t.messageText}))}}}.bind(this))}else{this._resetMessageStrip()}}.bind(this))};m.prototype.preparePersonalization=function(){this._prepareDialogUi()};m.prototype.openDialog=function(t){this._suspendTable();this._prepareDialogUi();this._oUISetting=this._mixSetting(this._oSettingCurrent,t);this._callControllers(this._oSettingCurrent,"setMessageStrip");var e=Object.keys(this._getControllers());var n=Object.assign([],e);if(t&&t.useAvailablePanels!==true){var i=Object.keys(t);e.forEach(function(t,e){if(i.indexOf(t)<0){n.splice(n.indexOf(t),1)}})}return sap.ui.getCore().loadLibrary("sap.ui.mdc",{async:true}).then(function(){return new Promise(function(t,e){sap.ui.require(["sap/ui/comp/personalization/UIManager"],function(e){t(e)},e)})}).then(function(e){if(!this._oUIManager){this._oUIManager=new e(this)}return this._oUIManager.show(this.getTable(),n).then(function(e){if(e.getCustomHeader()){var i=e.getCustomHeader().getContentRight()[0];if(i){i.bindProperty("enabled",{model:"$sapmP13nPanel",path:"/isDirty",formatter:function(t){return!!t}})}}e.getButtons()[1].attachPress(this._handleDialogCancel,this);e.attachAfterClose(this._handleDialogAfterClose,this);e.setEscapeHandler(function(t){this._handleDialogCancel();t.resolve()}.bind(this));if(n.length>1&&this._sActivePanel){e.getContent()[0].switchView(this._sActivePanel)}if(t&&t.styleClass){e.addStyleClass(t.styleClass)}e.setModel(this._getInternalModel(),"$sapmP13nPanel");this._oDialog=e;this.fireDialogAfterOpen();return e}.bind(this))}.bind(this))};m.prototype.addColumns=function(t){var e=this.getTable();Object.keys(t).forEach(function(n){if(!t[n].getParent()){e.addDependent(t[n])}});this._oColumnHelper.addColumnMap(t)};m.prototype.getDataSuiteFormatSnapshot=function(){this._callControllers(this._oSettingCurrent,"calculateControlData");var t={};this._callControllers(this._oSettingCurrent,"getDataSuiteFormatSnapshot",t);return t};m.prototype.setDataSuiteFormatSnapshot=function(t,e,n){if(n){u.convertSelectOptions(t,this._oColumnHelper.getColumnMap());u.convertFilters(e,this._oColumnHelper.getColumnMap())}var i=this._callControllers(this._oSettingCurrent,"getDataSuiteFormat2Json",t);this._setRuntimeAndPersonalizationData(i,e)};m.prototype.setPersonalizationDataAsDataSuiteFormat=function(t,e){if(e){u.convertSelectOptions(t,this._oColumnHelper.getColumnMap())}var n=this._callControllers(this._oSettingCurrent,"getDataSuiteFormat2Json",t);this._setRuntimeAndPersonalizationData(n,n)};m.prototype.setPersonalizationData=function(t,e){if(e){u.convertFilters(t,this._oColumnHelper.getColumnMap())}this._setRuntimeAndPersonalizationData(t,t)};m.prototype._resetFilters=function(t){var e,n,i,a=this._oSettingCurrent&&this._oSettingCurrent.filter&&this._oSettingCurrent.filter.controller,o=this._getVariantData()&&this._getVariantData().filter&&this._getVariantData().filter.filterItems,r=this._getControlDataInitial()&&this._getControlDataInitial().filter&&this._getControlDataInitial().filter.filterItems;if(a){n=a.oFilterProvider;i=a.oMDCFilterPanel}if(n&&i&&this._oDialog&&this._oDialog.isOpen()){if(t){if(!this._getControlDataInitial()){n.clear();e=e.map(function(t){t.active=false;return t});i.setP13nData(e)}else{this._resetToState(r,n,a,i)}}else{this._resetToState(o,n,a,i)}}};m.prototype._resetToState=function(t,e,n,i){var a,o,r,s,l,h,u,g=i.getP13nData();if(g&&t){for(a=0;a<g.length;a++){s=g[a];h=s.name;s.active=false;l=e._getFieldMetadata(h);e._createInitialModelForField({},l);u=n._getControlByName(h);if(u&&u.setValue){u.setValue(null)}for(o=0;o<t.length;o++){r=t[o];if(r.columnKey===h){s.active=true;break}}}i.setP13nData(g);n._updateFilterData(t)}};m.prototype.resetPersonalization=function(t){t=this._determineResetType(t);if(t===i.personalization.ResetType.ResetFull){this._resetFull();this._resetFilters(true)}else{this._resetPartial();this._resetFilters(false)}this._setRuntimeAndPersonalizationData(this._getControlDataBase(),this._getVariantData())};m.prototype.addToSettingIgnoreColumnKeys=function(t){if(this._isEqualAdditionalIgnoreColumnKeys(t)){return this}this._callControllers(this._oSettingCurrent,"setAdditionalIgnoreColumnKeys",t);this._callControllers(this._oSettingCurrent,"calculateIgnoreData");this._requestMissingColumnsWithoutIgnore(this._getControlDataBase());this._suspendTable();this._syncTableUi();this._resumeTable(true);this._fireChangeEvent();return this};m.prototype._handleDialogReset=function(){this._bUnconfirmedResetPressed=true;var t=this._determineResetType();if(t===i.personalization.ResetType.ResetFull){this._resetFull()}else{this._resetPartial()}this._syncDialogUi()};m.prototype._handleDialogOk=function(){if(this._oDialog.isA("sap.m.P13nDialog")){this._oDialog.detachOk(this._handleDialogOk,this)}if(this._bUnconfirmedResetPressed){this.fireDialogConfirmedReset()}setTimeout(function(){this._postDialogUi(this._getControlDataReduce());this._syncTableUi();var t=function(t){var e=false;for(var n in this._oSettingCurrent){e=e||t.getParameter("runtimeDeltaDataChangeType")[n]==="ModelChanged";if(e){break}}var i=!e;this._resumeTable(i)};this.attachEventOnce("afterP13nModelDataChange",t,this);this._fireChangeEvent()}.bind(this),0);if(this._oDialog.isA("sap.m.P13nDialog")){this._oDialog.close()}};m.prototype.handleP13n=function(){return new Promise(function(t){var e=this._oDialog.getContent()[0];if(e.isA("sap.m.p13n.Container")){this._sActivePanel=e.getCurrentViewKey()}var n=u.getTableType(this.getTable());var i=this._callControllers(this._oSettingCurrent,"getUnionData",this._getControlDataBase(),this._getControlDataReduce());var a=this._callControllers(this._oSettingCurrent,"getUnionData",this._getControlDataInitial(),i);var o=this._callControllers(this._oSettingCurrent,"getChangeData",a,this._getAlreadyKnownPersistentData());this._handleDialogOk(true);return f.checkSaveChanges(n,this._oSettingCurrent,o,[]).then(function(){t()})}.bind(this))};m.prototype._handleDialogCancel=function(){if(this._oDialog.isA("sap.m.P13nDialog")){this._oDialog.detachCancel(this._handleDialogCancel,this)}setTimeout(function(){this._postDialogUi(this._getBeforeOpenData());this._resumeTable(false);this._callControllers(this._oSettingCurrent,"calculateControlData")}.bind(this),0);this._bCancelPressed=true;if(this._oDialog.isA("sap.m.P13nDialog")){this._oDialog.close()}};m.prototype._handleDialogAfterClose=function(){if(this._oDialog.isA("sap.m.P13nDialog")){this._oInitialVisiblePanelType=this._oDialog.getVisiblePanel()?this._oDialog.getVisiblePanel().getType():this._getInitialVisiblePanelType()}this._bUnconfirmedResetPressed=false;this.fireDialogAfterClose({cancel:this._bCancelPressed});if(this._oDialog){this._oDialog.destroy();this._oDialog=null}};m.prototype._getInitialVisiblePanelType=function(){for(var t in this._oSettingCurrent){return t}};m.prototype._suspendTable=function(){if(u.getTableBaseType(this.getTable())===i.personalization.TableType.Table){this._bSuspend=true}};m.prototype._resumeTable=function(t){t=t===undefined?true:t;var e=this.getTable();if(this._bSuspend){if(e){if(t){e.invalidate()}}this._bSuspend=false}};m.prototype._requestMissingColumnsWithoutIgnore=function(t){var e=this._callControllers(this._oSettingCurrent,"determineMissingColumnKeys",t);var n=u.getUnionOfColumnKeys(e);if(!n.length){return[]}this.fireRequestColumns({columnKeys:n});return n};m.prototype._extendModelStructure=function(t){if(!t.length){return}var e=this._callControllers(this._oSettingCurrent,"createColumnKeysStructure",t);var n=this._callControllers(this._oSettingCurrent,"getTable2Json",e);this._callControllers(this._oSettingCurrent,"extendControlDataInitial",n);this._callControllers(this._oSettingCurrent,"extendVariantDataInitial",n);this._callControllers(this._oSettingCurrent,"extendControlDataBase",n);this._callControllers(this._oSettingCurrent,"extendAlreadyKnownRuntimeData",n);this._callControllers(this._oSettingCurrent,"extendAlreadyKnownPersistentData",n)};m.prototype._setRuntimeAndPersonalizationData=function(t,e){t=t===null?{}:t;if(!this._sanityCheck(t)){return}e=e===null?{}:e;if(!this._sanityCheck(e)){return}this._setVariantData(e);this._extendModelStructure(this._requestMissingColumnsWithoutIgnore(t));var n=this._callControllers(this._oSettingCurrent,"getUnionData",this._getControlDataInitial(),e);this._callControllers(this._oSettingCurrent,"setVariantDataInitial2Model",n);var i=this._callControllers(this._oSettingCurrent,"getUnionData",this._getControlDataInitial(),t);this._callControllers(this._oSettingCurrent,"fixConflictWithIgnore",i,this._getIgnoreData());this._callControllers(this._oSettingCurrent,"setControlDataBase2Model",i);for(var a in this._oSettingCurrent){this._calculateChangeType(a,i)}this._suspendTable();this._syncTableUi();this._resumeTable(true);this._fireChangeEvent()};m.prototype._prepareDialogUi=function(){var t=this._callControllers(this._oSettingCurrent,"createColumnKeysStructure",this.getColumnKeys());this._extendModelStructure(this._requestMissingColumnsWithoutIgnore(t));this._callControllers(this._oSettingCurrent,"setBeforeOpenData2Model",this._getControlDataBase());this._callControllers(this._oSettingCurrent,"calculateControlDataReduce");var e=this._callControllers(this._oSettingCurrent,"getTable2JsonTransient",t);this._callControllers(this._oSettingCurrent,"calculateTransientData",e);this._callControllers(this._oSettingCurrent,"calculatePropertyInfo",e)};m.prototype._postDialogUi=function(t){this._callControllers(this._oSettingCurrent,"updateControlDataBaseFromJson",t);this._callControllers(this._oSettingCurrent,"setBeforeOpenData2Model",undefined);this._callControllers(this._oSettingCurrent,"setControlDataReduce2Model",undefined);this._callControllers(this._oSettingCurrent,"setTransientData2Model",undefined)};m.prototype._syncDialogUi=function(){this._callControllers(this._oSettingCurrent,"calculateControlDataReduce")};m.prototype._syncTableUi=function(){this._callControllers(this._oSettingCurrent,"calculateControlData");this._callControllers(this._oSettingCurrent,"syncJson2Table",this._getControlData())};m.prototype._resetFull=function(){this._setVariantData(undefined);this._callControllers(this._oSettingCurrent,"setControlDataBase2Model",this._getControlDataInitial())};m.prototype._resetPartial=function(){this._callControllers(this._oSettingCurrent,"setControlDataBase2Model",this._getVariantDataInitial())};m.prototype._calculateChangeType=function(t,e){var n={};n[t]=this._oSettingCurrent[t];this._callControllers(n,"calculatePersistentChangeTypesFromJson",e,this._determineResetType());var a=this._getPersistentDataChangeType();var o=false;for(t in this._oSettingCurrent){if(a[t]!==i.personalization.ChangeType.Unchanged){o=true}}this._setIsDirty(o)};m.prototype._fireChangeEvent=function(t){var e={};var n=this._callControllers(this._oSettingCurrent,"getUnionData",this._getControlDataInitial(),this._getControlData());e.runtimeDeltaDataChangeType=this._callControllers(this._oSettingCurrent,"getChangeType",n,this._getAlreadyKnownRuntimeData());e.persistentDeltaDataChangeType=this._getPersistentDeltaDataChangeType();e.persistentDataChangeType=this._getPersistentDataChangeType();if(!u.hasChangedType(e.runtimeDeltaDataChangeType)&&!u.hasChangedType(e.persistentDeltaDataChangeType)){return}var i=this._callControllers(this._oSettingCurrent,"getChangeData",n,this._getAlreadyKnownRuntimeData());e.runtimeDeltaData=u.removeEmptyProperty(u.copy(i));var a=this._callControllers(this._oSettingCurrent,"getChangeData",this._getControlDataBase(),this._getControlDataInitial());e.persistentData=u.removeEmptyProperty(a);this._callControllers(this._oSettingCurrent,"setAlreadyKnownRuntimeData2Model",this._getControlData());this._callControllers(this._oSettingCurrent,"setAlreadyKnownPersistentData2Model",this._getControlDataBase());delete e.persistentDeltaDataChangeType;this.fireAfterP13nModelDataChange(e)};m.prototype._onSetVisible=function(t,e){if(t){var n=u.getUnionOfAttribute(this._oSettingCurrent,"ignoreColumnKeys");if(n.indexOf(e)>-1){throw"The provided 'ignoreColumnKeys' are inconsistent. No column specified as ignored is allowed to be visible. "+this}}};m.prototype._onSetSummed=function(t,e){this._oSettingCurrent.columns.controller._onColumnTotal({column:e,isSummed:t})};m.prototype._onSetGrouped=function(t,e){this._oSettingCurrent.group.controller._setGroup(t,e)};m.prototype._getArgumentsByType=function(t,e){var n=[],i=null;if(t&&t.length&&e){t.forEach(function(t){if(t&&t[e]&&typeof t[e]!=="function"){i={};i[e]=t[e];n.push(i)}else{n.push(t)}})}return n};m.prototype._callControllers=function(t,e){var n,i,a;var o={},r=Array.prototype.slice.call(arguments,2);for(var s in t){n=i=a=null;n=t[s];i=n.controller;if(!i||!n.visible||!i[e]){continue}a=this._getArgumentsByType(r,s);if(e==="getPanel"||e==="retrieveAdaptationUI"){a.push(n.payload)}else if(e==="setIgnoreColumnKeys"){a.push(n.ignoreColumnKeys)}else if(e==="setTriggerModelChangeOnColumnInvisible"){a.push(n.triggerModelChangeOnColumnInvisible)}if(e==="setStableColumnKeys"&&s=="columns"){a.push(t.columns.stableColumnKeys)}if(e==="setMessageStrip"&&n.createMessageStrip){var l=n.createMessageStrip();a.push(l)}var h=i[e].apply(i,a);if(h!==null&&h!==undefined&&h[s]!==undefined){o[s]=h[s]}else{o[s]=h}}return o};m.prototype._sanityCheck=function(t){return true};m.prototype._createInternalModel=function(t){var e=new d;e.setDefaultBindingMode(D.TwoWay);e.setSizeLimit(1e4);this.setModel(e,"$sapuicomppersonalizationBaseController");return e};m.prototype._getInternalModel=function(){return this.getModel("$sapuicomppersonalizationBaseController")};m.prototype._getInternalModelData=function(t){return this._getInternalModel().getProperty("/"+t)};m.prototype._getControlDataInitial=function(){return this._getInternalModelData("controlDataInitial")};m.prototype._getControlDataBase=function(){return this._getInternalModelData("controlDataBase")};m.prototype._getIgnoreData=function(){return this._getInternalModelData("ignoreData")};m.prototype._getPersistentDataChangeType=function(){return this._getInternalModelData("persistentDataChangeType")};m.prototype._getPersistentDeltaDataChangeType=function(){return this._getInternalModelData("persistentDeltaDataChangeType")};m.prototype._getControlData=function(){return this._getInternalModelData("controlData")};m.prototype._getControlDataReduce=function(){return this._getInternalModelData("controlDataReduce")};m.prototype._getTransientData=function(){return this._getInternalModelData("transientData")};m.prototype._getAlreadyKnownRuntimeData=function(){return this._getInternalModelData("alreadyKnownRuntimeData")};m.prototype._getAlreadyKnownPersistentData=function(){return this._getInternalModelData("alreadyKnownPersistentData")};m.prototype._getVariantDataInitial=function(){return this._getInternalModelData("variantDataInitial")};m.prototype._getBeforeOpenData=function(){return this._getInternalModelData("beforeOpenData")};m.prototype._setVariantData=function(t){this._getInternalModel().setProperty("/variantData",t?u.copy(t):undefined)};m.prototype._setIsDirty=function(t){this._getInternalModel().setProperty("/isDirty",t)};m.prototype._getVariantData=function(){return this._getInternalModel().getProperty("/variantData")};m.prototype._getControllers=function(){var t={};Object.keys(this._oSettingCurrent).forEach(function(e){var n=this._oSettingCurrent[e];if(n.hasOwnProperty("controller")){t[e]=n}}.bind(this));return t};m.prototype._controllerFactory=function(t){var e=this;switch(t){case n.P13nPanelType.columns:return new a({afterColumnsModelDataChange:function(){var t=this.mEventRegistry.afterColumnsModelDataChange[0].fFunction;this.detachAfterColumnsModelDataChange(t);e._syncTableUi();this.attachAfterColumnsModelDataChange(t);e._fireChangeEvent()},beforePotentialTableChange:function(){e.fireBeforePotentialTableChange()},afterPotentialTableChange:function(){e.fireAfterPotentialTableChange()},afterPotentialModelChange:function(n){e._calculateChangeType(t,n.getParameter("json"))}});case n.P13nPanelType.sort:return new s({afterSortModelDataChange:function(){e._fireChangeEvent()},beforePotentialTableChange:function(){e.fireBeforePotentialTableChange()},afterPotentialTableChange:function(){e.fireAfterPotentialTableChange()},afterPotentialModelChange:function(n){e._calculateChangeType(t,n.getParameter("json"))}});case n.P13nPanelType.filter:return new o({afterFilterModelDataChange:function(){e._fireChangeEvent()},beforePotentialTableChange:function(){e.fireBeforePotentialTableChange()},afterPotentialTableChange:function(){e.fireAfterPotentialTableChange()},afterPotentialModelChange:function(n){e._calculateChangeType(t,n.getParameter("json"))}});case n.P13nPanelType.group:return new r({afterGroupModelDataChange:function(){e._fireChangeEvent()},beforePotentialTableChange:function(){e.fireBeforePotentialTableChange()},afterPotentialTableChange:function(){e.fireAfterPotentialTableChange()},afterPotentialModelChange:function(n){e._calculateChangeType(t,n.getParameter("json"))}});case n.P13nPanelType.dimeasure:return new l({afterDimeasureModelDataChange:function(){e._fireChangeEvent()},beforePotentialTableChange:function(){e.fireBeforePotentialTableChange()},afterPotentialTableChange:function(){e.fireAfterPotentialTableChange()},afterPotentialModelChange:function(n){e._calculateChangeType(t,n.getParameter("json"))}});case n.P13nPanelType.selection:return new h({afterSelectionModelDataChange:function(){e._fireChangeEvent()},beforePotentialTableChange:function(){e.fireBeforePotentialTableChange()},afterPotentialTableChange:function(){e.fireAfterPotentialTableChange()},afterPotentialModelChange:function(n){e._calculateChangeType(t,n.getParameter("json"))}});default:throw"Panel type '"+t+"' is not valid"}};m.prototype.getTable=function(){var t=this.getAssociation("table");if(typeof t==="string"){t=sap.ui.getCore().byId(t)}return t};m._getOrderedColumnKeys=function(t,e){var n=Object.keys(t);return e.reduce(function(t,e){if(n.indexOf(e)>-1){t.push(e)}return t},[])};m.prototype.exit=function(){var t;this._resumeTable(false);if(this._oDialog){this._oDialog.destroy();this._oDialog=null}if(this._oUIManager){this._oUIManager.destroy();this._oUIManager=null}this._oUISetting=null;this._callControllers(this._oSettingCurrent,"destroy");for(t in this._oSettingCurrent){this._oSettingCurrent[t]=null}this._oSettingCurrent=null;this._oColumnHelper=null};m.prototype._determineResetType=function(t){t=t||(this.getResetToInitialTableState()?i.personalization.ResetType.ResetFull:i.personalization.ResetType.ResetPartial);if(t===i.personalization.ResetType.ResetFull||this._getVariantData()===undefined){return i.personalization.ResetType.ResetFull}return i.personalization.ResetType.ResetPartial};m.prototype._isEqualAdditionalIgnoreColumnKeys=function(t){var e=this._callControllers(this._oSettingCurrent,"isEqualAdditionalIgnoreColumnKeys",t);var n=true;for(var i in e){n=n&&e[i]}return n};m.prototype._resetMessageStrip=function(t){for(var e in this._oSettingCurrent){var n=this._oSettingCurrent[e].controller;if(n&&n.getAdaptationUI()&&n.getAdaptationUI().isA("sap.m.p13n.BasePanel")){n.getAdaptationUI().setMessageStrip(undefined)}}};m.prototype._setShowDetails=function(t){this._callControllers(this._oSettingCurrent,"_updateInternalModelShowHide",t)};m.SyncReason={ResetFull:14,ResetPartial:15,NewModelDataMixedWithVariant:7};return m});
//# sourceMappingURL=Controller.js.map