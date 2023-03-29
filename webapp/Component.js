sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ag/agasown/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ag.agasown.Component", {

		metadata: {
			manifest: "json"
		},
		
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : "i18n/i18n.properties"
			});
			// enable routing
			this.getRouter().initialize();
			sap.ui.getCore().setModel(i18nModel, "i18n");
			this.setModel(i18nModel, "i18n");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the global model
			this.setModel(new sap.ui.model.json.JSONModel() , "oGlobalModel");
			// set the Menu model
			this.setModel(new sap.ui.model.json.JSONModel() , "oMenuModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "oCustomerModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "wishListmodel");
			this.setModel(new sap.ui.model.json.JSONModel(), "cartDetailsModel");	
			this.setModel(new sap.ui.model.json.JSONModel(), "oCartItemDataModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "oCartFinalModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "oCartQuantityModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "oCommModel");
		},
		
	});
});
