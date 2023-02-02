/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/m/VariantManagement","sap/ui/core/Control","sap/ui/core/library","sap/ui/model/base/ManagedObjectModel","sap/base/Log"],function(t,e,a,r,i){"use strict";var n=a.TitleLevel;var o=e.extend("sap.ui.comp.smartvariants.SmartVariantManagementBase",{metadata:{interfaces:["sap.m.IOverflowToolbarContent"],library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartvariants/SmartVariantManagementBase.designtime",properties:{enabled:{type:"boolean",group:"Misc",defaultValue:true},defaultVariantKey:{type:"string",group:"Misc",defaultValue:null},selectionKey:{type:"string",group:"Misc",defaultValue:null},showCreateTile:{type:"boolean",group:"Misc",defaultValue:false},showExecuteOnSelection:{type:"boolean",group:"Misc",defaultValue:false},showShare:{type:"boolean",group:"Misc",defaultValue:false},showSetAsDefault:{type:"boolean",group:"Misc",defaultValue:true},standardItemText:{type:"string",group:"Misc",defaultValue:null},useFavorites:{type:"boolean",group:"Misc",defaultValue:false},inErrorState:{type:"boolean",group:"Misc",defaultValue:false},variantCreationByUserAllowed:{type:"boolean",group:"Misc",defaultValue:true},standardItemAuthor:{type:"string",group:"Misc",defaultValue:"SAP"},displayTextForExecuteOnSelectionForStandardVariant:{type:"string",group:"Misc",defaultValue:""},headerLevel:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:n.Auto},titleStyle:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:n.Auto},initialSelectionKey:{type:"string",group:"Misc",defaultValue:null},lifecycleSupport:{type:"boolean",group:"Misc",defaultValue:false},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"}},events:{save:{parameters:{name:{type:"string"},overwrite:{type:"boolean"},key:{type:"string"},exe:{type:"boolean"},def:{type:"boolean"},global:{type:"boolean"}}},manage:{parameters:{renamed:{type:"object[]"},deleted:{type:"string[]"},exe:{type:"object[]"},def:{type:"string"}}},select:{parameters:{key:{type:"string"}}}},defaultAggregation:"variantItems",aggregations:{_embeddedVM:{type:"sap.m.VariantManagement",multiple:false,visibility:"hidden"},variantItems:{type:"sap.ui.comp.variants.VariantItem",multiple:true,forwarding:{getter:"_getEmbeddedVM",aggregation:"items"}}}},renderer:{apiVersion:2,render:function(t,e){t.openStart("div",e);t.style("max-width",e.getMaxWidth());t.openEnd();t.renderControl(e._oVM);t.close("div")}}});o.prototype.init=function(){e.prototype.init.apply(this);this.STANDARDVARIANTKEY="*standard*";this._sStdKey=this.STANDARDVARIANTKEY;this.addStyleClass("sapUiCompVarMngmt");this.oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");this._oVM=new t(this.getId()+"-vm");this.setAggregation("_embeddedVM",this._oVM,true);this._oManagedObjectModel=new r(this);this.setModel(this._oManagedObjectModel,"$compSmartVariants");this._oVM.attachManage(this._fireManage,this);this._oVM.attachSave(this._fireSave,this);this._oVM.attachSelect(this._fireSelect,this);this._oVM.attachCancel(this._fireCancel,this);this._oVM.attachManageCancel(this._fireManageCancel,this);this.setDefaultVariantKey(this.getStandardVariantKey());this.setPopoverTitle(this.oResourceBundle.getText("VARIANT_MANAGEMENT_VARIANTS"));this._bindProperties()};o.prototype._bindProperties=function(t){this._oVM.bindProperty("defaultKey",{path:"/defaultVariantKey",model:"$compSmartVariants"});this._oVM.bindProperty("creationAllowed",{path:"/variantCreationByUserAllowed",model:"$compSmartVariants"});this._oVM.bindProperty("selectedKey",{path:"/selectionKey",model:"$compSmartVariants"});this._oVM.bindProperty("supportPublic",{path:"/showShare",model:"$compSmartVariants"});this._oVM.bindProperty("supportDefault",{path:"/showSetAsDefault",model:"$compSmartVariants"});this._oVM.bindProperty("supportApplyAutomatically",{path:"/showExecuteOnSelection",model:"$compSmartVariants"});this._oVM.bindProperty("supportFavorites",{path:"/useFavorites",model:"$compSmartVariants"});this._oVM.bindProperty("displayTextForExecuteOnSelectionForStandardVariant",{path:"/displayTextForExecuteOnSelectionForStandardVariant",model:"$compSmartVariants"});this._oVM.bindProperty("level",{path:"/headerLevel",model:"$compSmartVariants"});this._oVM.bindProperty("titleStyle",{path:"/titleStyle",model:"$compSmartVariants"})};o.prototype._getEmbeddedVM=function(){return this._oVM};o.prototype.setShowCreateTile=function(t){this.setProperty("showCreateTile",t);this._oVM._setShowCreateTile(t);return this};o.prototype.getShowCreateTile=function(){return this._oVM._getShowCreateTile()};o.prototype._assignUser=function(t,e){var a=this._oVM._getItemByKey(t);if(a&&!a.getAuthor()){a.setAuthor(e)}};o.prototype.setSelectionKey=function(t){this.setProperty("selectionKey",t);return this};o.prototype.setInitialSelectionKey=function(t){return this.setSelectionKey(t)};o.prototype.getInitialSelectionKey=function(){return this.getSelectionKey()};o.prototype.currentVariantGetModified=function(){return this.getModified()};o.prototype.currentVariantSetModified=function(t){this.setModified(t)};o.prototype._getIdxSorted=function(t){var e=this.getVariantItems();var a=t.toUpperCase();var r=e.findIndex(function(t,e){if(e>0){if(t.getTitle().toUpperCase()>a){return true}}return false});return r>-1?r:e.length};o.prototype._reorderList=function(t){var e=this.getItemByKey(t);if(e){this._destroyManageDialog();this.removeVariantItem(e);var a=this._getIdxSorted(e.getTitle());this.insertVariantItem(e,a)}};o.prototype._getInternalVM=function(){return this.getAggregation("_embeddedVM")};o.prototype.getItemByKey=function(t){var e=this.getVariantItems();for(var a=0;a<e.length;a++){if(t==e[a].getKey()){return e[a]}}return null};o.prototype._determineStandardVariantName=function(){var t=this.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD");if(this.getStandardVariantKey()===this.STANDARDVARIANTKEY&&this.getStandardItemText()){t=this.getStandardItemText()}return t};o.prototype.setStandardVariantKey=function(t){this._sStdKey=t};o.prototype.getStandardVariantKey=function(){var t=this._oVM.getStandardVariantKey();return t?t:this._sStdKey};o.prototype.getOverflowToolbarConfig=function(){return{canOverflow:false,invalidationEvents:["save","manage","select"]}};o.prototype._prepareSaveAsKeyUserData=function(t){try{this._getContentAsync().then(function(e){var a={default:t.def,executeOnSelection:t.execute,type:this._getPersoControllerType(),text:t.name,contexts:t.contexts,content:e};this._fGetDataForKeyUser(a);this._cleanUpSaveForKeyUser()}.bind(this))}catch(t){i.error("'_prepareSaveAsKeyUserData' throws an exception:"+t.message);this._fGetDataForKeyUser();this._cleanUpSaveForKeyUser()}};o.prototype._fireCancel=function(t){if(this._fGetDataForKeyUser){this._fGetDataForKeyUser();this._cleanUpSaveForKeyUser()}};o.prototype._fireManageCancel=function(t){if(this._fGetDataForKeyUser){this._fGetDataForKeyUser();this._cleanUpManageViewsForKeyUser()}};o.prototype._fireSelect=function(t){if(!this._fGetDataForKeyUser){this.setModified(false)}this.fireSelect(t.getParameters())};o.prototype._fireSave=function(t){var e=t.getParameters();if(this._fGetDataForKeyUser){this._prepareSaveAsKeyUserData(e);return}if(e.hasOwnProperty("execute")){e.exe=e.execute}if(e.hasOwnProperty("public")){e.global=e.public}this.fireSave(e)};o.prototype._prepareManageKeyUserData=function(t){var e={};var a=false;if(t.hasOwnProperty("def")){var r=t.def;if(r!==this._oVM._sOriginalDefaultKey){e.default=r}}if(t.hasOwnProperty("deleted")){t.deleted.forEach(function(t){if(!e[t]){e[t]={}}e[t].deleted=true;if(this.getSelectionKey()===t){a=true}}.bind(this))}if(t.hasOwnProperty("exe")){t.exe.forEach(function(t){if(!e[t.key]){e[t.key]={}}e[t.key].executeOnSelection=t.exe})}if(t.hasOwnProperty("fav")){t.fav.forEach(function(t){if(!e[t.key]){e[t.key]={}}e[t.key].favorite=t.visible})}if(t.hasOwnProperty("renamed")){t.renamed.forEach(function(t){if(!e[t.key]){e[t.key]={}}e[t.key].name=t.name})}if(t.hasOwnProperty("contexts")){t.contexts.forEach(function(t){if(!e[t.key]){e[t.key]={}}e[t.key].contexts=t.contexts})}if(a){this.activateVariant(this.getStandardVariantKey())}this._fGetDataForKeyUser(e);this._cleanUpManageViewsForKeyUser()};o.prototype._syncOriginalProperties=function(t){if(t.fav){t.fav.forEach(function(t){var e=this._oVM._getItemByKey(t.key);if(e){e.setOriginalFavorite(t.visible)}}.bind(this))}if(t.renamed){t.renamed.forEach(function(t){var e=this._oVM._getItemByKey(t.key);if(e){e.setTitle(t.name);e.setOriginalTitle(t.name);e.setText(t.name)}}.bind(this))}if(t.exe){t.exe.forEach(function(t){var e=this._oVM._getItemByKey(t.key);if(e){e.setOriginalExecuteOnSelect(t.exe)}}.bind(this))}if(t.contexts){t.contexts.forEach(function(t){var e=this._oVM._getItemByKey(t.key);if(e){e.setOriginalContexts(t.contexts)}}.bind(this))}};o.prototype._fireManage=function(t){var e=t.getParameters();if(this._fGetDataForKeyUser){this._prepareManageKeyUserData(e)}else{this.fireManage(e);this._syncOriginalProperties(e)}};o.prototype.getFocusDomRef=function(){if(this._oVM){return this._oVM.oVariantPopoverTrigger.getFocusDomRef()}return null};o.prototype.getManageDialog=function(){if(this._oVM){return this._oVM.oManagementDialog}return null};o.prototype.getVariants=function(){return this._oVM.getItems()};o.prototype.getTitle=function(){return this._oVM.getTitle()};o.prototype.setPopoverTitle=function(t){return this._oVM.setPopoverTitle(t)};o.prototype.setEditable=function(t){this.setProperty("editable",t);return this._oVM.setShowFooter(t)};o.prototype.setShowExecuteOnSelection=function(t){this.setProperty("showExecuteOnSelection",t);this._oVM.setSupportApplyAutomatically(t);return this};o.prototype.setShowSetAsDefault=function(t){this.setProperty("showSetAsDefault",t);this._oVM.setSupportDefault(t);return this};o.prototype.setExecuteOnSelectionForStandardDefault=function(t){this.setProperty("executeOnSelectionForStandardDefault",t);this._oVM.setExecuteOnSelectionForStandardDefault(t);return this};o.prototype.setDisplayTextForExecuteOnSelectionForStandardVariant=function(t){this.setProperty("displayTextForExecuteOnSelectionForStandardVariant",t);this._oVM.setDisplayTextForExecuteOnSelectionForStandardVariant(t);return this};o.prototype.setInErrorState=function(t){this.setProperty("inErrorState",t);this._oVM.setInErrorState(t);return this};o.prototype.getInErrorState=function(){return this._oVM.getInErrorState()};o.prototype._updateLayerSpecificInformations=function(){this.getVariants().forEach(function(t){var e=this._getVariantById(t.getKey());if(e){t.setRemove(e.isDeleteEnabled(this._sLayer));t.setRename(e.isRenameEnabled(this._sLayer))}}.bind(this))};o.prototype.setEditable=function(t){this._oVM.setProperty("showFooter",t);return this};o.prototype.setCurrentVariantKey=function(t){this._oVM.setSelectedKey(t)};o.prototype.getCurrentVariantKey=function(){return this._oVM.getSelectedKey()};o.prototype.getModified=function(){return this._oVM.getModified()};o.prototype.setModified=function(t){this._oVM.setModified(t)};o.prototype._enableManualVariantKey=function(t){this._oVM._setShowManualVariantKey(t)};o.prototype.refreshTitle=function(){this._oVM.refreshTitle()};o.prototype.registerApplyAutomaticallyOnStandardVariant=function(t){this._fRegisteredApplyAutomaticallyOnStandardVariant=t;return this};o.prototype.getApplyAutomaticallyOnVariant=function(t){var e=t.executeOnSelect;if(this._fRegisteredApplyAutomaticallyOnStandardVariant&&this.getDisplayTextForExecuteOnSelectionForStandardVariant()&&t.key===this._oVM.getStandardVariantKey()){try{e=this._fRegisteredApplyAutomaticallyOnStandardVariant(t)}catch(t){i.error("callback for determination of apply automatically on standard variant failed")}}return e};o.prototype.getPersonalizableControlPersistencyKey=function(){if(this.isPageVariant()){return this.getPersistencyKey()}var t=this._getAllPersonalizableControls();if(t&&t.length===1){return this._getControlPersKey(t[0])}return null};o.prototype.addVariant=function(t,e){this._createVariantItem(t);if(e){this.setDefaultVariantId(t.getVariantId())}};o.prototype.removeVariant=function(t){if(t.variantId){var e=this.getItemByKey(t.variantId);if(e){this.removeVariantItem(e);e.destroy()}delete this._mVariants[t.variantId]}if(t.previousVariantId){this.activateVariant(t.previousVariantId)}if(t.previousDefault){this.setDefaultVariantId(t.previousDefault)}};o.prototype.removeWeakVariant=function(t){if(t.variantId){var e=this.getItemByKey(t.variantId);if(e){this.removeVariantItem(e);e.destroy()}delete this._mVariants[t.variantId]}if(t.previousVariantId){this.setInitialSelectionKey(t.previousVariantId)}if(t.previousDirtyFlag){this.setModified(t.previousDirtyFlag)}if(t.previousDefault){this.setDefaultVariantId(t.previousDefault)}};o.prototype.updateVariant=function(t){var e;if(t){e=this.getItemByKey(t.getVariantId());if(e){e.setExecuteOnSelection(t.getExecuteOnSelection());e.setExecuteOnSelect(t.getExecuteOnSelection());e.setOriginalExecuteOnSelect(t.getExecuteOnSelection());e.setFavorite(t.getFavorite());e.setOriginalFavorite(t.getFavorite());e.setTitle(t.getText("variantName"));e.setOriginalTitle(t.getText("variantName"));e.setText(t.getText("variantName"));if(t.getContexts){e.setContexts(t.getContexts());e.setOriginalContexts(t.getContexts())}}}};o.prototype.activateVariant=function(t){this.setCurrentVariantKey(t);this.setModified(false);this.fireSelect({key:t})};o.prototype.getAllVariants=function(){var t=this._oVM.getItems();if(!t||t.length<1){return[]}var e=[];t.forEach(function(t){if(t.getVisible()){e.push(this._getVariantById(t.getKey()))}}.bind(this));return e};o.prototype.getDefaultVariantId=function(){return this.getDefaultVariantKey()};o.prototype.setDefaultVariantId=function(t){this.setDefaultVariantKey(t)};o.prototype.getPresentVariantId=function(){return this.getCurrentVariantId()?this.getCurrentVariantId():this.STANDARDVARIANTKEY};o.prototype.getPresentVariantText=function(){return this._oVM.getSelectedVariantText(this.getPresentVariantId())};o.prototype.getPresentVariantContent=function(){return this._getContentAsync()};o.prototype._getPersoController=function(){return this._oPersoControl};o.prototype._getPersoControllerType=function(){if(this.isPageVariant()){return"page"}var t=this._getAllPersonalizableControls();if(t&&t.length===1){return t[0].type}return null};o.prototype._isDuplicateSaveAs=function(t){var e=t.trim();if(!e){return true}var a=this._determineStandardVariantName();if(a===e){return true}var r=this.getVariants();for(var i=0;i<r.length;i++){a=r[i].getText().trim();if(a===e){return true}}return false};o.prototype.isNameDuplicate=function(t){var e=t.trim();return this._isDuplicateSaveAs(e)};o.prototype.isNameTooLong=function(e){var a=e.trim();return a.length>t.MAX_NAME_LEN};o.prototype.setStandardItemText=function(t){this.setProperty("standardItemText",t);return this};o.prototype._executeOnSelectForStandardVariantByXML=function(t){this.bExecuteOnSelectForStandardViaXML=t};o.prototype.getExecuteOnSelectForStandardVariant=function(){var t=false;var e=this.getItemByKey(this.getStandardVariantKey());if(e){t=e.getExecuteOnSelection()}return t||this.bExecuteOnSelectForStandardViaXML};o.prototype._reapplyExecuteOnSelectForStandardVariantItem=function(t){var e=this.getStandardVariantKey();if(this._oVM){var a=this._oVM._getItemByKey(e);if(a){a.setExecuteOnSelect(t);a.setOriginalExecuteOnSelect(t)}}};o.prototype.openManageViewsDialogForKeyUser=function(t,e,a){this._sLayer=t.layer;this._fGetDataForKeyUser=e;this._updateLayerSpecificInformations();var r=true;if(a){r=false}this._oVM.openManagementDialog(r,t.rtaStyleClass,t.contextSharingComponentContainer)};o.prototype.openSaveAsDialogForKeyUser=function(t,e,a){this._fGetDataForKeyUser=e;this._oVM.openSaveAsDialog(t,a)};o.prototype._cleanUpSaveForKeyUser=function(){if(this._oRolesComponentContainer){this.oSaveDialog.removeContent(this._oRolesComponentContainer)}this._cleanUpKeyUser()};o.prototype._destroyManageDialog=function(){if(this._oVM){this._oVM.destroyManageDialog()}};o.prototype._cleanUpManageViewsForKeyUser=function(){this._destroyManageDialog();this._cleanUpKeyUser()};o.prototype._cleanUpKeyUser=function(){this.setShowShare(this._bShowShare);this._fGetDataForKeyUser=null;this._sLayer=null;this._oRolesComponentContainer=null};o.prototype._getContentAsync=function(){return Promise.resolve(this._fetchContentAsync())};o.prototype._checkUpdate=function(){this._oVM.getModel("$mVariants").checkUpdate(true)};o.prototype.setDesignTimeMode=function(t){return this._oVM.setShowFooter(!t)};o.prototype.exit=function(){this._oVM.detachManage(this._fireManage,this);this._oVM.detachSelect(this._fireSelect,this);this._oVM.detachSave(this._fireSave,this);this._oVM.detachCancel(this._fireCancel,this);this._oVM.detachManageCancel(this._fireManageCancel,this);if(this._oManagedObjectModel){this._oManagedObjectModel.destroy();this._oManagedObjectModel=undefined}e.prototype.exit.apply(this,arguments);this._oVM=undefined;this._fRegisteredApplyAutomaticallyOnStandardVariant=null;this.oResourceBundle=undefined};return o});
//# sourceMappingURL=SmartVariantManagementBase.js.map