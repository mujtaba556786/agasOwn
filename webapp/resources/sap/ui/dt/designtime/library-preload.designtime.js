//@ui5-bundle sap/ui/dt/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/dt/designtime/notAdaptable.designtime", [],function(){"use strict";return{actions:"not-adaptable"}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/dt/designtime/notAdaptableTree.designtime", [],function(){"use strict";return function(t){var a="not-adaptable";var e={aggregations:{},actions:a};var n={propagateMetadata:function(){return{actions:a}},actions:a};var r=t.getMetadata().getAllAggregations();Object.keys(r).reduce(function(t,a){t.aggregations[a]=n;return t},e);return e}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/dt/designtime/notAdaptableVisibility.designtime", [],function(){"use strict";return{actions:{remove:null,reveal:null}}});
//# sourceMappingURL=library-preload.designtime.js.map
