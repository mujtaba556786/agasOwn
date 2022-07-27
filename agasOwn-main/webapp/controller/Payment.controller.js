sap.ui.define([
    "./BaseController",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (BaseController, UIComponent, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("ag.agasown.controller.Payment", {
        onInit: function () {
            this._router = UIComponent.getRouterFor(this);
        },
        handleWizardSubmits: function () {
            var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureSubmit");
            this._handleSubmitOrCancel(sText, "confirm", "ordercompleted");
            MessageBox.success(this.getResourceBundle().getText("popOverMessageText"));
        },
        onReturnToShopButtonPress: function () {
			this.getRouter().navTo("home");
		}
    });
});