/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/FlexControllerFactory","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/Utils"],function(t,e,r){"use strict";function n(t){var n=r.getAppDescriptor(t);return e.getAppIdFromManifest(n)}var o={getFlexControllerInstance:function(e){if(typeof e==="string"){return t.create(e)}var r=e.appComponent||e;return t.createForControl(r)},getDescriptorFlexControllerInstance:function(e){if(typeof e.appId==="string"){return t.create(e.appId)}var r=e.appComponent||e;var o=n(r);return t.create(o)},getAppComponentForSelector:function(t){if(typeof t.appId==="string"){return t}return t.appComponent||r.getAppComponentForControl(t)}};return o});
//# sourceMappingURL=ChangesController.js.map