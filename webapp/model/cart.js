sap.ui.define([
	"sap/m/MessageToast"
], function (
	MessageToast) {
	"use strict";

	return {

		/**
		 * Checks for the status of the product that is added to the cart.
		 * If the product is not available, a message dialog will open.
		 * @public
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProduct Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 * @param {Object} prod_id ProductID
		 */
		addToCart: function (oBundle, oProduct, oCartModel) {
			this._updateCartItem(oBundle, oProduct, oCartModel);
		},
		deleteFromCart: function (oBundle, oProduct, oCartModel,prod_id) {
			this._updateAfterDelete(oBundle, oProduct, oCartModel,prod_id);
		},

		/**
		 * Function that updates the cart model when a product is added to the cart.
		 * If the product is already in the cart the quantity is increased.
		 * If not, the product is added to the cart with quantity 1.
		 * @private
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProductToBeAdded Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 * @param {Object} prod_id ProductID
		 */
		_updateCartItem: function (oBundle, oProductToBeAdded, oCartModel) {
			// find existing entry for product
			var oCollectionEntries = Object.assign({}, oCartModel.getData()["cartEntries"]);
			var oCartEntry = oCollectionEntries[oProductToBeAdded._id];
			var sessionCartValue = parseInt(sessionStorage.getItem("myvalue5"));
			if (oCartEntry === undefined) {
				// create new entry
				oCartEntry = Object.assign({}, oProductToBeAdded);
				oCartEntry.Quantity = sessionCartValue;
				oCollectionEntries[oProductToBeAdded._id] = oCartEntry;
			} else {
				// update existing entry
				oCartEntry.Quantity += sessionCartValue;
			}
			//update the cart model
			oCartModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
			oCartModel.refresh(true);
			MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.product_name]));
		},
		_updateAfterDelete: function (oBundle, oProductToBeAdded, oCartModel,prod_id) {
			// find existing entry for product
			var oCollectionEntries = Object.assign({}, oCartModel.getData()["cartEntries"]);
			var oCartEntry = oCollectionEntries[prod_id];
			var sessionCartValue = parseInt(sessionStorage.getItem("myvalue5"));
			if (oCartEntry === undefined) {
				// create new entry
				oCartEntry = Object.assign({}, oProductToBeAdded);
				oCartEntry.Quantity = sessionCartValue;
				oCollectionEntries[oProductToBeAdded._id] = oCartEntry;				
			} else {
				// update existing entry
				if(oCartEntry.Quantity>sessionCartValue){
					oCartEntry.Quantity -= 1;
				}
				else{
					MessageToast.show("You've reached at Minimum Product");
				 console.log("=========>",oCartEntry);
				//  sessionStorage.removeItem("myvalue5");


				}
			}  
			//update the cart model
			oCartModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
			oCartModel.refresh(true);
		}
		
	};
});