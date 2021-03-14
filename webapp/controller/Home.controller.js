sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/Device",
	'sap/ui/core/Fragment',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, formatter, Device, Fragment, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Home", {
		_iCarouselTimeout: 0, // a pointer to the current timeout
		_iCarouselLoopTime: 8000, // loop to next picture after 8 seconds

		formatter: formatter,

		onInit: function () {
			var oViewModel = new JSONModel({
				welcomeLogo: 'ag/agasown/img/AgasOwn.jpg',
				welcomeCarouselShipping: 'ag/agasown/img/ShopCarouselShipping.jpg',
				welcomeCarouselInviteFriend: 'ag/agasown/img/ShopCarouselInviteFriend.jpg',
				welcomeCarouselTablet: 'ag/agasown/img/ShopCarouselTablet.jpg',
				welcomeCarouselCreditCard: 'ag/agasown/img/ShopCarouselCreditCard.jpg',
				Promoted: [],
				Viewed: [],
				Favorite: [],
				Currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");


			var oDataProducts = new JSONModel();
			oDataProducts.loadData("http://127.0.0.1:8000/products/");

			this.getView().setModel(oDataProducts, "oDataProducts");

			var oDataCategory = new JSONModel();
			oDataCategory.loadData("http://127.0.0.1:8000/category");

			this.getView().setModel(oDataCategory, "oDataCategory");


			// select random carousel page at start
			var oWelcomeCarousel = this.byId("welcomeCarousel");
			var iRandomIndex = Math.floor(Math.abs(Math.random()) * oWelcomeCarousel.getPages().length);
			oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);
		},

		/**
		 * lifecycle hook that will initialize the welcome carousel
		 */
		onAfterRendering: function () {
			this.onCarouselPageChanged();
		},

		/**
		 * clear previous animation and initialize the loop animation of the welcome carousel
		 */
		onCarouselPageChanged: function () {
			clearTimeout(this._iCarouselTimeout);
			this._iCarouselTimeout = setTimeout(function () {
				var oWelcomeCarousel = this.byId("welcomeCarousel");
				if (oWelcomeCarousel) {
					oWelcomeCarousel.next();
					this.onCarouselPageChanged();
				}
			}.bind(this), this._iCarouselLoopTime);
		},


		/**
		 * Always navigates back to home
		 * @override
		 */
		onBack: function () {
			this.getRouter().navTo("home");
		},
		handleMenuCategory: function (oEvent) {
			var categoryId = sap.ui.getCore().byId("subCategoryList");
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("oDataCategory");
			var sValue1 = oContext.getProperty("id");
			var sPath = "parent_id";
			var sOperator = "EQ";
			var oBinding = categoryId.getBinding("items");
			oBinding.filter([new sap.ui.model.Filter(sPath, sOperator, sValue1)]);
			sap.ui.getCore().byId("myPopover").focus();
		},

		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("category_name", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = sap.ui.getCore().byId("mainCategoryList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		
		},
		pressLogo: function () {},
		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
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
		},

		/*onNavToProduct : function (oEvent) {
			var oCtx = oEvent.getSource().getBindingContext("oDataCategory");
			var oNavCon = sap.ui.getCore().byId("navCon");
			var oDetailPage = sap.ui.getCore().byId("detail");
			oNavCon.to(oDetailPage);
			oDetailPage.bindElement(oCtx.getPath());
			sap.ui.getCore().byId("myPopover").focus();
		},

		onNavBack : function (oEvent) {
			var oNavCon = sap.ui.getCore().byId("navCon");
			oNavCon.back();
			sap.ui.getCore().byId("myPopover").focus();
		}*/

	});
});