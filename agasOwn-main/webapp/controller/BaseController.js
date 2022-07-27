sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "../model/cart",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "ag/agasown/service/Service",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    Device,
    cart,
    Fragment,
    formatter,
    History,
    Service,
    MessageBox,
    MessageToast
  ) {
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
          welcomeLogo: "ag/agasown/img/LOGO-HQ.png",
          welcomeLogoVertical: "ag/agasown/img/Vertical-HQ.png",
          welcomeCarouselShipping: "ag/agasown/img/BANNER-1.jpg",
          welcomeCarouselInviteFriend: "ag/agasown/img/BANNER-2.jpg",
          welcomeCarouselTablet: "ag/agasown/img/BANNER-3.jpg",
          welcomeCarouselCreditCard: "ag/agasown/img/BANNER-4.jpg",
          welcomeNews: "ag/agasown/img/newsletter_footer.jpeg",
          facebook: "ag/agasown/img/facebook.svg",
          youtube: "ag/agasown/img/youtube.svg",
          instagram: "ag/agasown/img/instagram.svg",
          pinterest: "ag/agasown/img/pinterest.svg",
          ShoppingBags: "ag/agasown/img/ShoppingBags.jpg",
          ShoppingCart: "ag/agasown/img/ShoppingCart.jpg",
          Promoted: [],
          Viewed: [],
          Favorite: [],
          Currency: "EUR",
          pagesCount: iPagesCount,
        });
        this.getView().setModel(oViewModel, "view");
      },
      onShowCategories: function (oEvent) {
        var oMenu = oEvent.getSource();
        var oView = this.getView();

        this.byId("target").addEventDelegate(
          {
            onmouseover: this._showPopover,
            onmouseout: this._clearPopover,
          }.then(function (oPopover) {
            oView.addDependent(oPopover);
            return oPopover;
          })
        );
      },
      // popover
      _showPopover: function () {
        this._timeId = setTimeout(() => {
          this.byId("popover").openBy(this.byId("target"));
        }, 500);
      },

      onShowCategories: function (oEvent) {
        var oMenu = oEvent.getSource();
        var oView = this.getView();

        // create popover
        if (!this._oPopover) {
          this._oPopover = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.Menu",
            controller: this,
          }).then(function (oPopover) {
            oView.addDependent(oPopover);
            return oPopover;
          });
        }
        this._oPopover.then(function (oPopover) {
          oPopover.openBy(oView);
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
            productPath: sValue1,
          });
        }
      },

      onCategoryLinkPress: function (oEvent) {
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext("oDataCategory");
        var sValue1 = oContext.getProperty("_id");

        var fnFilterCategory = function (item) {
          return item.parent === sValue1;
        };

        var oDataCategory = this.getView().getModel("oDataCategory").getData();
        var selectedCategory = oDataCategory.filter(fnFilterCategory);

        this.getView().getModel("oGlobalModel").setProperty("/", {
          detailCategory: selectedCategory,
        });

        this.getRouter().navTo("product", {
          productPath: sValue1,
        });
      },

      onProductItemPress: function (oEvent) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("oDataProducts");
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);

        this.getView()
          .getModel("oGlobalModel")
          .setProperty("/", { detailProduct: selectedPath });
        this.getRouter().navTo("productDetail", {
          detailObj: selectedPath._id,
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
        var oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
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
// login log out fragment show
          var uid = sessionStorage.getItem("uid");
        var oData = {
          "uid": uid,
        };
        if (oData.uid == null) {
          this.handleLogin(oEvent);
        }else {
        
          this.handleLogout(oEvent);
        }
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
        //this.getRouter().navTo("cart");
        var oMenu = oEvent.getSource();
        var oView = this.getView();

        // create popover
        if (!this._oPopoverCart) {
          this._oPopoverCart = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.Cart",
            controller: this,
          }).then(function (oPopover) {
            oView.addDependent(oPopover);
            return oPopover;
          });
        }
        this._oPopoverCart.then(function (oPopover) {
          oPopover.openBy(oMenu);
        });
      },
      onNavToCheckout: function () {
        //  After logout user cannot access the cart option
        
        var uid = sessionStorage.getItem("uid");
        var oData = {
          "uid": uid,
        };

        if ( oData.uid !== null) {
          this.getRouter().navTo("checkout");
        }
        else if (oData.uid === null) {
          this.getRouter().navTo("home");
          MessageToast.show("You must login first!");
        }
     
        else {
          this.getRouter().navTo("#");
          MessageToast.show("You must add some item");
        }

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

      onLoginSubmit: function () {
        var _sUrl = "http://18.194.155.205:8000/login/";
        var _sLoginEmail = this.byId("loginEmailInput").getValue();
        var _sLoginPassword = this.byId("loginPasswordInput").getValue();
        var oData = {
          email: _sLoginEmail,
          password: _sLoginPassword,
        };
        this.getService()
          .onPost(_sUrl, oData)
          .then((oSuccess) => {
            this.onLoginSucces(oSuccess);
          })
          .catch((oError) => {
            MessageBox.error(oError.responseText);
          });
      },
      //CUSTOM CODE FOR USER NAME

      onLoginSucces: function (oData) {
        var oGlobalModel = this.getView().getModel("oGlobalModel");
        oGlobalModel.setProperty("/customer", oData);
        this.onNavToCustomer();
        this.myName = oData.first_name;
        var oViewModel = new JSONModel({ myName: this.myName });
        this.getView().setModel(oViewModel, "view10");


      },
      onNavToCustomer: function () {
        // create protected route and genarate unique ID
        const myUniversallyUniqueID = globalThis.crypto.randomUUID();
        var oData = {
          uid: myUniversallyUniqueID,
        };
        sessionStorage.setItem("uid", myUniversallyUniqueID);
        if (oData.uid !== null) {
          this.getRouter().navTo("customer");
        }
      },
      onLogout: function () {
        var _sUrl = "http://18.194.155.205:8000/logout/";
        var oGlobalModel = this.getView().getModel("oGlobalModel");
        var oCustomer = oGlobalModel.getData().customer;

        //After log out sent user to home page & refresh
        this.getRouter().navTo("home");
        location.reload();
        // Remove UserID from Session Storage
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("myvalue5");
        var oCustomer = oGlobalModel.getData().customer;
        var oHeaderToken = {
          Authorization: "Bearer " + oCustomer.token.access_token,
        };
        this.getService()
          .onPost(_sUrl, "", oHeaderToken)
          .then((oSuccess) => {
            MessageBox.success(oSuccess);
            oGlobalModel.setProperty("/customer", "");
          })
          .catch((oError) => {
            MessageBox.error(oError.responseText);
          });
      },

      handleLogin: function () {
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mLoginDialog) {
          this._mLoginDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.Login",
            controller: this,
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

      handleLogout: function (oEvent) {
        var oButton = oEvent.getSource(),
          oView = this.getView();

        // create popover
        if (!this._pLogoutPopover) {
          this._pLogoutPopover = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.Logout",
            controller: this,
          })
            .then(function (oPopover) {
              oView.addDependent(oPopover);
              return oPopover;
            });
        }
        this._pLogoutPopover.then(function (oPopover) {
          oPopover.openBy(oButton);
        });
      },
      handleRegistration: function () {
        this.onLoginClose();
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mRegistrationDialog) {
          this._mRegistrationDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.Registration",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      handleRegistrationClose: function () {
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      onSubmit: function (oEvent) {
        var _sUrl = "http://18.194.155.205:8000/sign-up/";
        var _sfirstName = this.byId("firstNameInput").getValue();
        var _slastName = this.byId("lastNameInput").getValue();
        var _sEmail = this.byId("emailInput").getValue();
        var _sPasswordInput = this.byId("passwordInput").getValue();
        var _sConfirmPasswordInput = this.byId(
          "confirmPasswordInput"
        ).getValue();

        var oData = {
          first_name: _sfirstName,
          last_name: _slastName,
          email: _sEmail,
          password: _sPasswordInput,
          confirm_password: _sConfirmPasswordInput,
        };
        this.getService()
          .onPost(_sUrl, oData)
          .then((oSuccess) => {
            MessageBox.success(oSuccess.detail);
          })
          .catch((oError) => {
            MessageBox.error(oError.responseJSON.detail);
          });
      },
    });
  }
);
