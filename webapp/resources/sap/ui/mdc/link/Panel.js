/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./PanelRenderer","sap/ui/layout/VerticalLayout","sap/base/Log","sap/ui/layout/HorizontalLayout","sap/m/HBox","sap/m/VBox","sap/m/ImageContent","sap/m/Link","sap/m/Label","sap/m/Text","sap/m/Button","sap/m/FlexItemData","sap/ui/model/json/JSONModel","sap/ui/model/BindingMode","sap/ui/base/ManagedObjectObserver","sap/ui/mdc/p13n/subcontroller/LinkPanelController","sap/ui/mdc/p13n/Engine","sap/ui/mdc/mixin/AdaptationMixin","sap/ui/mdc/link/PanelItem","sap/ui/core/CustomData"],function(t,e,n,i,a,r,o,s,l,u,c,p,d,m,g,h,f,I,v,P,y){"use strict";var b=t.extend("sap.ui.mdc.link.Panel",{metadata:{library:"sap.ui.mdc",designtime:"sap/ui/mdc/designtime/link/Panel.designtime",defaultAggregation:"items",properties:{enablePersonalization:{type:"boolean",defaultValue:true,invalidate:true},metadataHelperPath:{type:"string"},beforeNavigationCallback:{type:"function"}},aggregations:{items:{type:"sap.ui.mdc.link.PanelItem",multiple:true,singularName:"item"},additionalContent:{type:"sap.ui.core.Control",multiple:true},_content:{type:"sap.ui.layout.VerticalLayout",visibility:"hidden",multiple:false}},events:{beforeSelectionDialogOpen:{},afterSelectionDialogClose:{}}},renderer:e});b.prototype.init=function(){t.prototype.init.call(this);I.getInstance().registerAdaptation(this,{controller:{LinkItems:f}});v.call(b.prototype);I.getInstance().defaultProviderRegistry.attach(this,"Global");sap.ui.require([this.getMetadataHelperPath()||"sap/ui/mdc/Link"],function(t){this._oMetadataHelper=t}.bind(this));var e=new m({countAdditionalContent:0,countItemsWithIcon:0,countItemsWithoutIcon:0,showResetEnabled:false,runtimeItems:[],contentTitle:""});e.setDefaultBindingMode(g.TwoWay);e.setSizeLimit(1e3);this.setModel(e,"$sapuimdclinkPanel");this._oObserver=new h(k.bind(this));this._oObserver.observe(this,{properties:["enablePersonalization"],aggregations:["items","additionalContent"]})};var _=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");b.prototype.applySettings=function(){this._createContent();t.prototype.applySettings.apply(this,arguments)};b.prototype.exit=function(t){if(this._oObserver){this._oObserver.disconnect();this._oObserver=null}if(this._oMetadataHelper){this._oMetadataHelper=null}};b.prototype._createContent=function(){var t=new n({width:"100%",content:[this._createAdditionalContentArea(),this._createSeparator(),this._createLinkArea(),this._createFooterArea()]});this.setAggregation("_content",t)};b.prototype._createAdditionalContentArea=function(){var t=new o({fitContainer:false,items:this.getAdditionalContent()});return t};b.prototype._createSeparator=function(){var t=new o({fitContainer:false,visible:{parts:[{path:"$sapuimdclinkPanel>/countAdditionalContent"},{path:"$sapuimdcLink>/metadata"}],formatter:function(t,e){return t>0&&e.length>0}}});t.addStyleClass("mdcbaseinfoPanelSeparator");t.setModel(this._getInternalModel(),"$sapuimdclinkPanel");t.setModel(this.getModel("$sapuimdcLink"),"$sapuimdcLink");return t};b.prototype._createLinkArea=function(){var t=new o({fitContainer:false,items:{path:"$sapuimdclinkPanel>/runtimeItems",templateShareable:false,factory:this._fnLinkItemFactory.bind(this)}});t.addStyleClass("mdcbaseinfoPanelSectionLinks");t.setModel(this._getInternalModel(),"$sapuimdclinkPanel");return t};b.prototype._fnLinkItemFactory=function(t,e){var n=new s({src:"{$sapuimdclinkPanel>icon}",visible:{path:"$sapuimdclinkPanel>icon",formatter:function(t){return!!t}}});var i=new l({text:"{$sapuimdclinkPanel>text}",href:"{$sapuimdclinkPanel>href}",target:"{$sapuimdclinkPanel>target}",visible:{path:"$sapuimdclinkPanel>href",formatter:function(t){return!!t}},press:this.onPressLink.bind(this),wrapping:true,customData:new y({key:"internalHref",value:"{$sapuimdclinkPanel>internalHref}"})});var p=new u({text:"{$sapuimdclinkPanel>text}",visible:{path:"$sapuimdclinkPanel>href",formatter:function(t){return!t}},wrapping:true});var m=new c({text:"{$sapuimdclinkPanel>description}",visible:{path:"$sapuimdclinkPanel>description",formatter:function(t){return!!t}},wrapping:true});var g=new o({items:[i,p,m]});var h=new r({layoutData:new d({styleClass:e.getProperty("description")?"mdcbaseinfoPanelItemsGroup":"mdcbaseinfoPanelItemsWithoutGroup"}),items:[n,g]});var f=new a({visible:"{$sapuimdclinkPanel>visible}",content:[h]});f.addStyleClass("mdcbaseinfoPanelListItem");return f};b.prototype._createFooterArea=function(){var t=new p(this.getId()+"--idSectionPersonalizationButton",{type:"Transparent",text:_.getText("info.POPOVER_DEFINE_LINKS"),press:this.onPressLinkPersonalization.bind(this)});var e=new r({visible:{path:"$sapuimdcLink>/metadata",formatter:function(t){return t.length>0}},justifyContent:"End",items:[t]});e.addStyleClass("mdcbaseinfoPanelPersonalizationButton");return e};b.prototype.onPressLink=function(t){var e=t.getSource();var n=t.getParameters().ctrlKey||t.getParameters().metaKey;if(this.getBeforeNavigationCallback()&&e&&e.getTarget()!=="_blank"&&!n){var i=e&&e.getCustomData()&&e.getCustomData()[0]&&e.getCustomData()[0].getValue();var a=i?e.getCustomData()[0].getValue():e.getHref();t.preventDefault();this.getBeforeNavigationCallback()(t).then(function(t){if(t){b.navigate(a)}})}};b.oNavigationPromise=undefined;b.navigate=function(t){if(t.indexOf("#")===0&&sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getServiceAsync){if(!b.oNavigationPromise){b.oNavigationPromise=sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(e){e.toExternal({target:{shellHash:t.substring(1)}});b.oNavigationPromise=undefined})}}else{window.location.href=t}};b.prototype.onPressLinkPersonalization=function(){this._openPersonalizationDialog()};b.prototype._openPersonalizationDialog=function(){return new Promise(function(t,e){sap.ui.require([this.getMetadataHelperPath()||"sap/ui/mdc/Link"],function(e){var n=this._getInternalModel();var i=e.retrieveBaseline(this);var a=i;var r=function(t){var e=t._oListControl.getItems().filter(function(t){return t.getSelected()});e=e.map(function(e){var n=t._getP13nModel().getProperty(e.getBindingContext(t.P13N_MODEL).sPath);return{id:n.name,description:n.description,href:n.href,internalHref:n.internalHref,target:n.target,text:n.text,visible:n.visible}});var n=b._showResetButtonEnabled(a,e);this._getInternalModel().setProperty("/showResetEnabled",n)};var o=this.getParent();if(o.isA("sap.m.Popover")){o.setModal(true)}I.getInstance().uimanager.show(this,"LinkItems").then(function(e){var i=e.getCustomHeader().getContentRight()[0];var a=e.getContent()[0];i.setModel(n,"$sapuimdclinkPanel");i.bindProperty("enabled",{path:"$sapuimdclinkPanel>/showResetEnabled"});r.call(this,a);a.attachChange(function(t){r.call(this,a)}.bind(this));e.attachAfterClose(function(){if(o.isA("sap.m.Popover")){o.setModal(false)}});t(e)}.bind(this))}.bind(this))}.bind(this))};b._showResetButtonEnabled=function(t,e){var n=false;var i=b._getVisibleItems(e);var a=b._getVisibleItems(t);if(e.length!==t.length){n=true}else if(a.length&&i.length){var r=b._allItemsIncludedInArray(a,i);var o=b._allItemsIncludedInArray(i,a);n=!r||!o}return n};b._allItemsIncludedInArray=function(t,e){var n=true;t.forEach(function(t){var i=b._getItemsById(t.id,e);if(i.length===0){n=false}});return n};b._getItemsById=function(t,e){return e.filter(function(e){return e.id===t})};b._getItemById=function(t,e){return b._getItemsById(t,e)[0]};b._getVisibleItems=function(t){return t.filter(function(t){return t.id!==undefined&&t.visible})};b.prototype._getInternalModel=function(){return this.getModel("$sapuimdclinkPanel")};b.prototype._propagateDefaultIcon=function(t){if(!t){return}var e=this._getInternalModel();e.getProperty("/runtimeItems").forEach(function(t,n){if(t.icon){return}e.setProperty("/runtimeItems/"+n+"/icon","sap-icon://chain-link")})};function k(t){var e=this._getInternalModel();if(t.object.isA("sap.ui.mdc.link.Panel")){switch(t.name){case"additionalContent":var n=t.child?[t.child]:t.children;n.forEach(function(e){switch(t.mutation){case"insert":this.getAggregation("_content").getContent()[0].addItem(e);break;case"remove":break;default:i.error("Mutation '"+t.mutation+"' is not supported yet.")}}.bind(this));e.setProperty("/countAdditionalContent",n.length);break;case"items":var a=t.child?[t.child]:t.children;a.forEach(function(n){var a=e.getProperty("/runtimeItems/");switch(t.mutation){case"insert":e.setProperty("/countItemsWithIcon",n.getIcon()?e.getProperty("/countItemsWithIcon")+1:e.getProperty("/countItemsWithIcon"));e.setProperty("/countItemsWithoutIcon",n.getIcon()?e.getProperty("/countItemsWithoutIcon"):e.getProperty("/countItemsWithoutIcon")+1);a.splice(this.indexOfItem(n),0,n.getJson());e.setProperty("/runtimeItems",a);this._propagateDefaultIcon(e.getProperty("/countItemsWithIcon")>0&&e.getProperty("/countItemsWithoutIcon")>0);this._oObserver.observe(n,{properties:["visible"]});break;case"remove":e.setProperty("/countItemsWithIcon",n.getIcon()?e.getProperty("/countItemsWithIcon")-1:e.getProperty("/countItemsWithIcon"));e.setProperty("/countItemsWithoutIcon",n.getIcon()?e.getProperty("/countItemsWithoutIcon"):e.getProperty("/countItemsWithoutIcon")-1);var r=a.find(function(t){return t.id===n.getId()});a.splice(a.indexOf(r),1);e.setProperty("/runtimeItems",a);this._propagateDefaultIcon(e.getProperty("/countItemsWithIcon")>0&&e.getProperty("/countItemsWithoutIcon")>0);this._oObserver.unobserve(n);n.destroy();this.invalidate();break;default:i.error("Mutation '"+t.mutation+"' is not supported yet.")}},this);break;case"enablePersonalization":this._getPersonalizationButton().setVisible(t.current);break;default:i.error("The property or aggregation '"+t.name+"' has not been registered.")}}else if(t.object.isA("sap.ui.mdc.link.PanelItem")){switch(t.name){case"visible":var r=t.object;var o=this.indexOfItem(r);if(r.getVisibleChangedByUser()){e.setProperty("/runtimeItems/"+o+"/visible",r.getVisible())}else{e.setProperty("/baselineItems/"+o+"/visible",r.getVisible());e.setProperty("/runtimeItems/"+o+"/visible",r.getVisible())}break;default:i.error("The '"+t.name+"' of PanelItem is not supported yet.")}}this._updateContentTitle()}b.prototype.getContentTitle=function(){var t=this._getInternalModel();return t.getProperty("/contentTitle")};b.prototype.getCurrentState=function(){var t=[],e;this.getItems().forEach(function(n,i){e=n&&n.getId();if(n.getVisible()){t.push({name:e})}});return{items:t}};b.prototype.initPropertyHelper=function(){var t=this._oMetadataHelper.retrieveAllMetadata(this);return Promise.resolve({getProperties:function(){var e=[];t.forEach(function(t){e.push({name:t.id,getName:function(){return t.id},getLabel:function(){return t.text},text:t.text,href:t.href,internalHref:t.internalHref,description:t.description,target:t.target,visible:t.visible})});return e}})};b.prototype._updateContentTitle=function(){var t=this._getInternalModel();var e=this.getAggregation("_content").getContent()[0].getItems();var n=this._getPersonalizationButton().getId();if(e.length>0){n=e[0]}else{var i=this.getItems();if(i.length>0){n=i[0]}}t.setProperty("/contentTitle",n)};b.prototype._getPersonalizationButton=function(){return this.getAggregation("_content").getContent()[3].getItems()[0]};return b});
//# sourceMappingURL=Panel.js.map