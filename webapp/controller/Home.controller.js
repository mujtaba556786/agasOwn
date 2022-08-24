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
		_iCarouselLoopTime: 5000, // loop to next picture after 8 seconds

		onInit: function () {
			//! Hover function on menu button
			this.byId("target").addEventDelegate({
				onmouseover: this._showPopover,
				// onmouseout: this._clearPopover,
			  }, this);
		
			// select random carousel page at start
			var oWelcomeCarousel = this.byId("welcomeCarousel");
			var iRandomIndex = Math.floor(Math.abs(Math.random()) * oWelcomeCarousel.getPages().length);
			oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);

			this.setHeaderModel();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("home").attachPatternMatched(this._onObjectMatched, this);
		},
		//! Hover function on menu button
		_showPopover: function () {
			this._timeId = setTimeout(() => {
			  this.byId("popover").openBy(this.byId("target"));
			}, 500);
		  },
		
		_onObjectMatched: function (oEvent) {
			var sCurrentRouteName = oEvent.getParameter("name");
			console.log(sCurrentRouteName)
			this.getView().getModel("oGlobalModel").setProperty("/currentRouteName", sCurrentRouteName);
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
			//var oList = sap.ui.getCore().byId("mainCategoryList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		}

	});
});