/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/editor/fields/BaseField","sap/m/Input","sap/m/Text","sap/m/Title","sap/m/Select","sap/m/ComboBox","sap/m/Popover","sap/m/Button","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/ui/core/ListItem","sap/m/List","sap/m/CustomListItem","sap/m/VBox","sap/base/util/each","sap/base/util/restricted/_debounce","sap/ui/core/Core","sap/ui/model/json/JSONModel","sap/ui/integration/editor/EditorResourceBundles","sap/base/util/deepClone","sap/ui/model/Sorter","sap/m/GroupHeaderListItem","sap/ui/core/CustomData"],function(e,t,a,n,s,r,i,l,u,o,g,p,d,c,v,h,f,_,T,I,P,y,L){"use strict";var S=/parameters\.([^\}\}]+)/g;var m=["TODAY_ISO","NOW_ISO","LOCALE"];var O=e.extend("sap.ui.integration.editor.fields.StringField",{metadata:{library:"sap.ui.integration"},renderer:e.getMetadata().getRenderer()});O.prototype.initVisualization=function(e){var n=e.visualization;if(!n){var i=e.value?e.value.match(S):undefined;var l,u,o;if(i&&i.length>0){i=i.filter(function(e){var t=e.substring(11);return!m.includes(t)})}if(i&&i.length>0){l=i.map(function(e){if(this.isOrigLangField){return"items>"+e.substring(11)+"/_language/value"}return"items>"+e.substring(11)+"/value"}.bind(this));l.unshift("currentSettings>value");u={parts:l,formatter:function(e){var t=Array.prototype.slice.call(arguments,1);for(var a=0;a<t.length;a++){if(t[a]){e=e.replaceAll("{{"+i[a]+"}}",t[a])}}return e}};o=function(e){var t=e.getSource().getValue();var a=this.getBindingContext("currentSettings").sPath;this._settingsModel.setProperty(a+"/value",t);var n=this._settingsModel.getBindings();var s=a.substring(a.lastIndexOf("/")+1);v(n,function(e,t){if(t.sPath==="/form/items/"+s+"/value"){t.checkUpdate(true)}})}.bind(this)}if(this.getMode()==="translation"){if(e.editable){n={type:t,settings:{value:{path:"currentSettings>value"},tooltip:{path:"currentSettings>value"},editable:e.editable,visible:e.visible,placeholder:e.placeholder}}}else{n={type:a,settings:{text:{path:"currentSettings>value"},tooltip:{path:"currentSettings>value"},visible:e.visible,wrapping:false}}}}else if(e.enum){var p=new g({key:{path:"currentSettings>"},text:{path:"currentSettings>"}});n={type:s,settings:{selectedKey:{path:"currentSettings>value"},forceSelection:false,editable:e.editable,visible:e.visible,showSecondaryValues:false,width:"100%",items:{path:"currentSettings>enum",template:p}}}}else if(e.values){var p=this.formatListItem(e.values.item);if(!e.values.item.key){e.values.item.key=e.values.item.text}n={type:r,settings:{busy:{path:"currentSettings>_loading"},selectedKey:{path:"currentSettings>value"},editable:e.editable,visible:e.visible,showSecondaryValues:true,width:"100%",items:{path:"",template:p}}};if(this.isFilterBackend()){n.settings.selectedKey={parts:["currentSettings>value","currentSettings>suggestValue"],formatter:function(e,t){if((!e||e==="")&&t){return t.replaceAll("''","'")}else{return e}}}}}else if(this.getMode()!=="translation"&&e.translatable){n={type:t,settings:{value:{path:"currentSettings>value"},tooltip:{path:"currentSettings>value"},editable:e.editable,visible:e.visible,placeholder:e.placeholder,valueHelpIconSrc:"sap-icon://translate",showValueHelp:true,valueHelpRequest:this.openTranslationListPopup,change:function(t){var a=t.getSource();var n=a.getValue();var s=f.getConfiguration().getLanguage().replaceAll("_","-");a.getParent().setTranslationValueInTexts(s,e.manifestpath,n)}}};if(l){delete n.settings.tooltip;n.settings.value=u;n.settings.change=o;n.settings.showValueHelp=false;delete n.settings.valueHelpRequest}}else{n={type:t,settings:{value:{path:"currentSettings>value"},tooltip:{path:"currentSettings>value"},editable:e.editable,visible:e.visible,placeholder:e.placeholder}};if(l){delete n.settings.tooltip;n.settings.value=u;n.settings.change=o}}}else if(n.type==="TextArea"){n.type="sap/m/TextArea"}this._visualization=n;this.attachAfterInit(this._afterInit)};O.prototype._afterInit=function(){var e=this.getAggregation("_field");if(e instanceof r){if(this.isFilterBackend()){this.onInput=h(this.onInput,500);e.oninput=this.onInput.bind(this);e.attachSelectionChange(this.onSelectionChange.bind(this))}}};O.prototype.onSelectionChange=function(e){var t=e.getParameter("selectedItem")||{};var a=t.getKey();var n=this.getBindingContext("currentSettings").sPath;this._settingsModel.setProperty(n+"/value",a)};O.prototype.onInput=function(e){var t=e.target.value;var a=this.getBindingContext("currentSettings").sPath;this._settingsModel.setProperty(a+"/suggestValue",t.replaceAll("'","''"));this._settingsModel.setProperty(a+"/_loading",true);this._settingsModel.setProperty(a+"/value","");var n=this._settingsModel.getBindings();var s=a.substring(a.lastIndexOf("/")+1);v(n,function(e,t){if(t.sPath==="/form/items/"+s+"/value"){t.checkUpdate(true)}});var r=e.srcControl;r.open();r.setValue(t);r.setSelection(null)};O.prototype.getOriginTranslatedValues=function(e){var t=[];var a=T.getInstance();var n;if(e._translatedDefaultPlaceholder&&e._translatedDefaultPlaceholder.startsWith("{i18n>")&&e._translatedDefaultPlaceholder.endsWith("}")){n=e._translatedDefaultPlaceholder.substring(6,e._translatedDefaultPlaceholder.length-1)}else if(e._translatedDefaultPlaceholder&&e._translatedDefaultPlaceholder.startsWith("{{")&&e._translatedDefaultPlaceholder.endsWith("}}")){n=e._translatedDefaultPlaceholder.substring(2,e._translatedDefaultPlaceholder.length-2)}for(var s in a){var r=a[s];var i="";var l="";if(n&&r){var u=r.resourceBundle&&r.resourceBundle.getText(n,[],true);if(u!==undefined){i=u;l=u}else{i=e._translatedValue||"";l=e._translatedValue||""}}else{i=e._translatedDefaultPlaceholder||"";l=e._translatedDefaultPlaceholder||""}var o={key:s,desription:r.language,value:i,originValue:l,editable:true};t.push(o)}return t};O.prototype.getTranslationValueInTexts=function(e,t){var a="/texts/"+e;var n=this._settingsModel.getProperty(a)||{};return n[t]};O.prototype.setTranslationValueInTexts=function(e,t,a){var n="/texts";var s=this._settingsModel.getData();if(!s){return}if(!s.hasOwnProperty("texts")){var r={};r[e]={};r[e][t]=a;this._settingsModel.setProperty(n,r)}else{n="/texts/"+e;var i;if(!s.texts.hasOwnProperty(e)){i={}}else{i=s.texts[e]}i[t]=a;this._settingsModel.setProperty(n,i)}};O.prototype.openTranslationListPopup=function(e){var s=this;var r=e.getSource();var g=r.getParent();var v=g.getConfiguration();if(!s._aOriginTranslatedValues){s._aOriginTranslatedValues=g.getOriginTranslatedValues(v)}var h=I(s._aOriginTranslatedValues,500);var f=g.getResourceBundle();h.forEach(function(e){var t=g.getTranslationValueInTexts(e.key,v.manifestpath);if(t){e.value=t;if(Array.isArray(s._aUpdatedLanguages)&&!s._aUpdatedLanguages.includes(e.key)){e.originValue=e.value}}else if(v._beforeLayerChange){e.value=v._beforeLayerChange;if(Array.isArray(s._aUpdatedLanguages)&&!s._aUpdatedLanguages.includes(e.key)){e.originValue=e.value}}e.status=f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_LISTITEM_GROUP_NOTUPDATED");if(e.key===f.sLocale.replaceAll("_","-")){e.editable=false}});var T={currentLanguage:{},isUpdated:false,translatedLanguages:[]};var y;if(h){h.forEach(function(e){if(Array.isArray(s._aUpdatedLanguages)&&s._aUpdatedLanguages.includes(e.key)){e.value=g.getTranslationValueInTexts(e.key,v.manifestpath);e.status=f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_LISTITEM_GROUP_UPDATED")}if(e.key===f.sLocale.replaceAll("_","-")){e.value=r.getValue();T.currentLanguage=e}else{T.translatedLanguages.push(e)}})}var S=g.getPopoverPlacement(r._oValueHelpIcon);if(!s._oTranslationPopover){var m=new p({items:{path:"languages>/translatedLanguages",template:new d({content:[new c({items:[new a({text:"{languages>desription}"}),new t({value:"{languages>value}",editable:"{languages>editable}"})]})],customData:[new L({key:"{languages>key}",value:"{languages>desription}"})]}),sorter:[new P({path:"status",descending:true,group:true})],groupHeaderFactory:g.getGroupHeader}});s._oTranslationPopover=new i({placement:S,contentWidth:"300px",contentHeight:"345px",customHeader:new c({items:[new n({text:f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_TITLE")}).addStyleClass("sapMPopoverTitle"),new n({text:f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_CURRENTLANGUAGE")}).addStyleClass("sapMHeaderTitle"),new c({items:[new a({text:"{languages>/currentLanguage/desription}"}),new t({value:"{languages>/currentLanguage/value}",editable:false})]}).addStyleClass("sapMCurrentLanguageVBox"),new n({text:f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_OTHERLANGUAGES")}).addStyleClass("sapMHeaderTitle")]}),content:m,footer:new u({content:[new o,new l({type:"Emphasized",text:f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_BUTTON_SAVE"),enabled:"{languages>/isUpdated}",press:function(){var e=s._oTranslationPopover.getModel("languages").getData();var t=[];e.translatedLanguages.forEach(function(e){if(e.value!==e.originValue){g.setTranslationValueInTexts(e.key,v.manifestpath,e.value);t.push(e.key)}});if(e.currentLanguage.value!=e.currentLanguage.originValue){g.setTranslationValueInTexts(e.currentLanguage.key,v.manifestpath,e.currentLanguage.value);t.push(e.currentLanguage.key)}if(t.length>0){s._aUpdatedLanguages=t}s._oTranslationPopover.close()}}),new l({text:f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_BUTTON_CANCEL"),press:function(){s._oTranslationPopover.close()}})]})}).addStyleClass("sapUiIntegrationFieldTranslation");y=new _(T);y.attachPropertyChange(function(e){var t=y.getData();var a=f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_LISTITEM_GROUP_UPDATED");var n=f.getText("EDITOR_FIELD_TRANSLATION_LIST_POPOVER_LISTITEM_GROUP_NOTUPDATED");var s=false;t.translatedLanguages.forEach(function(e){if(e.value!==e.originValue){e.status=a;s=true}else{e.status=n}});t.isUpdated=s;y.setData(t);y.checkUpdate(true)});s._oTranslationPopover.setModel(y,"languages")}else{s._oTranslationPopover.setPlacement(S);y=s._oTranslationPopover.getModel("languages");y.setData(T);y.checkUpdate(true)}s._oTranslationPopover.openBy(r._oValueHelpIcon)};O.prototype.getGroupHeader=function(e){return new y({title:e.key,upperCase:false})};return O});
//# sourceMappingURL=StringField.js.map