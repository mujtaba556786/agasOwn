//@ui5-bundle sap/ui/mdc/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/Util", [],function(){"use strict";function e(){return{actions:{},aggregations:{},description:"{description}",name:"{name}",properties:{}}}function t(e,t,i){var n=e.includes(t);var r=n&&i[t]||{};if(!Object.keys(r).length){r[t]={ignore:!n};Object.assign(i,r)}}return{getDesignTime:function(i,n,r,a){a=a?a:e();a.actions=a.actions?a.actions:{};a.properties=a.properties?a.properties:{};a.aggregations=a.aggregations?a.aggregations:{};var s=i.getMetadata(),n=n?n:[],r=r?r:[],g=Object.keys(s.getAllProperties()).concat(Object.keys(s.getAllPrivateProperties())),o=Object.keys(s.getAllAggregations()).concat(Object.keys(s.getAllPrivateAggregations()));g.forEach(function(e){t(n,e,a.properties)});o.forEach(function(e){t(r,e,a.aggregations)});return a}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/actiontoolbar/ActionToolbar.designtime", ["sap/ui/mdc/ActionToolbar","sap/ui/mdc/p13n/Engine","../Util"],function(e,n,t){"use strict";var a=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var i={description:"{description}",name:"{name}",aggregations:{between:{propagateMetadata:function(e){if(e.isA("sap.ui.fl.variants.VariantManagement")){return null}return{actions:"not-adaptable"}}}},properties:{},actions:{settings:{name:a.getText("actiontoolbar.RTA_SETTINGS_NAME"),handler:function(e,t){return n.getInstance().getRTASettingsActionHandler(e,t,"actionsKey").then(function(e){return e})},CAUTION_variantIndependent:true}}},r=["actions","between"],s=[];return t.getDesignTime(e,s,r,i)});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/actiontoolbar/ActionToolbarAction.designtime", ["sap/ui/mdc/actiontoolbar/ActionToolbarAction","../Util"],function(t,e){"use strict";var n={description:"{description}",name:"{name}",aggregations:{action:{propagateMetadata:function(t){return{actions:{rename:{changeType:"rename",domRef:function(t){return t.$()},getTextMutators:function(t){return{getText:function(){return t.getDomRef().textContent},setText:function(e){t.getDomRef().textContent=e}}}},remove:null,reveal:null}}}}},properties:{},actions:{}},o=["action"],i=[];return e.getDesignTime(t,i,o,n)});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/chart/Chart.designtime", ["sap/ui/mdc/p13n/Engine"],function(e){"use strict";return{actions:{settings:function(){return{handler:function(r,n){var t=r.getP13nMode();var i=t.indexOf("Type");if(i>-1){t.splice(i,1)}if(r.isPropertyHelperFinal()){return e.getInstance().getRTASettingsActionHandler(r,n,t)}else{return r.finalizePropertyHelper().then(function(){return e.getInstance().getRTASettingsActionHandler(r,n,t)})}}}}},properties:{width:{ignore:true},height:{ignore:true},delegate:{ignore:true},header:{ignore:true},noDataText:{ignore:true},p13nMode:{ignore:true},legendVisible:{ignore:true},ignoreToolbarActions:{ignore:true},minWidth:{ignore:true},minHeight:{ignore:true},sortConditions:{ignore:true},filterConditions:{ignore:true},showChartTooltip:{ignore:true},autoBindOnInit:{ignore:true},chartType:{ignore:true},showSelectionDetails:{ignore:true},propertyInfo:{ignore:true},headerLevel:{ignore:false}},aggregations:{items:{ignore:true},actions:{ignore:true},selectionDetailsActions:{ignore:true},_toolbar:{ignore:false},_breadcrumbs:{ignore:true},_innerChart:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/Field.designtime", ["sap/ui/fl/Utils","sap/ui/fl/apply/api/FlexRuntimeInfoAPI","sap/ui/mdc/p13n/Engine","sap/ui/core/Core"],function(e,n,t,r){"use strict";var o=r.getLibraryResourceBundle("sap.ui.mdc");return{properties:{value:{ignore:true},additionalValue:{ignore:true}},getStableElements:function(t){if(!t.getFieldInfo()){return[]}var o=t.getFieldInfo();var i=typeof o.getSourceControl()==="string"?r.byId(o.getSourceControl()):o.getSourceControl();if(!i){i=t}var a=e.getAppComponentForControl(i)||e.getAppComponentForControl(t);var u=o._createPanelId(e,n);return[{id:u,appComponent:a}]},actions:{settings:function(r){if(!r.getFieldInfo()){return{}}return{name:o.getText("info.POPOVER_DEFINE_LINKS"),handler:function(o,i){var a=o.getFieldInfo();return a.getContent().then(function(u){a.addDependent(u);return n.waitForChanges({element:u}).then(function(){var a=t.getInstance();i.fnAfterClose=function(){u.destroy()};var l=function(){return a.getRTASettingsActionHandler(u,i,"LinkItems").then(function(n){n.forEach(function(n){var t=n.selectorElement;delete n.selectorElement;var i=e.getAppComponentForControl(o)||e.getAppComponentForControl(r);n.selectorControl={id:t.getId(),controlType:t===u?"sap.ui.mdc.link.Panel":"sap.ui.mdc.link.PanelItem",appComponent:i}});return n})};var p=u.getItems();if(p.length>0){return n.waitForChanges({selectors:p}).then(function(){return l()})}else{return l()}})})},CAUTION_variantIndependent:true}}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/FieldBase.designtime", [],function(){"use strict";return{properties:{dataType:{ignore:true},dataTypeConstraints:{ignore:true},dataTypeFormatOptions:{ignore:true},editMode:{ignore:true},required:{ignore:true},display:{ignore:true},textAlign:{ignore:true},textDirection:{ignore:true},placeholder:{ignore:true},valueState:{ignore:true},valueStateText:{ignore:true},width:{ignore:true},multipleLines:{ignore:true},maxConditions:{ignore:true},conditions:{ignore:true},label:{ignore:true},delegate:{ignore:true},showEmptyIndicator:{ignore:true}},aggregations:{content:{ignore:true},contentEdit:{ignore:true},contentDisplay:{ignore:true},fieldInfo:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/FilterField.designtime", [],function(){"use strict";return{properties:{operators:{ignore:true},defaultOperator:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/field/MultiValueField.designtime", [],function(){"use strict";return{properties:{delegate:{ignore:true}},aggregations:{items:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/filterbar/FilterBar.designtime", ["sap/ui/mdc/p13n/Engine"],function(e){"use strict";return{actions:{settings:function(){return{name:"filterbar.ADAPT_TITLE",handler:function(t,n){return t.initializedWithMetadata().then(function(){return e.getInstance().getRTASettingsActionHandler(t,n,"Item")})}}}},aggregations:{layout:{ignore:true},basicSearchField:{ignore:true},filterItems:{ignore:true}},properties:{showAdaptFiltersButton:{ignore:false},showClearButton:{ignore:false},p13nMode:{ignore:false}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/filterbar/FilterBarBase.designtime", [],function(){"use strict";return{properties:{showGoButton:{ignore:false},delegate:{ignore:true},liveMode:{ignore:false},showMessages:{ignore:false},filterConditions:{ignore:true},propertyInfo:{ignore:true},suspendSelection:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/library.designtime", [],function(){"use strict";return{}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/link/Panel.designtime", [],function(){"use strict";return{tool:{start:function(t){t.setEnablePersonalization(false)},stop:function(t){t.setEnablePersonalization(true)}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/link/PanelItem.designtime", ["sap/ui/thirdparty/jquery"],function(jQuery){"use strict";return{domRef:function(e){var n=jQuery.find(".mdcbaseinfoPanelListItem");var t=n.filter(function(n){return jQuery(n).control(0).getParent().getKey()===e.getId()});return t[0]},name:{singular:"p13nDialog.PANEL_ITEM_NAME",plural:"p13nDialog.PANEL_ITEM_NAME_PLURAL"},actions:{remove:function(){return{changeType:"hideItem"}},reveal:function(){return{changeType:"revealItem"}}},isVisible:function(e){return e.getVisible()}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/p13n/PersistenceProvider.designtime", [],function(){"use strict";return{name:"{name}",description:"{description}",properties:{mode:{ignore:true}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/mdc/designtime/table/Table.designtime", ["sap/ui/mdc/p13n/Engine","sap/ui/mdc/Table","../Util"],function(t,e,n){"use strict";var i={name:"{name}",description:"{description}",actions:{settings:function(){return{handler:function(e,n){return t.getInstance().getRTASettingsActionHandler(e,n,e.getActiveP13nModes())}}}},properties:{},aggregations:{_content:{propagateMetadata:function(t){if(t.isA("sap.ui.fl.variants.VariantManagement")||t.isA("sap.ui.mdc.ActionToolbar")||t.isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")||t.isA("sap.ui.mdc.Field")||t.getParent()&&(t.getParent().isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")||t.getParent().isA("sap.ui.mdc.Field"))){return null}return{actions:"not-adaptable"}}}}};var a=["width","height","headerLevel","header","headerVisible","showRowCount","threshold","noDataText","enableExport","busyIndicatorDelay","enableColumnResize","showPasteButton","multiSelectMode"],o=["_content"];return n.getDesignTime(e,a,o,i)});
//# sourceMappingURL=library-preload.designtime.js.map
