sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Information", {
		onInit: function () {
			this.setHeaderModel();
		},
		onSubmit: function (oEvent) {
			var _sUrl = "http://localhost:8000/sign-up/";
			var _sfirstName = this.byId("firstNameInput").getValue();
			var _slastName = this.byId("lastNameInput").getValue();
			var _sEmail = this.byId("emailInput").getValue();
			var _sPasswordInput = this.byId("passwordInput").getValue();
			var _sConfirmPasswordInput = this.byId("confirmPasswordInput").getValue();

			var oData = {
				"first_name": _sfirstName,
				"last_name": _slastName,
				"email": _sEmail,
				"password": _sPasswordInput,
				"confirm_password": _sConfirmPasswordInput
			}
			this.getService().onPost(_sUrl, oData)
				.then((oSuccess) => {
					MessageBox.success(oSuccess.detail);
				})
				.catch((oError) => {
					MessageBox.error(oError.responseJSON.detail)
				})
		}

	});
});
