/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils","sap/ui/fl/apply/api/FlexRuntimeInfoAPI","sap/ui/mdc/p13n/Engine","sap/ui/core/Core"],function(e,n,t,r){"use strict";var o=r.getLibraryResourceBundle("sap.ui.mdc");return{properties:{value:{ignore:true},additionalValue:{ignore:true}},getStableElements:function(t){if(!t.getFieldInfo()){return[]}var o=t.getFieldInfo();var i=typeof o.getSourceControl()==="string"?r.byId(o.getSourceControl()):o.getSourceControl();if(!i){i=t}var a=e.getAppComponentForControl(i)||e.getAppComponentForControl(t);var u=o._createPanelId(e,n);return[{id:u,appComponent:a}]},actions:{settings:function(r){if(!r.getFieldInfo()){return{}}return{name:o.getText("info.POPOVER_DEFINE_LINKS"),handler:function(o,i){var a=o.getFieldInfo();return a.getContent().then(function(u){a.addDependent(u);return n.waitForChanges({element:u}).then(function(){var a=t.getInstance();i.fnAfterClose=function(){u.destroy()};var l=function(){return a.getRTASettingsActionHandler(u,i,"LinkItems").then(function(n){n.forEach(function(n){var t=n.selectorElement;delete n.selectorElement;var i=e.getAppComponentForControl(o)||e.getAppComponentForControl(r);n.selectorControl={id:t.getId(),controlType:t===u?"sap.ui.mdc.link.Panel":"sap.ui.mdc.link.PanelItem",appComponent:i}});return n})};var p=u.getItems();if(p.length>0){return n.waitForChanges({selectors:p}).then(function(){return l()})}else{return l()}})})},CAUTION_variantIndependent:true}}}}});
//# sourceMappingURL=Field.designtime.js.map