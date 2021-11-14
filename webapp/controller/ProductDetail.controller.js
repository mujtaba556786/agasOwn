sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	"../model/formatter",
	"../model/cart",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"
], function (JSONModel, BaseController, Filter, FilterOperator, 
	Sorter, MessageBox, formatter, cart ,MessageToast, History) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Product", {
		cart: cart,
		formatter: formatter,

		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oDetailProduct = this.oView.byId("detailProduct");
			this.setHeaderModel();

			var aData ={ value: 6, min: 1, max: 100, width: "90px", validationMode: "LiveChange" };
			var oModel = new JSONModel(aData);
			this.getView().setModel(oModel, "detailView");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("productDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {
			var sCurrentRouteName = oEvent.getParameter("name");
			this.getView().getModel("oGlobalModel").setProperty("/currentRouteName", sCurrentRouteName);
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

		/**
		 * Called, when the add button of a product is pressed.
		 * Saves the product, the i18n bundle, and the cart model and hands them to the <code>addToCart</code> function
		 * @public
		 */
		 onAddToCartDetails: function (oEvent) {
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oSelectedPath = this.getView().getModel("oGlobalModel").getData().detailProduct;
			var oDataProducts = this.getView().getModel("oDataProducts");
			cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);
		},
		
		onExit: function () {
			if (this._oPopover) {
				this._oPopover.close();
			}
		}	

	});
});
