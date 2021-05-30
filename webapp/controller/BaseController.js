sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"../model/cart",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/ui/core/routing/History",
], function (Controller, UIComponent, JSONModel, Device, cart, Fragment, formatter, History) {
	"use strict";

	return Controller.extend("ag.agasown.controller.BaseController", {
		cart: cart,
		formatter: formatter,
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		setHeaderModel: function () {
			var iPagesCount = 1;

			if (Device.system.desktop) {
				iPagesCount = 4;
			} else if (Device.system.tablet) {
				iPagesCount = 2;
			}

			var oViewModel = new JSONModel({
				welcomeLogo: 'ag/agasown/img/AgasOwn.jpg',
				welcomeCarouselShipping: 'ag/agasown/img/ShopCarouselShipping.jpg',
				welcomeCarouselInviteFriend: 'ag/agasown/img/ShopCarouselInviteFriend.jpg',
				welcomeCarouselTablet: 'ag/agasown/img/ShopCarouselTablet.jpg',
				welcomeCarouselCreditCard: 'ag/agasown/img/ShopCarouselCreditCard.jpg',
				welcomeNews: 'ag/agasown/img/newsletter_footer.jpeg',
				facebook: 'ag/agasown/img/Facebook.png',
				youtube:'ag/agasown/img/youtube.png',
				instagram: 'ag/agasown/img/Instagram.jpeg',
				pinterest:'ag/agasown/img/pinterest.png',
				category_name: "",
				Promoted: [],
				Viewed: [],
				Favorite: [],
				Currency: "EUR",
				pagesCount: iPagesCount
			});
			this.getView().setModel(oViewModel, "view");

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

		/**
		 * Always navigates back to home
		 * @override
		 */
		onNavBackHome: function () {
			this.getRouter().navTo("home");
			location.reload();
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
			if (oBinding.getLength() !== 0) {
				categoryDetails.setVisible(true);
			} else {
				categoryDetails.setVisible(false);
				this.getRouter().navTo("product", {
					productPath: sValue1
				});
			}
		},

		onCategoryLinkPress: function (oEvent) {
			var sCurrentRouteName = this.getView().getModel("oGlobalModel").getProperty("/currentRouteName");
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("oDataCategory");
			var sValue1 = oContext.getProperty("id");

			var fnFilterCategory = function (item) {
				return item.parent === sValue1;
			}

			var oDataCategory = this.getView().getModel("oDataCategory").getData();
			var selectedCategory = oDataCategory.filter(fnFilterCategory);
			
			this.getView().getModel("oGlobalModel").setProperty("/", {
				"detailCategory": selectedCategory,
			});

			if(sCurrentRouteName === "home") {
				this.onExit();
			}

			this.getRouter().navTo("product", {
				productPath: sValue1
			});
			
		},

		onProductItemPress: function (oEvent) {
			var oBndngCtxt = oEvent.getSource().getBindingContext("oDataProducts");
			var spath = oBndngCtxt.getPath();
			var selectedPath = oBndngCtxt.getProperty(spath);
			//To load detail controller
			this.getRouter().navTo("product", {
				productPath: selectedPath.id
			});
			
			this.getView().getModel("oGlobalModel").setProperty("/", { "detailProduct": selectedPath });
			this.getRouter().navTo("productDetail", {
				"detailObj": selectedPath.id
			});
			this.onExit();
		},

		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		handleCloseMenu: function (oEvent) {
			// note: We don't need to chain to the _pPopover promise, since this event-handler
			// is only called from within the loaded dialog itself.
			//this.byId("myMenu").close();
			if (this._oPopover) {
				this._oPopover.close();
			}
		},
		/**
		 * Called, when the add button of a product is pressed.
		 * Saves the product, the i18n bundle, and the cart model and hands them to the <code>addToCart</code> function
		 * @public
		 */
		onAddToCart: function (oEvent) {
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oBndngCtxt = oEvent.getSource().getBindingContext("oDataProducts");
			var spath = oBndngCtxt.getPath();
			var oSelectedPath = oBndngCtxt.getProperty(spath);
			var oDataProducts = this.getView().getModel("oDataProducts");
			cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);
		},
		onShowCustomer: function () {
			alert("Oh Crap!!! this function is not ready yet!!!!");
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		 getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/** 
		* Navigate to the generic cart view
		* @param {sap.ui.base.Event} @param oEvent the button press event
		*/
	   onToggleCart: function (oEvent) {
		   this.getRouter().navTo("cart");
	   },
	   onNavBack: function(){
		var oHistory = History.getInstance();
		var oPrevHash = oHistory.getPreviousHash();
		if (oPrevHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("home");
		}
	   },

	   onPressImprint: function(){
		this.getRouter().navTo("information");

	   },
	   onPressFaceBook: function(){
		alert("Oh Crap!!! this function is not ready yet!!!!");
	   }
	});
});