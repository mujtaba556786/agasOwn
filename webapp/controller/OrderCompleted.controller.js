sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.OrderCompleted", {

		onInit: function () {
			this._oRouter = this.getRouter();
		},

		onReturnToShopButtonPress: function () {
			//navigates back to home screen
			this._oRouter.navTo("home");
		}
	});
});
