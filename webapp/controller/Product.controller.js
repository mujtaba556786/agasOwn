sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";
	return BaseController.extend("ag.agasown.controller.Product", {
		onInit: function () {
			this.setHeaderModel();
			this.oGridList = this.byId("gridList");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("product").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var _sId = oEvent.getParameter("arguments").productPath;
		},

		onProductItemPress: function (oEvent) {
			var oBndngCtxt = oEvent.getSource().getBindingContext("oGlobalModel");
			var spath = oBndngCtxt.getPath();
			var selectedPath = oBndngCtxt.getProperty(spath);
			this.getView()
			  .getModel("oGlobalModel")
			  .setProperty("/", { detailProduct: selectedPath });
			this.getRouter().navTo("productDetail", {
			  detailObj: selectedPath.product_name,
			});
		  },

		onSearch: function (oEvent) {
			var oProductSearchState = [],
				sQuery = oEvent.getParameter("query");
			if (sQuery && sQuery.length > 0) {
				oProductSearchState = [new Filter("product_name", FilterOperator.Contains, sQuery)];
			}
			this.oGridList.getBinding("items").filter(oProductSearchState, "Application");
		},
		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oGridList.getBinding("pages"),
				oSorter = new Sorter("product_name", this._bDescendingSort);
			oBinding.sort(oSorter);
		},
		onFilterSelect: function (oEvent) {
			var sQuery = oEvent.getParameter("key");
			this.setProductItemsModel(sQuery, true);
		},

		onProductFilter: function (_sId) {
			var oBinding = this.oGridList.getBinding("items");
			var aSelectedProduct = [];
			var filter = new Filter("category", FilterOperator.EQ, _sId);
			aSelectedProduct.push(filter);

			// update list binding
			oBinding.filter(aSelectedProduct);

		}

	});
});
