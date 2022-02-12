sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Customer", {
		onInit: function () {
			this.setHeaderModel();

		},
		onCustomerNavigationSelect: function (oEvent) {
			var oCustomerLayout = this.getView().byId("customerContent");
			var _sFragmentName = oEvent.getSource().data("fragmentName");
			var oFragment = sap.ui.xmlfragment("ag.agasown.view.fragment.customer." + _sFragmentName, this);
			
			oCustomerLayout.destroyContent();
			oCustomerLayout.addContent(oFragment);
		}
	});
});
