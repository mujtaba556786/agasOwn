//@ui5-bundle sap/ui/fl/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/library.designtime", [],function(){"use strict";return{}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/util/IFrame.designtime", ["sap/ui/rta/plugin/iframe/AddIFrameDialog","sap/m/library"],function(e){"use strict";function r(r){var t=new e;var i=r.get_settings();var n;return e.buildUrlBuilderParametersFor(r).then(function(e){n={parameters:e,frameUrl:i.url,frameWidth:i.width,frameHeight:i.height,updateMode:true};return t.open(n)}).then(function(e){if(!e){return[]}var t;var i;if(e.frameWidth){t=e.frameWidth+e.frameWidthUnit}else{t="100%"}if(e.frameHeight){i=e.frameHeight+e.frameHeightUnit}else{i="100%"}return[{selectorControl:r,changeSpecificData:{changeType:"updateIFrame",content:{url:e.frameUrl,width:t,height:i}}}]})}return{actions:{settings:function(){return{icon:"sap-icon://write-new",name:"CTX_EDIT_IFRAME",isEnabled:true,handler:r}},remove:{changeType:"hideControl"},reveal:{changeType:"unhideControl"}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/variants/VariantManagement.designtime", ["sap/ui/fl/apply/api/ControlVariantApplyAPI","sap/ui/fl/Utils"],function(e,t){"use strict";var r=function(r,a){var n=t.getAppComponentForControl(r);var o=r.getId();var i=n.getModel(e.getVariantModelName());var l=n.getLocalId(o)||o;if(!i){return}if(a){i.waitForVMControlInit(l).then(function(){i.setModelPropertiesForControl(l,a,r);i.checkUpdate(true)})}else{i.setModelPropertiesForControl(l,a,r);i.checkUpdate(true)}};return{annotations:{},properties:{showSetAsDefault:{ignore:false},manualVariantKey:{ignore:true},inErrorState:{ignore:false},editable:{ignore:false},modelName:{ignore:false},updateVariantInURL:{ignore:true},resetOnContextChange:{ignore:true},executeOnSelectionForStandardDefault:{ignore:false},displayTextForExecuteOnSelectionForStandardVariant:{ignore:false},headerLevel:{ignore:false}},variantRenameDomRef:function(e){return e.getTitle().getDomRef("inner")},customData:{},tool:{start:function(e){var t=true;r(e,t)},stop:function(e){var t=false;r(e,t)}},actions:{controlVariant:function(r){var a=t.getAppComponentForControl(r);var n=r.getId();var o=a.getModel(e.getVariantModelName());var i=a.getLocalId(n)||n;return{validators:["noEmptyText",{validatorFunction:function(e){var t=o._getVariantTitleCount(e,i)||0;return t===0},errorMessage:sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl").getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE")}]}}}}});
//# sourceMappingURL=library-preload.designtime.js.map
