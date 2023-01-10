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
    "sap/ui/model/resource/ResourceModel",
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
    MessageToast,
    ResourceModel
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
      onBeforeRendering: function () { },
      onInit: function () {
        this._initI18n();

      },
      _initI18n: function () {
        var i18n = "i18n";
        //create bundle descriptor for this controllers i18n resource data
        var metadata = this.getMetadata(this);
        var nameParts = metadata.getName().split(".");
        nameParts.pop();
        nameParts.push(i18n);
        nameParts.push(i18n);
        var bundleData = { bundleName: nameParts.join(".") };
        //Use the bundledata to create or enhance the i18n model
        var i18nModel = this.getModel(i18n);
        if (i18nModel) {
          i18nModel.enhance(bundleData);
        } else {
          i18nModel = new ResourceModel(bundleData);
        }
        //set this i18n model.
        this.setModel(i18nModel, i18n);
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
          AboutUs: "ag/agasown/img/AboutUsPage.jpg",
          Jewel: "ag/agasown/img/goyna.jpg",
          Promoted: [],
          Viewed: [],
          Favorite: [],
          Currency: "EUR",
          pagesCount: iPagesCount,
        });
        this.getView().setModel(oViewModel, "view");
        this.setMenuLinksHover();
      },
      setMenuLinksHover: function () {
        this.byId("target").addEventDelegate(
          {
            onmouseover: this._showPopover,
          },
          this
        );
        this.byId("menuLinks").addEventDelegate(
          {
            onmouseover: this.onMouseOverMenuLinks,
          },
          this
        );
      },
      //! Hover function on menu button
      _showPopover: function () {
        this._timeId = setTimeout(() => {
          this.byId("popover").openBy(this.byId("target"));
        });
      },
      /**
       * Always navigates back to home
       * @override
       */
      onNavBackHome: function () {
        this.getRouter().navTo("home");
      },

      handleCategoryLink: function (oEvent, oCntxtName) {
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext(oCntxtName);
        var sCategoryId = oContext.getProperty("_id");
        var sCategoryName = oContext.getProperty("category_name");

        var fnFilterCategory = function (item) {
          return item.parent === sCategoryId;
        };

        var oDataCategory = this.getView().getModel("oDataCategory").getData();
        var selectedCategory = oDataCategory.filter(fnFilterCategory);

        this.getView().getModel("oMenuModel").setProperty("/", {
          detailCategory: selectedCategory,
        });

        this.setProductItemsModel(sCategoryId);

        this.getRouter().navTo("product", {
          productPath: sCategoryName,
        });
      },
      onMouseOverMenuLinks: function (oEvent) {
        var selectedCtgryId =
          oEvent.currentTarget.getAttribute("data-categoryid");
        var fnFilterCategory = function (item) {
          return item.parent === selectedCtgryId;
        };

        var oDataCategory = this.getView().getModel("oDataCategory").getData();
        var selectedCategory = oDataCategory.filter(fnFilterCategory);

        this.getView().getModel("oMenuModel").setProperty("/", {
          detailCategory: selectedCategory,
        });
      },

      onCategoryLinkPress: function (oEvent) {
        this.handleCategoryLink(oEvent, "oDataCategory");
      },

      onSubCategoryLinkPress: function (oEvent) {
        this.handleCategoryLink(oEvent, "oMenuModel");
      },

      setProductItemsModel: function (selectedCtgryId) {
        var fnFilterProducts = function (item) {
          return item.category === selectedCtgryId;
        };
        var oDataProducts = this.getView().getModel("oDataProducts").getData();
        var selectedProducts = oDataProducts.filter(fnFilterProducts);

        this.getView().getModel("oGlobalModel").setProperty("/", {
          productLists: selectedProducts,
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
          detailObj: selectedPath.product_name,
        });
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
        // this.onLoginSucces();
        // login log out fragment show
        var uid = sap.ui.getCore()._customerID;
        var Guid = sap.ui.getCore()._GcustomerID;
        if (!uid && !Guid) {
          this.handleLogin(oEvent);
        } else {
          this.handleLogout(oEvent);
        }
      },
      onLanguageSelect: function () {
        //just for try
        var i18nModel = new ResourceModel({
          bundleName: "ag.agasown.i18n.i18n",
          supportedLocales: ["en", "de"],
          fallbackLocale: "",
        });
        this.getView().setModel(i18nModel, "i18n");
        //try is done
        if (document.documentElement.lang.includes("en")) {
          sap.ui.getCore().getConfiguration().setLanguage("de");
          MessageToast.show("Switched to German");
        } else {
          sap.ui.getCore().getConfiguration().setLanguage("en");
          MessageToast.show("Switched to English");
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
        var uid = sap.ui.getCore()._customerID;
        var gid = sap.ui.getCore()._GcustomerID;
        var pid = sessionStorage.getItem("myvalue5");

        if ((uid !== null && pid !== null) || gid !== null) {
          this.getRouter().navTo("checkout");
          this.checkOutFunctionality();
        } else if (uid === null) {
          this.getRouter().navTo("home");
          MessageToast.show("You must login first!");
        } else if (pid === null) {
          this.getRouter().navTo("home");
          MessageToast.show("You must add some item!");
        } else {
          this.getRouter().navTo("#");
          MessageToast.show("You must add some item");
        }
      },

      checkOutFunctionality: function () {
        var quantity = {};
        var oCartModel = this.getView().getModel("oDataProducts");
        var raw;
        var globalVar;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var oCartEntries = oCartModel.getProperty("/cartEntries");
        //TODO have to check another way
        if (oCartEntries !== undefined) {
          Object.keys(oCartEntries).forEach(function (sProductId) {
            var oProduct = oCartEntries[sProductId];
            quantity[sProductId] = oProduct.Quantity;
            var customer_id_guest = sap.ui.getCore()._GcustomerID;
            var customer_id_login = sap.ui.getCore()._customerID;
            if (!customer_id_guest) {
              var customer_id = customer_id_login;
            } else {
              customer_id = customer_id_guest;
            }

            raw = JSON.stringify({
              "customer_id": customer_id,
              "quantity": quantity
            });

          });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          fetch("http://64.227.115.243:8080/total_amount/", requestOptions)
            .then(response => response.json())
            .then(result => {
              globalVar = Object.values(result);
              sap.ui.getCore()._globalVar = globalVar;
            })
            .catch(error => console.log("error", error));
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
      //Guest Login Dailog Box
      handleGuestLogin: function () {
        if (this._mLoginDialog !== undefined) {
          this.onLoginClose();
        }
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mGuestLoginDialog) {
          this._mGuestLoginDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.GuestLogin",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mGuestLoginDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      //Guest To Customer Dailog Box

      onGuestOpen: function (oEvent) {
        this.handleGuestLogin(oEvent);
      },
      onGuestToCustomerOpen: function (oEvent) {
        if (this._mLoginDialog !== undefined) {
          this.onLoginClose();
        }
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mGuestToCustomerLoginDialog) {
          this._mGuestToCustomerLoginDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.GuestToCustomer",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mGuestToCustomerLoginDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      onGuestLoginClose: function () {
        this._mGuestLoginDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      onGuestToCustomerLoginClose: function () {
        this._mGuestToCustomerLoginDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      validate: function () {
        var email = this.byId("guestLoginEmail").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
          alert(email + " is not a valid email address");
          this.getView().byId("guestLoginEmail").setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView().byId("guestLoginEmail").setValueState(sap.ui.core.ValueState.None);
        }
      },
      onLoginGuestOpen: function () {
        //Try to login

        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();

        if (!first_name || !last_name || !email) {
          alert("Please fill all the required fields")
        } else {
          var formdata = new FormData();
          formdata.append("first_name", first_name);
          formdata.append("last_name", last_name);
          formdata.append("email", email);

          var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          fetch("http://64.227.115.243:8080/guest_login/", requestOptions)
            .then(response => response.json())
            .then(result => {
              var resp = (result.message);
              if (resp == "Email_Id already exists") {
                this.onGuestToCustomerOpen();
              } else if (resp == "Successfully Logged In") {
                var Guest_login = result.customer;
                var token = result.token.access_token;
                sap.ui.getCore()._GcustomerID = Guest_login;
                sap.ui.getCore()._token = token;
                this._mGuestLoginDialog.then(function (oDialog) {
                  oDialog.close();
                });
              }
            })
            .catch(error => console.log('error', error));
        }
      },
      guestLoginSuccess: async function () {
        this.myUserName = this.byId("guestLoginEmail").getValue();
        var email = this.byId("guestLoginEmail").getValue();
        this.credit_card_type_id = "credit_card_type_id";
        var access_token = sap.ui.getCore()._token;
        var myHeaders = new Headers();
        var oHeaderToken = {
          Authorization: "Bearer " + access_token,
        };
        myHeaders.append("Authorization", oHeaderToken.Authorization);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          username: this.myUserName,
          email: email,
          credit_card_type_id: this.credit_card_type_id,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("http://64.227.115.243:8080/customers/", requestOptions)
          .then((response) => response.text())
          .then((oSuccess) => {
            console.log(oSuccess);
          })
          .catch((error) => console.log("error", error));
        //GET Method
        var headEr = new Headers();
        var TokenPass = {
          Authorization: "Bearer " + access_token,
        };
        headEr.append("Authorization", TokenPass.Authorization);

        var req_ans = {
          method: "GET",
          headers: headEr,
          redirect: "follow",
        };

        await fetch("http://64.227.115.243:8080/customers/", req_ans)
          .then((response) => response.text())
          .then((result) => {
            const res = JSON.parse(result).filter(
              (data) => data.user === email
            );
          })
          .catch((error) => console.log("error", error));
      },
      onGuestToCustomer: async function () {
        var password = this.byId("guest_guestPasswordInput").getValue();
        var confirm_password = this.byId("guest_guestConfirmPasswordInput").getValue();
        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();

        if (!password || !confirm_password) {
          alert("Please fill all the required fields")
        } else {

          var formdata = new FormData();
          formdata.append("first_name", first_name);
          formdata.append("last_name", last_name);
          formdata.append("email", email);

          var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          await fetch("http://64.227.115.243:8080/guest_login/", requestOptions)
            .then(response => response.json())
            .then(result => {
              var Guest_login = result.customer_id;
              // sessionStorage.setItem("Guid", Guest_login)
              sap.ui.getCore()._GcustomerID = Guest_login;
            })
            .catch(error => console.log('error', error));
          // var customer_id = sessionStorage.getItem("Guid");
          var customer_id = sap.ui.getCore()._GcustomerID;
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            "customer_id": customer_id,
            "password": password,
            "confirm_password": confirm_password,
            "guest_login": false
          });

          var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("http://64.227.115.243:8080/guest_password/", requestOptions)
            .then(response => response.json())
            .then(result => {
              var resp = Object.values(result);
              if (resp == "Password already stored") {
                sap.ui.getCore()._GcustomerID = null;
                MessageToast.show("You're already a customer!")
                this.handleLogin();
              } else if (resp == "Password doesn't match") {
                MessageToast.show("Password doesn't match");
                sap.ui.getCore()._GcustomerID = null;
              } else {
                MessageToast.show("You are a customer now!");
              }
              this.onGuestLoginClose();
              this.onGuestToCustomerLoginClose();
            })
            .catch(error => console.log("error", error));
        }
      },
      handleGuest: function () {
        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();
        var formdata = new FormData();
        formdata.append("first_name", first_name);
        formdata.append("last_name", last_name);
        formdata.append("email", email);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://64.227.115.243:8080/guest_login/", requestOptions)
          .then(response => response.json())
          .then(result => {
            var Guest_login = result.customer_id;
            // sessionStorage.setItem("Guid", Guest_login)
            sap.ui.getCore()._GcustomerID = Guest_login;
            sap.ui.getCore()._token = result.token.access_token;
            this.onGuestToCustomerLoginClose();
            this.onGuestLoginClose();
          })
          .catch(error => console.log("error", error));

      },
      onPressAboutUs: function () {
        this.getRouter().navTo("about-us");
      },
      onPressContact: function () {
        this.getRouter().navTo("contact");
      },
      onPressImprint: function () {
        this.getRouter().navTo("imprint");
      },
      onPressTerms: function () {
        this.getRouter().navTo("terms-and-services");
      },
      onPressPrivacy: function () {
        this.getRouter().navTo("privacy-policy");
      },
      onPressGDPR: function () {
        this.getRouter().navTo("gdpr");
      },

      onPressFaceBook: function () {
        sap.m.URLHelper.redirect("https://www.facebook.com/agasown/", true);
      },
      onPressYouTube: function () {
        sap.m.URLHelper.redirect(
          "https://www.youtube.com/watch?v=-PlZw4RmNGk&ab_channel=Aga%27sOwn",
          true
        );
      },
      onPressInstaGram: function () {
        sap.m.URLHelper.redirect(
          "https://www.instagram.com/agasown/?hl=en",
          true
        );
      },

      onLoginSubmit: function () {
        var _sUrl = "http://64.227.115.243:8080/login/";
        var _sLoginEmail = this.byId("loginEmailInput").getValue();
        var _sLoginPassword = this.byId("loginPasswordInput").getValue();
        var oData = {
          email: _sLoginEmail,
          password: _sLoginPassword,
        };
        this.getService()
          .onPost(_sUrl, oData)
          .then((oSuccess) => {
            var ans = oSuccess.token.access_token;
            // localStorage.setItem("token", ans);
            sap.ui.getCore()._token = ans;
            this.onLoginSucces(oSuccess);
            this.getRouter().navTo("customer");
            this.onLoginClose();
          })
          .catch((oError) => {
            MessageBox.error(oError.responseText);
          });
      },

      onLoginSucces: async function (oData) {
       var token = sap.ui.getCore()._token
        // var token = localStorage.getItem("token");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        var email = this.byId("loginEmailInput").getValue();
        fetch("http://64.227.115.243:8080/customers", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result).filter(
            (data) => data.email === email
          );
          console.log("blank asbe",res)
          var new_ans = res[0]._id;
          sap.ui.getCore()._customerID = new_ans;
        })
        .catch((error) => console.log("error", error));
      },

      onNavToCustomer: function () {
        var uid = sap.ui.getCore()._customerID;
        var Guid = sap.ui.getCore()._GcustomerID;
        if (uid !== null) {
          this.getRouter().navTo("customer");
        } else if (Guid !== null) {
          MessageToast.show("You must login first!");
        } else {
          this.getRouter().navTo("home");
        }
      },
      onLogout: function () {
        var _sUrl = "http://64.227.115.243:8080/logout/";
        var oGlobalModel = this.getView().getModel("oGlobalModel");
        var token = sap.ui.getCore()._token;
        //After log out sent user to home page & refresh
        this.getRouter().navTo("home");
        // location.reload();
        var oHeaderToken = {
          Authorization: "Bearer " + token,
        };
        this.getService()
          .onPost(_sUrl, "", oHeaderToken)
          .then((oSuccess) => {
            MessageBox.success(oSuccess.detail);
            sap.ui.getCore()._customerID = null;
            sap.ui.getCore()._GcustomerID = null;
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

      handleNewsLetter: function () {
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mNewsLetterDialog) {
          this._mNewsLetterDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.Newsletter",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mNewsLetterDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      onNewsLetter: function () {
        this._mNewsLetterDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      handleForgot: function () {
        this.onLoginClose();
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mForgotDialog) {
          this._mForgotDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.Forgot",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mForgotDialog.then(function (oDialog) {
          // opens the requested dialog
          oDialog.open();
        });
      },

      onForgotClose: function () {
        this._mForgotDialog.then(function (oDialog) {
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
          }).then(function (oPopover) {
            oView.addDependent(oPopover);
            return oPopover;
          });
        }
        this._pLogoutPopover.then(function (oPopover) {
          oPopover.openBy(oButton);
        });
      },
      handleRegistration: function () {
        if (this._mLoginDialog !== undefined) {
          this.onLoginClose();
        }

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

      onLoginPage: function (oEvent) {
        this.handleLogin(oEvent);
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      onContinueShopping: function () {
        this.getRouter().navTo("home");
      },
      remove_product: function () {
        alert("hello");
      },
      onSendMessage: function () {
        var text = this.byId("text_cu").getValue();
        var fname = this.byId("fn_cu").getValue();
        var lname = this.byId("ln_cu").getValue();
        var email = this.byId("email_cu").getValue();
        var order = this.byId("on_cu").getValue();
        var oDataNew = {
          text: text,
          fname: fname,
          lname: lname,
          email: email,
          order: order,
        };
        var text_clear = this.getView().byId("text_cu");
        var fn_clear = this.getView().byId("fn_cu");
        var ln_clear = this.getView().byId("ln_cu");
        var email_clear = this.getView().byId("email_cu");
        var order_clear = this.getView().byId("on_cu");
        text_clear.setValue("");
        fn_clear.setValue("");
        ln_clear.setValue("");
        email_clear.setValue("");
        order_clear.setValue("");
        if (
          oDataNew.email &&
          oDataNew.text &&
          oDataNew.lname &&
          oDataNew.fname &&
          oDataNew.order
        ) {
          var tempParams = {
            from_name: oDataNew.fname,
            last: oDataNew.lname,
            to_name: "Agas'Own Marketing Team",
            message: oDataNew.text,
            email_id: oDataNew.email,
            order_id: oDataNew.order,
          };
          emailjs
            .send("service_mr4cg1j", "template_yxbawkk", tempParams)
            .then(function (res) {
              if (res.status === 200) {
                MessageToast.show(
                  "We received your queries, We will contact you soon!"
                );
              } else {
                MessageToast.show(
                  `${oDataNew.fname} , Sorry! You are not connected with us.`
                );
              }
            });
        } else {
          MessageToast.show("All Fields are mandatory!");
        }
      },

      onCustomerNavigationSelect: function (oEvent) {
        var uid = sap.ui.getCore()._customerID;
        var Guid = sap.ui.getCore()._GcustomerID;
        if (uid !== null) {
          this.getRouter().navTo("customer");
        } else if (Guid !== null) {
          MessageToast.show("You must login first!");
        } else {
          MessageToast.show("You must login first!");
          this.getRouter().navTo("home");
        }
      },
      handleRegistrationClose: function () {
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      //reset password
      emailvalidate: function () {
        // alert("forgot click!!")
        var email = this.getView().byId("emailInputFrgt").getValue();

        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(email)) {
          alert(email + " is not a valid email address");

          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.None);
          alert("email send!");
          var formdata = new FormData();
          formdata.append("email", this.byId("emailInputFrgt").getValue());
          var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
          };

          fetch(
            "http://64.227.115.243:8080/request_reset_email/",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
          this._mForgotDialog.then(function (oDialog) {
            oDialog.close();
          });
        }
      },
      onReturnToShopButtonPress: function () {
        this.getRouter().navTo("home");
      },
      //
      onPasswordSubmit: function (oEvent) {
        var _sPasswordInput1 = this.byId("passwordInput1").getValue();
        var _sConfirmPasswordInput1 = this.byId(
          "confirmPasswordInput1"
        ).getValue();

        // var relative_link = document.location.hash.split("=")[1].split("Q")[1];
        var uidb64 = document.location.hash.split("=")[1].split("_")[1];
        var token = document.location.hash.split("=")[1].split("_")[2];
        alert(uidb64);
        alert(token);

        if (!_sPasswordInput1 || !_sConfirmPasswordInput1) {
          // location.reload();
          alert("Enter valid password");
          this.getView()
            .byId("passwordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
          this.getView()
            .byId("_sConfirmPasswordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
          // alert("field is empty!");
        } else if (_sPasswordInput1 != _sConfirmPasswordInput1) {
          // location.reload();
          alert("not match");
          this.getView()
            .byId("passwordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          var formdata = new FormData();
          formdata.append(
            "password",
            this.byId("confirmPasswordInput1").getValue()
          );
          formdata.append("uidb64", uidb64);
          formdata.append("token", token);

          var requestOptions = {
            method: "PATCH",
            body: formdata,
            redirect: "follow",
          };
          fetch("http://64.227.115.243:8080/reset_password/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              // location.reload();
              MessageToast.show("Reset Password Done!");
            })
            .catch((error) => console.log("error", error));
        }
      },
      onForgotOpen: function (oEvent) {
        this.handleForgot(oEvent);
      },
      onRegisterOpen: function (oEvent) {
        this.handleRegistration(oEvent);
      },
      EmailJs: async function () {
        var news_check = this.getView().byId("news_check");
        var data_acceptance = news_check.mProperties.selected;
        var _nwUrl = "http://64.227.115.243:8080/newsletter/";
        var _nwfirstName = this.byId("firstNameInput1").getValue();
        var _nwlastName = this.byId("lastNameInput1").getValue();
        var _nwEmail = this.byId("emailInput1").getValue();
        let exist_emails = new Array();
        if (data_acceptance === false) {
          alert("Click to accept T&C");
        } else {
          await this.getService()
            .onGet(_nwUrl)
            .then((oSuccess) => {
              var i = oSuccess.length;
              for (var input = 0; input < i; input++) {
                var req_ans = oSuccess[input].email;
                exist_emails.push(req_ans.toLowerCase().trim());
              }
            });
          var oDataa = {
            salutation: "Mr.",
            first_name: _nwfirstName,
            last_name: _nwlastName,
            email: _nwEmail,
            data_acceptance: true,

            agasown: "Aga'sOwn Marketing Team",
            message: "You subscribe to Aga'sOwn Shopping Site",
            text: "Testing",
            user_email: "test@gamil.com",
          };
          if (!exist_emails.includes(oDataa.email.toLowerCase().trim())) {
            this.getService()
              .onPost(_nwUrl, oDataa)
              .then((oSuccess) => {
                MessageBox.success("Successfully subscribed!");
                this._mNewsLetterDialog.then(function (oDialog) {
                  oDialog.close();
                });
              })
              .catch((oError) => {
                console.log("error", oError);
                MessageBox.error("Hey! Mail id already exist!");
              });
          } else {
            MessageToast.show("Mail id already exist!");
            MessageBox.error("Hey! Mail id already exist!");
          }
        }
      },

      onSubmit: function (oEvent) {
        var readData = this.getView().byId("readData");
        var data_acceptance = readData.mProperties.selected;
        var _sUrl = "http://64.227.115.243:8080/sign-up/";
        var _sfirstName = this.byId("firstNameInput").getValue();
        var _slastName = this.byId("lastNameInput").getValue();
        var _sEmail = this.byId("emailInput").getValue();
        var _sPasswordInput = this.byId("passwordInput").getValue();
        var _sConfirmPasswordInput = this.byId(
          "confirmPasswordInput"
        ).getValue();
        if (data_acceptance === false) {
          alert("Click to accept T&C");
        } else {
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
              this._mRegistrationDialog.then(function (oDialog) {
                oDialog.close();
              });
            })
            .catch((oError) => {
              MessageBox.error(oError.responseJSON.detail);
            });
        }
      },
    });
  }
);
