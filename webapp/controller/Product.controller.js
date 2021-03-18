sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/f/library'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Product", {

		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oProductsTable = this.oView.byId("productsTable");
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
			oDataProducts.loadData("http://127.0.0.1:8000/products" );
			this.getView().setModel(oDataProducts, "oDataProducts");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("product").attachPatternMatched(this._onObjectMatched, this);
		},
	
		_onObjectMatched: function (oEvent) {
			oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
		
		},
	
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function () {
			MessageBox.information("This functionality is not ready yet.", {title: "Aw, Snap!"});
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oProductsTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onListItemPress: function () {
			var oFCL = this.oView.getParent().getParent();

			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
		}
	});
});
