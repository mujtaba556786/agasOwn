sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, JSONModel) {
	"use strict";

	return Controller.extend("ag.agasown.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		setHeaderModel: function(){
			var oViewModel = new JSONModel({
				welcomeLogo: 'ag/agasown/img/AgasOwn.jpg',
				welcomeCarouselShipping: 'ag/agasown/img/ShopCarouselShipping.jpg',
				welcomeCarouselInviteFriend: 'ag/agasown/img/ShopCarouselInviteFriend.jpg',
				welcomeCarouselTablet: 'ag/agasown/img/ShopCarouselTablet.jpg',
				welcomeCarouselCreditCard: 'ag/agasown/img/ShopCarouselCreditCard.jpg',
				welcomeNews:'ag/agasown/img/newsletter_footer.jpeg',
				facebook:'ag/agasown/img/Facebook.png',
				instagram:'ag/agasown/img/Instagram.jpeg',
				youtube:'ag/agaswon/img/Youtube.png',
				category_name:"",
				Promoted: [],
				Viewed: [],
				Favorite: [],
				Currency: "EUR"
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

		handleCloseMenu: function (oEvent) {
			// note: We don't need to chain to the _pPopover promise, since this event-handler
			// is only called from within the loaded dialog itself.
			//this.byId("myMenu").close();
			if (this._oPopover) {
				this._oPopover.close();
			}
		}
	});
});