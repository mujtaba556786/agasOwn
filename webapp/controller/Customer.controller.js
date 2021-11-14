sap.ui.define([
	"./BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Customer", {
		onInit: function () {
			this.setHeaderModel();
		}
	});
});
