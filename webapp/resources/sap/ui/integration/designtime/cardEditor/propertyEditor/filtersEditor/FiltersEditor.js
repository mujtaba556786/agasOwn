/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/cardEditor/propertyEditor/complexMapEditor/ComplexMapEditor","sap/base/util/restricted/_merge","sap/ui/integration/cards/filters/DateRangeFilter"],function(e,t,i,a){"use strict";var l=t.extend("sap.ui.integration.designtime.cardEditor.propertyEditor.filtersEditor.FiltersEditor",{metadata:{library:"sap.ui.integration"},renderer:e.getMetadata().getRenderer().render});l.configMetadata=Object.assign({},t.configMetadata,{allowedValues:{defaultValue:[],mergeStrategy:"intersection"}});l.prototype.onBeforeConfigChange=function(e){var a={};if(e["allowKeyChange"]){a={template:{key:{label:this.getI18nProperty("CARD_EDITOR.FILTER.KEY"),path:"key",type:"string",enabled:e.allowKeyChange,allowBindings:false,validators:[{type:"isUniqueKey",config:{keys:function(){return Object.keys(this.getValue())}.bind(this),currentKey:function(e){return e.getValue()}}}]},type:{label:this.getI18nProperty("CARD_EDITOR.FILTER.TYPE"),path:"type",type:"select",items:(e["allowedTypes"]||[]).map(function(e){return{key:e}}),allowCustomValues:true,allowBindings:false},label:{label:this.getI18nProperty("CARD_EDITOR.FILTER.LABEL"),path:"label",type:"string"},description:{label:this.getI18nProperty("CARD_EDITOR.FILTER.DESCRIPTION"),type:"string",path:"description",visible:"{= ${type} === 'Select' || ${type} === 'DateRange'}",allowCustomValues:true,allowBindings:false},value:{label:this.getI18nProperty("CARD_EDITOR.FILTER.NORMALVALUE"),path:"sValue",type:"string",visible:"{= ${type} === 'Select'}"},placeholder:{label:this.getI18nProperty("CARD_EDITOR.FILTER.PLACEHOLDER"),path:"placeholder",type:"string",visible:"{= ${type} === 'Search'}"},itemPath:{label:this.getI18nProperty("CARD_EDITOR.FILTER.ITEM.PATH"),path:"item/path",type:"string",visible:"{= ${type} === 'Select'}",enabled:"{= ${items} === undefined || ${items} === null}"},itemTemplateKey:{label:this.getI18nProperty("CARD_EDITOR.FILTER.ITEM.TEMPLATE.KEY"),path:"item/template/key",type:"string",visible:"{= ${type} === 'Select'}",enabled:"{= ${items} === undefined || ${items} === null}"},itemTemplateTitle:{label:this.getI18nProperty("CARD_EDITOR.FILTER.ITEM.TEMPLATE.TITLE"),path:"item/template/title",type:"string",visible:"{= ${type} === 'Select'}",enabled:"{= ${items} === undefined || ${items} === null}"},itemData:{label:this.getI18nProperty("CARD_EDITOR.FILTER.ITEM.DATA"),path:"data",type:"json",visible:"{= ${type} === 'Select'}",enabled:"{= ${items} === undefined || ${items} === null}"},items:{label:this.getI18nProperty("CARD_EDITOR.FILTER.ITEMS"),path:"items",type:"json",visible:"{= ${type} === 'Select'}",enabled:"{= ${item/template/key} === undefined || ${item/template/key} === ''}"},dateRangeOptions:{label:this.getI18nProperty("CARD_EDITOR.FILTER.OPTIONS"),path:"options",type:"multiSelect",items:this.getAllDateRangeOptions(),visible:"{= ${type} === 'DateRange'}"},dateRangeValueOption:{label:this.getI18nProperty("CARD_EDITOR.FILTER.VALUE.OPTION"),path:"dValue/option",type:"select",items:"{selectedOptions}",visible:"{= ${type} === 'DateRange'}"},dateRangeValues:{label:this.getI18nProperty("CARD_EDITOR.FILTER.VALUE.VALUES"),path:"dValue/values",type:"code",visible:"{= ${type} === 'DateRange'}"}}}}else{a={collapsibleItems:false,showItemLabel:false,template:{type:{label:this.getI18nProperty("CARD_EDITOR.FILTER.TYPE"),type:"select",path:"type",items:(e["allowedTypes"]||[]).map(function(e){return{key:e}}),allowCustomValues:false,allowBindings:false}}}}var l=i({},a,e);return t.prototype.onBeforeConfigChange.call(this,l)};l.prototype.getAllDateRangeOptions=function(){var e=new a;var t=e.getOptions();var i=[];for(var l in t){if(t.hasOwnProperty(l)){i.push({key:t[l],title:t[l]})}}return i};return l});
//# sourceMappingURL=FiltersEditor.js.map