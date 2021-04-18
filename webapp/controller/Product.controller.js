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

			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.getRoute("product").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sCategoryId = oEvent.getParameter("arguments").productPath;
			var oTableSearchState = [new Filter("category_id", FilterOperator.EQ, sCategoryId)];
			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
		},

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("product_name", FilterOperator.Contains, sQuery)];
			}

			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function () {
			MessageBox.information("This functionality is not ready yet.", { title: "Aw, Snap!" });
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oProductsTable.getBinding("items"),
				oSorter = new Sorter("product_name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},
		/**
				 * Always navigates back to home
				 * @override
				 */
		onBack: function () {
			this.getRouter().navTo("home");
		},
		onListItemPress: function (oEvent) {
			var oBndngCtxt = oEvent.getSource().getBindingContext("oGlobalModel");
			var spath = oBndngCtxt.getPath();
			var selectedPath = oBndngCtxt.getProperty(spath);

			this.getView().getModel("oGlobalModel").setProperty("/", { "detailProduct": selectedPath });

			//var eventBus = sap.ui.getCore().getEventBus();
			//eventBus.publish("ProductDetail", "ProductDetailEvent", selectedPath);
			//var oProductDetail = oEvent.getSource().getBindingContext("oDataProducts").getPath().substr(1);
			this.getRouter().navTo("productDetail", {
				"detailObj": selectedPath.id
			});
		}
	});
});
