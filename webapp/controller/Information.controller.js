sap.ui.define([
	"./BaseController",
	"sap/ui/core/UIComponent"
], function(BaseController, UIComponent) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Information", {
		onInit: function () {
			this.setHeaderModel();
		}
	});
});
