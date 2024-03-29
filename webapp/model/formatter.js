sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
	"use strict";

	var mStatusState = {
		A: "Success",
		O: "Warning",
		D: "Error",
	};

	var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: ".",
			});
			return numberFormat.format(sValue);
		},

		/**
		 * Sums up the price for all products in the cart
		 * @param {object} product_quantity current cart entries
		 * @return {string} string with the total value
		 * @param {object} product_id current cart entrieses
		 * @return {string} string with the total value
		 */
		totalPrice: function (assignType) {
			// var oBundle = this.getResourceBundle(),
			// 	fTotalPrice = 0;
			// //TODO have to check another way
			// if (oCartEntries !== undefined) {
			// 	Object.keys(oCartEntries).forEach(function (sProductId) {
			// 		var oProduct = oCartEntries[sProductId];
			// 		fTotalPrice += parseFloat(oProduct.price) * oProduct.Quantity;
			// 	});
			// 	return oBundle.getText("cartTotalPrice", [
			// 		formatter.price(fTotalPrice),
			// 	]);
			// }

			var getModel = this.getView().getModel("oCartFinalModel");
			var product_quantity = getModel.oData;

			var totalPrice = 0;
			Object.keys(product_quantity).forEach(function (sProductId) {
				var oProduct = product_quantity[sProductId];
				totalPrice += parseFloat(oProduct.price) * parseFloat(oProduct.quan);
			});
			return totalPrice;
		},
		/**
		 * Returns the status text based on the product status
		 * @param {string} sStatus product status
		 * @return {string} the corresponding text if found or the original value
		 */
		statusText: function (sStatus) { },
		/**
		 * Returns the status text based on the product status
		 * @param {string} sStatus product status
		 * @return {string} the corresponding text if found or the original value
		 */
		productDescription: function (productDetail) { },
		productTitle: function (productTitle) { },
		productHighlight: function (productDetail) { },

		variantLen: async function (productDetail) {
			var ans = productDetail["quantity"];
			var idText = this.getView().byId("product_status");
			var geTerms = localStorage.getItem("deValue");
			var enTerms = localStorage.getItem("enValue");
			idText.removeStyleClass("productStatus");
			idText.removeStyleClass("productStatus2");
			if (geTerms) {
				if (ans > 0) {
					idText.addStyleClass("productStatus");
					return "In Stock";
				} else {
					idText.addStyleClass("productStatus2");
					return "Not Available";
				}
			} else if (enTerms) {
				if (ans > 0) {
					idText.addStyleClass("productStatus");
					return "Auf Lager";
				} else {
					idText.addStyleClass("productStatus2");
					return "Nicht verfügbar";
				}
			} else {
				if (ans > 0) {
					idText.addStyleClass("productStatus");
					return "In Stock";
				} else {
					idText.addStyleClass("productStatus2");
					return "Not Available";
				}
			}
		},
		/**
		 * Returns the product state based on the status
		 * @param {string} sStatus product status
		 * @return {string} the state text
		 */
		statusState: function (sStatus) {
			return mStatusState[sStatus] || "None";
		},

		/**
		 * Returns the relative URL to a product picture
		 * @param {string} sUrl image URL
		 * @return {string} relative image URL
		 */
		pictureUrl: function (sUrl) {
			if (sUrl) {
				return sap.ui.require.toUrl(sUrl);
			} else {
				return undefined;
			}
		},

		/**
			 *
			  @param {} oCollection1
			  @param {} oCollection2
			 */
		jsonPictureUrl: function (sUrl) {
			var that = this;
			this.bUrlExist = false;
			var request = new XMLHttpRequest();
			request.open("GET", sUrl, true);
			request.onload = function () {
				status = request.status;
				if (request.status == 200) {
					//if(statusText == OK)
					that.bUrlExist = true;
				} else {
					that.bUrlExist = false;
				}
			};

			if (!this.bUrlExist) {
				//   return sap.ui.require.toUrl("ag/agasown/img/Vertical-HQ.png");
				return sUrl;
			} else {
				return sap.ui.require.toUrl("ag/agasown/img/Vertical-HQ.png");
			}
		},

		/**
			 *
			  @param {} oCollection1
			  @param {} oCollection2
			 */
		jsonPictureProductUrl: async function (sUrl) {
			var http = new XMLHttpRequest();
			http.open("HEAD", sUrl, false);
			await http.send();
			var defaultUrl = "ag/agasown/img/LOGO-HQ.png";
			if (http.status === 404) {
				return sap.ui.require.toUrl(defaultUrl);
			} else {
				return sap.ui.require.toUrl(sUrl);
			}
		},

		/**
		 * Checks if one of the collections contains items.
		 * @param {object} oCollection1 First array or object to check
		 * @param {object} oCollection2 Second array or object to check
		 * @return {boolean} true if one of the collections is not empty, otherwise - false.
		 */
		hasItems: function (oCollection1, oCollection2) {
			var bCollection1Filled = !!(
				oCollection1 && Object.keys(oCollection1).length
			),
				bCollection2Filled = !!(
					oCollection2 && Object.keys(oCollection2).length
				);

			return bCollection1Filled || bCollection2Filled;
		},

		getCategoryText: function (assignType) {
			var enValue = Boolean(localStorage.getItem('enValue'))

			if (enValue === true && typeof assignType == 'object') {
				// localStorage.setItem('enValue', !enValue)
				return assignType?.category_name_de;
			} else {
				// localStorage.setItem('enValue', !enValue)
				return assignType?.category_name;
			}
		},
		getProductText: function (assignType) {
			var enValue = Boolean(localStorage.getItem('enValue'))

			if (enValue === true && typeof assignType == 'object') {
				// localStorage.setItem('enValue', !enValue)
				return assignType?.title_de;
			} else {
				// localStorage.setItem('enValue', !enValue)
				return assignType?.title;
			}
		},
		/**
		 * Returns the status text based on the product status
		 * @param {string} items product status
		 * @return {string} the corresponding text if found or the original value
		 */

	};

	return formatter;
});
