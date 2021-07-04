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
			this.oProductDetail = this.oView.byId("productDetailCarousel");

			this.setHeaderModel();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("product").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sCurrentRouteName = oEvent.getParameter("name");
			var sCategoryId = oEvent.getParameter("arguments").productPath;
			this.getView().getModel("oGlobalModel").setProperty("/currentRouteName", sCurrentRouteName);

		
			//var oProductSearchState = [new Filter("category_id", FilterOperator.EQ, sCategoryId)];
			//this.oProductDetail.getBinding("pages").filter(oProductSearchState, "Application");
			this.onProductFilter();
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("product_name", FilterOperator.Contains, sQuery)];
			}

			this.oProductDetail.getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function () {
			MessageBox.information("This functionality is not ready yet.", { title: "Aw, Snap!" });
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oProductDetail.getBinding("pages"),
				oSorter = new Sorter("product_name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onFilterSelect: function (oEvent) {
			// Array to combine filters
			var oBinding = this.oProductDetail.getBinding("pages");
			// Array to combine filters
			var aFilters = [];

			var sQuery = oEvent.getParameter("key");
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("category_id", FilterOperator.EQ, sQuery);
				aFilters.push(filter);
			}
			// update list binding
			oBinding.filter(aFilters, "Application");
		},

		onProductFilter: function(){
			var aSelectedProduct = [];
			var aDetailCategory = this.getView().getModel("oGlobalModel").getData().detailCategory;
			var oDataProducts = this.getView().getModel("oDataProducts").getData();

			var fnFilterCategory = function (item) {
				aDetailCategory.forEach(element => {
					if(item.category_id === element.id){
						aSelectedProduct.push(item);
					}
				});
			}
			oDataProducts.filter(fnFilterCategory);
		
			this.getView().getModel("oGlobalModel").setProperty("/detailProduct", aSelectedProduct);
		}
	
	});
});
