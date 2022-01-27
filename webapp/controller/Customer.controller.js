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
			var selectedKey = oEvent.getSource().getSelectedKey();
			var oFragment = sap.ui.xmlfragment("ag.agasown.view.fragment.customer." + selectedKey, this);
			oCustomerLayout.destroyItems();
			oCustomerLayout.addItem(oFragment);
		},
		fragmentName: function (selectedKey) {
			return "ag.agasown.view.fragment.customer." + selectedKey;
		}
	});
});
