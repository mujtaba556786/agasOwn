sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"
], function (JSONModel, BaseController, Filter, FilterOperator, 
	Sorter, MessageBox, formatter, MessageToast, History) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Product", {
		formatter: formatter,
		globalDetailData: {},


		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oDetailProduct = this.oView.byId("detailProduct");

			var aData =
				{ value: 6, min: 1, max: 100, width: "90px", validationMode: "LiveChange" }
				;
			var oModel = new JSONModel(aData);
			this.getView().setModel(oModel, "detailView");

			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.subscribe("ProductDetail", "ProductDetailEvent", this._setViewData, this);

			var oRouter = this.getOwnerComponent().getRouter(this);
			oRouter.getRoute("productDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_setViewData: function (sChannel, sEvent, oData) {
			this.globalDetailData = oData;
		},

		_onObjectMatched: function () {
			console.log("this.oDetailData", this.globalDetailData);
			var oDataProducts = new JSONModel(this.globalDetailData);
			this.oView.setModel(oDataProducts, "detailProduct");
		},

		onAdd: function () {
			MessageBox.information("This functionality is not ready yet.", { title: "Aw, Snap!" });
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oProductsTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},
		onChange: function (oEvent) {
			MessageToast.show("Value changed to '" + oEvent.getParameter("value") + "'");
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("product", true);
			}
		}

	});
});
