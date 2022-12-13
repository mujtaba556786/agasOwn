sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/resource/ResourceModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, ResourceModel) {
		"use strict";

		return Controller.extend("ag.agasown.controller.App", {
			onInit: function () {
				console.log("showing first_from App")
				var i18nModel = new ResourceModel({
					bundleName: "ag.agasown.i18n.i18n",
					supportedLocales: ["en", "de"],
					fallbackLocale: ""
				});
				console.log("thumb", i18nModel);
				this.getView().setModel(i18nModel, "i18n");
				
			}
		});
	});
