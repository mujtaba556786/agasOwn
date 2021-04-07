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


		/**
		 * Always navigates back to home
		 * @override
		 */
		onBack: function () {
			this.getRouter().navTo("home");
		},
		handleMenuCategory: function (oEvent) {
			var categoryId = sap.ui.getCore().byId("subCategoryList");
			var categoryDetails = sap.ui.getCore().byId("categoryDetails");
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("oDataCategory");

			var sName = oContext.getProperty("category_name");
			this.getView().getModel("view").setProperty("/category_name", sName);

			var sValue1 = oContext.getProperty("id");
			var sPath = "parent";
			var sOperator = "EQ";
			var oBinding = categoryId.getBinding("items");
		
			oBinding.filter([new sap.ui.model.Filter(sPath, sOperator, sValue1)]);
			sap.ui.getCore().byId("myPopover").focus();
			if(oBinding.getLength() !== 0){
				categoryDetails.setVisible(true);
			} else {
				categoryDetails.setVisible(false);
				this.getRouter().navTo("product", {
					productPath: sValue1
				});
			}
		},

		onCategoryLinkPress: function(oEvent){
			var aFilters = [];
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("oDataCategory");
			var sValue1 = oContext.getProperty("id");

			var fnFilter = function (item) {
				return item.parent === sValue1;
			}

			var oDataCategory = this.getView().getModel("oDataCategory").getData();
			var selectedPath = oDataCategory.filter(fnFilter);

			//aFilters.push(selectedPath);

			this.getView().getModel("oGlobalModel").setProperty("/", {"detailCategory":selectedPath});

			this.getRouter().navTo("product", {
				productPath: sValue1
			});
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
		pressLogo: function () {
			this.getRouter().navTo("home");
		},
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
		}
	});
});