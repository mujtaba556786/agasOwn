sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Information", {
		onInit: function () {
			var oViewModel = new JSONModel({
				welcomeLogo: "ag/agasown/img/LOGO-HQ.png",
				welcomeLogoVertical: "ag/agasown/img/Vertical-HQ.png",
				facebook: "ag/agasown/img/facebook.svg",
				youtube: "ag/agasown/img/youtube.svg",
				instagram: "ag/agasown/img/instagram.svg",
				pinterest: "ag/agasown/img/pinterest.svg",
				ShoppingBags: "ag/agasown/img/ShoppingBags.jpg",
				ShoppingCart: "ag/agasown/img/ShoppingCart.jpg",
				AboutUs: "ag/agasown/img/AboutUsPage.jpg",
				Jewel: "ag/agasown/img/goyna.jpg",
			});
			this.getView().setModel(oViewModel, "view");
		}
	});
});
