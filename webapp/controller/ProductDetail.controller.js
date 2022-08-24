sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./BaseController",
	'sap/ui/model/Sorter',
	"../model/formatter",
	"../model/cart",
	"sap/m/MessageToast"
], function (JSONModel, BaseController,
	Sorter, formatter, cart, MessageToast) {
	"use strict";

	return BaseController.extend("ag.agasown.controller.Product", {
		cart: cart,
		formatter: formatter,

		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oDetailProduct = this.oView.byId("detailProduct");
			this.setHeaderModel();

			var aData = { value: 6, min: 1, max: 100, width: "90px", validationMode: "LiveChange" };
			var oModel = new JSONModel(aData);
			this.getView().setModel(oModel, "detailView");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("productDetail").attachPatternMatched(this._onObjectMatched, this);
			//! Hover function on menu button
			this.byId("target").addEventDelegate({
				onmouseover: this._showPopover,
				// onmouseout: this._clearPopover,
			  }, this);},
		handleImagePress: function (oEvent) {
			var oView = this.getView().byId("bigImg");
			var sImgSrc = oEvent.getSource().getSrc();
			oView.setSrc(sImgSrc);
		},
    //! Hover function on menu button
_showPopover: function () {
	this._timeId = setTimeout(() => {
	  this.byId("popover").openBy(this.byId("target"));
	}, 500);
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
		}

	});
});
