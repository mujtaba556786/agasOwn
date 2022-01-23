sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Registration", {
		onInit: function () {
			this.setHeaderModel();
		}

	});
});
