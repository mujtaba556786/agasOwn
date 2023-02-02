/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/valuehelp/base/Container","sap/ui/mdc/valuehelp/base/DialogTab","sap/ui/mdc/util/loadModules","sap/ui/Device","sap/m/VBox","sap/m/FlexItemData","sap/ui/model/resource/ResourceModel","sap/ui/mdc/util/Common","sap/ui/mdc/enum/SelectType","sap/base/strings/formatMessage","sap/ui/core/library","sap/ui/core/InvisibleMessage"],function(e,t,n,i,o,r,a,s,l,u,h,p){"use strict";var d=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");sap.ui.getCore().attachLocalizationChanged(function(){d=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc")});var c,g,f,v,C,y;var _,m,b,T,I;var S=h.InvisibleMessageMode;var k=e.extend("sap.ui.mdc.valuehelp.Dialog",{metadata:{library:"sap.ui.mdc",interfaces:["sap.ui.mdc.valuehelp.IDialogContainer","sap.ui.core.PopupInterface"],properties:{_selectedContentKey:{type:"string",visibility:"hidden"},_quickSelectEnabled:{type:"boolean",visibility:"hidden",defaultValue:false},_selectableContents:{type:"object[]",visibility:"hidden",defaultValue:[]},groupConfig:{type:"object",defaultValue:{}}},defaultAggregation:"content"}});function M(){if(i.system.desktop){return"700px"}if(i.system.tablet){return i.orientation.landscape?"600px":"600px"}}function P(){if(i.system.desktop){return"1080px"}if(i.system.tablet){return i.orientation.landscape?"920px":"600px"}}function B(e){var t=this.getContent();return t.filter(function(t){return!!t.getVisible()&&t.getGroup&&t.getGroup()===e}).length>1}k.prototype._handleContentSelectionChange=function(e){this.fireRequestDelegateContent({container:this.getId(),contentId:e});return this._getRetrieveDelegateContentPromise().then(function(){var t=this.getProperty("_selectedContentKey");var n=this.getContent();var i=t&&n&&n.find(function(e){return e.getId()===t});if(i){if(i.setCollectiveSearchSelect){i.setCollectiveSearchSelect(undefined)}i.onHide();this._unbindContent(i)}return this._renderSelectedContent(e)}.bind(this))};k.prototype._onTabBarSelect=function(e){var t=e&&e.getParameter("key");this._handleContentSelectionChange(t)};k.prototype.invalidate=function(t){if(t){var n=this.getContent();var i=n.indexOf(t);if(this._oIconTabBar&&i!==-1&&!this._bIsBeingDestroyed){var o=this._oIconTabBar.getItems();if(o[i]){o[i].invalidate(t)}}else{e.prototype.invalidate.apply(this,arguments)}}};k.prototype._getUIAreaForContent=function(){var t=this.getAggregation("_container");if(t){return t.getUIArea()}return e.prototype._getUIAreaForContent.apply(this,arguments)};k.prototype._handleConfirmed=function(e){this.fireConfirm({close:true})};k.prototype._handleClosed=function(t){var n=this.getSelectedContent();if(n){n.onHide()}this.getContent().forEach(function(e){e.onContainerClose()});this.setProperty("_selectedContentKey",this._sInitialContentKey);e.prototype._handleClosed.apply(this,arguments)};k.prototype._getContainer=function(){if(!this.getModel("$i18n")){this.setModel(new a({bundleName:"sap/ui/mdc/messagebundle",async:false}),"$i18n")}var e=this.getAggregation("_container");if(!e){return this._retrievePromise("dialog",function(){return n(["sap/m/Dialog","sap/m/Button","sap/ui/model/base/ManagedObjectModel","sap/m/library"]).then(function(e){c=e[0];f=e[1];v=e[2];g=e[3];var t=g.ButtonType;if(!this._oResourceBundle){this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc")}this.oButtonOK=new f(this.getId()+"-ok",{text:this._oResourceBundle.getText("valuehelp.OK"),enabled:"{$valueHelp>/_valid}",type:t.Emphasized,press:this._handleConfirmed.bind(this),visible:{parts:["$valueHelp>/_config/maxConditions","$help>/_quickSelectEnabled"],formatter:function(e,t){return e!==1||!t}}});this.oButtonCancel=new f(this.getId()+"-cancel",{text:this._oResourceBundle.getText("valuehelp.CANCEL"),press:this._handleCanceled.bind(this)});this._oManagedObjectModel=new v(this);var n=new c(this.getId()+"-dialog",{contentHeight:M(),contentWidth:P(),horizontalScrolling:false,verticalScrolling:false,title:{parts:["$help>/title","$help>/_selectableContents"],formatter:function(e,t){if(t&&t.length==1){var n=t[0];var i=n.getFormattedShortTitle()?n.getFormattedShortTitle():n.getTitle();if(i){e=this._oResourceBundle.getText("valuehelp.DIALOGSHORTTITLECOLONTITLE",[i,e])}}return e}.bind(this)},stretch:i.system.phone,resizable:true,draggable:true,afterOpen:this._handleOpened.bind(this),afterClose:this._handleClosed.bind(this),buttons:[this.oButtonOK,this.oButtonCancel]});n.setModel(this._oManagedObjectModel,"$help");this.setAggregation("_container",n,true);n.isPopupAdaptationAllowed=function(){return false};n.addStyleClass("sapMdcValueHelp");n.addStyleClass("sapMdcValueHelpTitle");n.addStyleClass("sapMdcValueHelpTitleShadow");var r=new o(this.getId()+"-Content",{fitContainer:true});r.addStyleClass("sapMdcValueHelpPanel");n.addContent(r);var a=[];a.push(this._getIconTabBar(n));if(x(this.getMaxConditions(),this.getContent())){a.push(this._getTokenizerPanel())}return Promise.all(a).then(function(e){e.forEach(function(e){r.addItem(e)});return n})}.bind(this))}.bind(this))}return e};k.prototype._handleSelect=function(t){e.prototype._handleSelect.apply(this,arguments);if(this.getProperty("_quickSelectEnabled")&&this._isSingleSelect()){this.fireConfirm({close:true})}};k.prototype._observeChanges=function(t){if(t.name==="content"){var n=this.getContent();this.setProperty("_quickSelectEnabled",n&&n.every(function(e){return e.isQuickSelectSupported()}));this._updateInitialContentKey();if(t.mutation==="insert"&&!this.getProperty("_selectedContentKey")){this.setProperty("_selectedContentKey",this._sInitialContentKey)}this.setProperty("_selectableContents",this._getSelectableContents());if(x(this.getMaxConditions(),this.getContent())){var i=this.getAggregation("_container");if(i&&i.getContent()[0].getItems().length===1){Promise.all([this._getTokenizerPanel()]).then(function(e){e.forEach(function(e){i.getContent()[0].addItem(e)})})}}}e.prototype._observeChanges.apply(this,arguments)};k.prototype._updateInitialContentKey=function(){var e=this.getContent().find(function(e){return!!e.getVisible()});this._sInitialContentKey=e&&e.getId()};k.prototype.getSelectedContent=function(){var e=this.getProperty("_selectedContentKey");return this.getContent().find(function(t){return t.getId()===e})};k.prototype._getSelectableContents=function(){var e=this.getSelectedContent();var t=e&&e.getGroup&&e.getGroup();var n=e?t:"";var i=[n];return this.getContent().filter(function(t){if(!t.getVisible()){return false}var n=t.getGroup&&t.getGroup();var o=n&&B.call(this,n);if(o&&t!==e){if(i.indexOf(n)>=0){return false}else{i.push(n)}}return true}.bind(this))};k.prototype._updateGroupSelectModel=function(){if(this._oGroupSelectModel){var e=this.getSelectedContent();var t=e&&e.getGroup&&e.getGroup();var n=t?this.getContent().filter(function(e){return!!e.getVisible()&&e.getGroup&&e.getGroup()===t}):[];this._oGroupSelectModel.setData(n.reduce(function(e,t){e.entries.push({key:t.getId(),text:t.getFormattedTitle()});return e},{entries:[]}));if(this._oGroupSelect){var i=this._oGroupSelect.getSelectedItemKey();var o=n.map(function(e){return e.getId()});var r=this.getProperty("_selectedContentKey");if(o.indexOf(i)==-1||i!==r){this._oGroupSelect.setSelectedItemKey(n[0].getId())}}}};k.prototype._retrieveGroupSelect=function(){return this._retrievePromise("collectiveSearchSelect",function(){return n(["sap/ui/mdc/filterbar/vh/CollectiveSearchSelect","sap/m/VariantItem","sap/ui/model/json/JSONModel"]).then(function(e){var t=e[0];var n=e[1];var o=e[2];if(!this._oGroupSelectModel){this._oGroupSelectModel=new o}if(!this._oGroupSelect){var r=new n(this.getId()+"-collSearchItem",{key:"{$select>key}",text:"{$select>text}"});this._oGroupSelect=new t(this.getId()+"--Select",{title:"{$i18n>COL_SEARCH_SEL_TITLE}",items:{path:"$select>/entries",template:r},select:function(e){this._handleContentSelectionChange(e.getParameter("key"))}.bind(this),selectedItemKey:this.getSelectedContent().getId(),maxWidth:i.system.phone?"5em":"25rem"});this._oGroupSelect.setModel(this._oGroupSelectModel,"$select")}return this._oGroupSelect}.bind(this))}.bind(this))};k.prototype._getIconTabBar=function(e){if(!this._oIconTabBar){return this._retrievePromise("IconTabBar",function(){return n(["sap/m/IconTabBar","sap/m/IconTabFilter"]).then(function(n){C=n[0];y=n[1];var i=g.IconTabHeaderMode;this._oIconTabBar=new C(this.getId()+"-ITB",{expandable:false,upperCase:false,stretchContentHeight:true,headerMode:i.Inline,select:this._onTabBarSelect.bind(this),layoutData:new r({growFactor:1}),selectedKey:"{path: '$help>/_selectedContentKey', mode: 'OneWay'}",visible:{parts:["$help>/_selectableContents"],formatter:function(t){if(t&&t.length==1){e.removeStyleClass("sapMdcValueHelpTitleShadow")}else{e.addStyleClass("sapMdcValueHelpTitleShadow")}return true}}});this._oIconTabBar.addStyleClass("sapUiNoContentPadding");var o=this._oIconTabBar._getIconTabHeader();o.bindProperty("visible",{parts:["$help>/_selectableContents"],formatter:function(e){if(e&&e.length===1){return false}else{return true}}});var a=new y(this.getId()+"-ITF",{key:{path:"$help>id"},content:new t(this.getId()+"-DT",{content:{path:"$help>displayContent"}}),text:{parts:["$help>","$valueHelp>/conditions"],formatter:function(e,t){var n="none";if(e){var i=e.getGroup&&e.getGroup();var o=e.getCount(t,i);n=i?this._getFormattedContentGroupLabel(i,o):e.getFormattedTitle(o)}return n}.bind(this)}});this._oIconTabBar.bindAggregation("items",{path:"/_selectableContents",model:"$help",templateShareable:false,template:a});return this._oIconTabBar}.bind(this))}.bind(this))}return this._oIconTabBar};k.prototype._getFormattedContentGroupLabel=function(e,t){var n=this.getGroupConfig();var i=n&&n[e];var o=i&&(t?i.label:i.nnLabel);o=o&&u(o,t?t:"");o=o||this._oResourceBundle.getText(t?"valuehelp.SELECTFROMLIST":"valuehelp.SELECTFROMLISTNONUMBER",t);return o};k.prototype._getTokenizerPanel=function(e){if(!this.oTokenizerPanel){return this._retrievePromise("TokenizerPanel",function(){return n(["sap/m/Panel","sap/m/HBox","sap/m/VBox","sap/ui/mdc/field/FieldMultiInput","sap/m/Token","sap/ui/model/Filter","sap/ui/mdc/field/ConditionType"]).then(function(e){_=e[0];m=e[1];o=e[2];b=e[3];T=e[4];I=e[5];var t=e[6];var n=g.BackgroundDesign;var i=g.ButtonType;this.oTokenizerPanel=new _(this.getId()+"-TokenPanel",{backgroundDesign:n.Transparent,expanded:true,visible:{parts:["$valueHelp>/_config/maxConditions","$help>/content"],formatter:x},headerText:{parts:["$valueHelp>/conditions","$help>/_selectableContents"],formatter:function(e,t){var n=0;for(var i=0;i<e.length;i++){var o=e[i];if(o.isEmpty!==true){n++}}var r;if(t&&t.length==1){r=t[0].getFormattedTokenizerTitle(n);return r}else{r=this._oResourceBundle.getText("valuehelp.TOKENIZERTITLE");if(n===0){r=this._oResourceBundle.getText("valuehelp.TOKENIZERTITLENONUMBER")}return u(r,n)}}.bind(this)}});this.oTokenizerPanel.addStyleClass("sapMdcTokenizerPanel");var a=new m(this.getId()+"-TokenBox",{fitContainer:true,width:"100%"});var s=E.call(this);this._oConditionType=new t(s);this._oConditionType._bVHTokenizer=true;this.oTokenizer=new b(this.getId()+"-Tokenizer",{width:"100%",showValueHelp:false,editable:true,ariaAttributes:{role:"listbox",aria:{readonly:true,roledescription:this._oResourceBundle.getText("valuehelp.TOKENIZER_ARIA_ROLE_DESCRIPTION")}},tokenUpdate:function(e){if(e.getParameter("removedTokens")){var t=e.getParameter("removedTokens");var n=this.getModel("$valueHelp").getObject("/conditions");var i=[];t.forEach(function(e,t){var o=e.getBindingContext("$valueHelp").sPath;var r=parseInt(o.slice(o.lastIndexOf("/")+1));i.push(n[r])});this.fireSelect({type:l.Remove,conditions:i})}}.bind(this),layoutData:new r({growFactor:1,maxWidth:"calc(100% - 2rem)"})});this.oTokenizer._setValueVisible=function(e){this.$("inner").css("opacity","0")};var h=this.oTokenizer.onAfterRendering;this.oTokenizer.onAfterRendering=function(){h.apply(this.oTokenizer,arguments);this.oTokenizer._setValueVisible();this.oTokenizer.setValue("")}.bind(this);w.call(this,true);this.oRemoveAllBtn=new f(this.getId()+"-TokenRemoveAll",{press:function(e){this.fireSelect({type:l.Set,conditions:[]});this.oInvisibleMessage.announce(d.getText("valuehelp.REMOVEALLTOKEN_ANNOUNCE"),S.Polite)}.bind(this),type:i.Transparent,icon:"sap-icon://decline",tooltip:"{$i18n>valuehelp.REMOVEALLTOKEN}",layoutData:new r({growFactor:0,baseSize:"2rem"})});this.oRemoveAllBtn.addStyleClass("sapUiTinyMarginBegin");a.addItem(this.oTokenizer);a.addItem(this.oRemoveAllBtn);this.oTokenizerPanel.addContent(a);return this.oTokenizerPanel}.bind(this))}.bind(this))}else{var t=E.call(this);this._oConditionType.setFormatOptions(t)}return this.oTokenizerPanel};function x(e,t){var n=e!==1;if(n&&t&&t.every(function(e){return!e.getRequiresTokenizer()})){n=false}return n}function E(){var e=this.getModel("$valueHelp");var t=e?e.getProperty("/_config"):{};var n=this.getParent();var i=this.getControl();return{maxConditions:-1,valueType:t.dataType,operators:t.operators,display:t.display,fieldHelpID:n&&n.getId(),control:i,delegate:i&&i.getControlDelegate&&i.getControlDelegate(),delegateName:i&&i.getDelegate&&i.getDelegate()&&i.getDelegate().name,payload:i&&i.getPayload&&i.getPayload(),convertWhitespaces:true}}function w(e){if(this.oTokenizer){var t=this.oTokenizer.getBindingInfo("tokens");if(e){if(!t){var n=new I({path:"isEmpty",operator:"NE",value1:true});this._oConditionType.setFormatOptions(E.call(this));var i=new T(this.getId()+"-Token",{text:{path:"$valueHelp>",type:this._oConditionType}});this.oTokenizer.bindAggregation("tokens",{path:"/conditions",model:"$valueHelp",templateShareable:false,template:i,filters:n})}}else if(t){this.oTokenizer.unbindAggregation("tokens")}}}k.prototype._open=function(e){this._mAlreadyShownContents={};if(e){this._updateInitialContentKey();var t=function(){this._renderSelectedContent(this._sInitialContentKey,function(){e.open();this.getContent().forEach(function(e){e.onContainerOpen()})}.bind(this))}.bind(this);if(x(this.getMaxConditions(),this.getContent())&&e.getContent()[0].getItems().length===1){Promise.all([this._getTokenizerPanel()]).then(function(n){n.forEach(function(t){e.getContent()[0].addItem(t)});t()})}else{if(this.oTokenizer){w.call(this,true)}t()}}};k.prototype._renderSelectedContent=function(e,t){var n=this.getContent().find(function(t){return t.getId()===e});if(!n){throw new Error("sap.ui.mdc.ValueHelp: No content found.")}var i=[n.getContent()];var o=n.getGroup&&n.getGroup();var r;if(o&&B.call(this,o)){r=this._retrieveGroupSelect();i.push(r)}var a=!this._mAlreadyShownContents[e];return Promise.all(i).then(function(){this._bindContent(n)}.bind(this)).then(function(){return Promise.resolve(n.onBeforeShow(a))}).then(function(){this._mAlreadyShownContents[e]=true;this.setProperty("_selectedContentKey",e);this.setProperty("_selectableContents",this._getSelectableContents());this._oManagedObjectModel.checkUpdate(true,false,function(e){if(e.getPath()==="displayContent"){return true}});if(r){this._updateGroupSelectModel()}if(n.setCollectiveSearchSelect){n.setCollectiveSearchSelect(r?this._oGroupSelect:undefined)}if(t){t()}return this._retrievePromise("open").then(function(){n.onShow(a);return n})}.bind(this))};k.prototype._close=function(){var e=this.getAggregation("_container");if(e){e.close();if(this.oTokenizer){w.call(this,false)}}};k.prototype.getValueHelpIcon=function(){return"sap-icon://value-help"};k.prototype.getAriaAttributes=function(e){return{contentId:null,ariaHasPopup:"dialog",role:null,roleDescription:null}};k.prototype.isMultiSelect=function(){return this.getMaxConditions()!==1};k.prototype.init=function(){e.prototype.init.apply(this,arguments);this.oInvisibleMessage=p.getInstance()};k.prototype.exit=function(){s.cleanup(this,["_oManagedObjectModel","_oResourceBundle","oButtonOK","oButtonCancel","oTokenizerPanel","oTokenizer","_oIconTabBar","_oGroupSelect","_oGroupSelectModel","_sInitialContentKey","_mAlreadyShownContents","oInvisibleMessage"]);e.prototype.exit.apply(this,arguments)};return k});
//# sourceMappingURL=Dialog.js.map