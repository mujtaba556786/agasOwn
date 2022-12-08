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
		},
        setHeaderModel: function () {
            var iPagesCount = 1;
    
            if (Device.system.desktop) {
              iPagesCount = 4;
            } else if (Device.system.tablet) {
              iPagesCount = 2;
            }
    
            var oViewModel = new JSONModel({
              welcomeLogo: "ag/agasown/img/LOGO-HQ.png",
              welcomeLogoVertical: "ag/agasown/img/Vertical-HQ.png",
              welcomeCarouselShipping: "ag/agasown/img/BANNER-1.jpg",
              welcomeCarouselInviteFriend: "ag/agasown/img/BANNER-2.jpg",
              welcomeCarouselTablet: "ag/agasown/img/BANNER-3.jpg",
              welcomeCarouselCreditCard: "ag/agasown/img/BANNER-4.jpg",
              welcomeNews: "ag/agasown/img/newsletter_footer.jpeg",
              facebook: "ag/agasown/img/facebook.svg",
              youtube: "ag/agasown/img/youtube.svg",
              instagram: "ag/agasown/img/instagram.svg",
              pinterest: "ag/agasown/img/pinterest.svg",
              ShoppingBags: "ag/agasown/img/ShoppingBags.jpg",
              ShoppingCart: "ag/agasown/img/ShoppingCart.jpg",
              AboutUs: "ag/agasown/img/AboutUsPage.jpg",
              Jewel: "ag/agasown/img/goyna.jpg",
              Promoted: [],
              Viewed: [],
              Favorite: [],
              Currency: "EUR",
              pagesCount: iPagesCount,
    
            });
            this.getView().setModel(oViewModel, "view");
          },
    });
});