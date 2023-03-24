sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ag/agasown/service/Service",
	// "sap/ui/model/resource/ResourceModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, Service) {
		"use strict";

		return Controller.extend("ag.agasown.controller.App", {
			onInit: function () {
				var access_token = localStorage.getItem("access_token");
				if (access_token) {
					this.newFunc()
				}
			},
			getService: function () {
				return Service;
			  },
			newFunc: function () {

				var ID = localStorage.getItem("user");
				var token = localStorage.getItem("access_token");
				var oHeaderToken = {
					Authorization: "Bearer " + token,
				};
				if(!ID){
					return;
				}
				var _sUrl = `http://64.227.115.243:8080/customers/${ID}`;
				this.getService()
					.onGet(_sUrl, oHeaderToken)
					.then((oSuccess) => {
						this.getView()
							.getModel("oCustomerModel")
							.setProperty("/", { customerModel: oSuccess });
					})
					.catch((oError) => {
						console.log(oError.responseText);
					});
			}
		});
	});
