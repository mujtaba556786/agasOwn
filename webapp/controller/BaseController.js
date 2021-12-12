sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "../model/cart",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "ag/agasown/service/Service",
    "sap/m/MessageBox"
], function (Controller, UIComponent, JSONModel, Device, cart, Fragment, formatter, History, Service, MessageBox) {
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
        getService: function () {
            return Service;

        },

        setHeaderModel: function () {
            var iPagesCount = 1;

            if (Device.system.desktop) {
                iPagesCount = 4;
            } else if (Device.system.tablet) {
                iPagesCount = 2;
            }

            var oViewModel = new JSONModel({
                welcomeLogo: 'ag/agasown/img/LOGO-HQ.png',
                welcomeCarouselShipping: 'ag/agasown/img/BANNER-1.jpg',
                welcomeCarouselInviteFriend: 'ag/agasown/img/BANNER-2.jpg',
                welcomeCarouselTablet: 'ag/agasown/img/BANNER-3.jpg',
                welcomeCarouselCreditCard: 'ag/agasown/img/BANNER-4.jpg',
                welcomeNews: 'ag/agasown/img/newsletter_footer.jpeg',
                facebook: 'ag/agasown/img/facebook.svg',
                youtube: 'ag/agasown/img/youtube.svg',
                instagram: 'ag/agasown/img/instagram.svg',
                pinterest: 'ag/agasown/img/pinterest.svg',
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
            var oView = this.getView();

            // create popover
            if (!this._oPopover) {
                this._oPopover = Fragment.load({
                    id: oView.getId(),
                    name: "ag.agasown.view.fragment.Menu",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }
            this._oPopover.then(function (oPopover) {
                oPopover.openBy(oMenu);
            });
        },

        /**
         * Always navigates back to home
         * @override
         */
        onNavBackHome: function () {
            this.getRouter().navTo("home");
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
            var sGoToCardId = this.byId("goToCart");
            var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var oBndngCtxt = oEvent.getSource().getBindingContext("oDataProducts");
            var spath = oBndngCtxt.getPath();
            var oSelectedPath = oBndngCtxt.getProperty(spath);
            var oDataProducts = this.getView().getModel("oDataProducts");
            if (oSelectedPath.hasOwnProperty("product_name")) {
                sGoToCardId.setEnabled(true);
                cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);
            }
        },

        onLoginOpen: function (oEvent) {
            var oCustomer = this.getView().getModel("oGlobalModel").getProperty("/customer");

            if (oCustomer !== undefined) {
                this.handleLogout(oEvent);
            } else {
                this.handleLogin();
            }

        },
        handleLogin: function () {
            var oView = this.getView();
            // creates requested dialog if not yet created
            if (!this._mLoginDialog) {
                this._mLoginDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ag.agasown.view.fragment.loginDialog.Login",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._mLoginDialog.then(function (oDialog) {
                // opens the requested dialog
                oDialog.open();
            });
        },

        onLoginClose: function () {
            this._mLoginDialog.then(function (oDialog) {
                oDialog.close();
            });
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
        onNavBack: function () {
            var oHistory = History.getInstance();
            var oPrevHash = oHistory.getPreviousHash();
            if (oPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("home");
            }
        },

        onPressImprint: function () {
            this.getRouter().navTo("information");
        },

        onPressRegistration: function () {
            this.getRouter().navTo("registration");
        },

        onPressFaceBook: function () {
            alert("Oh Crap!!! this function is not ready yet!!!!");
        },

        onLogin: function () {
            var _sUrl = "http://localhost:8000/login/";
            var _sLoginEmail = this.byId("loginEmailInput").getValue();
            var _sLoginPassword = this.byId("loginPasswordInput").getValue();
            var oData = {
                "email": _sLoginEmail,
                "password": _sLoginPassword,
            }
            this.getService().onPost(_sUrl, oData)
                .then((oSuccess) => {
                    this.onLoginSucces(oSuccess);
                })
                .catch((oError) => {
                    MessageBox.error(oError.responseText)
                })
        },
        onLoginSucces: function (oData) {
            var oGlobalModel = this.getView().getModel("oGlobalModel");
            oGlobalModel.setProperty("/customer", oData);
            this.onNavToCustomer();
        },
        onNavToCustomer: function () {
            this.getRouter().navTo("customer");
        },
        onLogout: function () {
            var _sUrl = "http://localhost:8000/logout/";
            var oGlobalModel = this.getView().getModel("oGlobalModel");
            var oCustomer = oGlobalModel.getData().customer;
            var oData = {
                user_id: oCustomer.id,
                access_token: oCustomer.token.access_token
            };
            this.getService().onPost(_sUrl, oData)
                .then((oSuccess) => {
                    console.log("oSucess", oSuccess);
                    oGlobalModel.setProperty("/customer", "");
                })
                .catch((oError) => {
                    MessageBox.error(oError.responseText)
                })
        },

        handleLogout: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            // create popover
            if (!this._pLogoutPopover) {
                this._pLogoutPopover = Fragment.load({
                    id: oView.getId(),
                    name: "ag.agasown.view.fragment.loginDialog.Logout",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }
            this._pLogoutPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        }

    });
});