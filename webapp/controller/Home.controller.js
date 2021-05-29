sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	'sap/ui/core/Fragment',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, Device, Fragment, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Home", {
		_iCarouselTimeout: 0, // a pointer to the current timeout
		_iCarouselLoopTime: 8000, // loop to next picture after 8 seconds

		onInit: function () {
		
			// select random carousel page at start
			var oWelcomeCarousel = this.byId("welcomeCarousel");
			var iRandomIndex = Math.floor(Math.abs(Math.random()) * oWelcomeCarousel.getPages().length);
			oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);

			this.setHeaderModel();
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
		}

	});
});