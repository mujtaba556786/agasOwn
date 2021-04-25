sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"../model/cart",
], function (Controller, UIComponent, JSONModel, Device, cart) {
	"use strict";

	return Controller.extend("ag.agasown.controller.BaseController", {
		cart: cart,
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		setHeaderModel: function () {
			var iPagesCount = 1;

			if (Device.system.desktop) {
				iPagesCount = 4;
			} else if (Device.system.tablet) {
				iPagesCount = 2;
			}


			var oViewModel = new JSONModel({
				welcomeLogo: 'ag/agasown/img/AgasOwn.jpg',
				welcomeCarouselShipping: 'ag/agasown/img/ShopCarouselShipping.jpg',
				welcomeCarouselInviteFriend: 'ag/agasown/img/ShopCarouselInviteFriend.jpg',
				welcomeCarouselTablet: 'ag/agasown/img/ShopCarouselTablet.jpg',
				welcomeCarouselCreditCard: 'ag/agasown/img/ShopCarouselCreditCard.jpg',
				welcomeNews: 'ag/agasown/img/newsletter_footer.jpeg',
				facebook: 'ag/agasown/img/Facebook.png',
				instagram: 'ag/agasown/img/Instagram.jpeg',
				youtube: 'ag/agaswon/img/Youtube.png',
				category_name: "",
				Promoted: [],
				Viewed: [],
				Favorite: [],
				Currency: "EUR",
				pagesCount: iPagesCount
			});
			this.getView().setModel(oViewModel, "view");

			// select random carousel page at start
			var oWelcomeCarousel = this.byId("welcomeCarousel");
			var iRandomIndex = Math.floor(Math.abs(Math.random()) * oWelcomeCarousel.getPages().length);
			oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);
		},

		onShowCategories: function (oEvent) {
			var oMenu = oEvent.getSource();

			// create popover
			if (!this._oPopover) {
				Fragment.load({
					name: "ag.agasown.view.fragment.Menu",
					controller: this
				}).then(function (pPopover) {
					this._oPopover = pPopover;
					this.getView().addDependent(this._oPopover);
					//this._oPopover.bindElement("/ProductCollection/0");
					this._oPopover.openBy(oMenu);
				}.bind(this));
			} else {
				this._oPopover.openBy(oMenu);
			}
		},

		/**
		 * Always navigates back to home
		 * @override
		 */
		onNavBack: function () {
			this.getRouter().navTo("home");
			location.reload();
		},

		handleCloseMenu: function (oEvent) {
			// note: We don't need to chain to the _pPopover promise, since this event-handler
			// is only called from within the loaded dialog itself.
			//this.byId("myMenu").close();
			if (this._oPopover) {
				this._oPopover.close();
			}
		},
		/**
		 * Called, when the add button of a product is pressed.
		 * Saves the product, the i18n bundle, and the cart model and hands them to the <code>addToCart</code> function
		 * @public
		 */
		onAddToCart: function () {
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oEntry = this.getView().getModel("oDataProducts").getData();
			var oCartModel = this.getView().getModel("oDataProducts");
			cart.addToCart(oResourceBundle, oEntry, oCartModel);
		},
		onShowCustomer: function () {
			alert("Oh Crap!!! this function is not ready yet!!!!");
		}
	});
});