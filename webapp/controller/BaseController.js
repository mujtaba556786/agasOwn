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
    "sap/ui/core/XMLTemplateProcessor",
    "sap/ui/core/util/XMLPreprocessor",
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
    ResourceModel,
    XMLPreprocessor,
    XMLTemplateProcessor,
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
        this.selectedCategory = [];
        var selectedCtgryId = oEvent.currentTarget.getAttribute("data-categoryid");
        var fnFilterCategory = function (item) {
          return item.parent === selectedCtgryId;
        };

        var oDataCategory = this.getView().getModel("oDataCategory").getData();
        this.selectedCategory = oDataCategory.filter(fnFilterCategory);

        this.getView().getModel("oMenuModel").setProperty("/", {
          detailCategory: this.selectedCategory,
        });
      },
      signUpFirstNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("firstNameInput")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("firstNameInput")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("firstNameInput")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      signUpLastNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("lastNameInput")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("lastNameInput")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("lastNameInput")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      signUpEmailCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var booleanData = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue);
        if (booleanData === false) {
          this.getView()
            .byId("emailInput")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("emailInput")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("emailInput")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      newsFirstNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("newsFName")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("newsFName")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("newsFName")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      newsLastNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("newsLName")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("newsLName")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("newsLName")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      newsEmailCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var booleanData = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue);
        if (booleanData === false) {
          this.getView()
            .byId("newsEmail")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("newsEmail")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("newsEmail")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      guestFNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("guestLoginFN")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("guestLoginFN")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("guestLoginFN")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      guestLNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("guestLoginLN")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("guestLoginLN")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("guestLoginLN")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      guestEmailCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var booleanData = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue);
        if (booleanData === false) {
          this.getView()
            .byId("guestLoginEmail")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("guestLoginEmail")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("guestLoginEmail")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      forgotEmailCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var booleanData = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue);
        if (booleanData === false) {
          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("emailInputFrgt")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("emailInputFrgt")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      loginEmailCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var booleanData = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newValue);
        if (booleanData === false) {
          this.getView()
            .byId("loginEmailInput")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("loginEmailInput")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("loginEmailInput")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },


      onCategoryLinkPress: function (oEvent) {
        this.handleCategoryLink(oEvent, "oDataCategory")
      },

      onSubCategoryLinkPress: function (oEvent) {
        this.selectedCategory = [];
        this.handleCategoryLink(oEvent, "oMenuModel");
      },

      setProductItemsModel: function (selectedCtgryId) {
        var arrayProducts = [];
        var fnFilterCategory = function (item) {
          return item.parent === selectedCtgryId;
        }
        var oDataCategory = this.getView().getModel("oDataCategory").getData();
        var selectedCategory = oDataCategory.filter(fnFilterCategory);
        var fnFilterProducts = function (item) {
          return item.category === selectedCtgryId;
        };
        var fnFilter = function (item) {
          if (selectedCategory.length !== 0) {
            selectedCategory.forEach((category) => {
              if (item.category === category._id) {
                arrayProducts.push(item);
              }
            });
          }
        };
        var oDataProducts = this.getView().getModel("oDataProducts").getData();
        var selectedProducts = oDataProducts.filter(fnFilterProducts);
        oDataProducts.filter(fnFilter);
        var all = [...selectedProducts, ...arrayProducts];
        this.getView().getModel("oGlobalModel").setProperty("/", {
          productLists: all,
        });
      },

      onProductItemPress: function (oEvent) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("oDataProducts");
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);
        this.getView().getModel("oGlobalModel").setProperty("/", { detailProduct: selectedPath });
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
        var uid = localStorage.getItem("access_token");
        var Guid = localStorage.getItem("guest_access_token");
        if (!uid && !Guid) {
          this.handleLogin(oEvent);
        } else {
          this.handleLogout(oEvent);
        }
      },
      onLanguageSelect: function () {
        var i18nModel = new ResourceModel({
          bundleName: "ag.agasown.i18n.i18n",
          supportedLocales: ["en", "de"],
          fallbackLocale: "",
        });
        
        if (document.documentElement.lang.includes("en")) {
          localStorage.setItem('enValue', true);
          localStorage.removeItem('deValue');
          sap.ui.getCore().getConfiguration().setLanguage("de");
          MessageToast.show("Switched to German");
        
        } else {
          localStorage.setItem('deValue', true);
          localStorage.removeItem('enValue');
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
        var uid = localStorage.getItem("access_token");
        var gid = localStorage.getItem("guest_access_token");
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
        } else if (gid !== null && pid !== null) {
          this.getRouter().navTo("checkout");
        } else if (gid !== null && pid === null) {
          this.getRouter().navTo("home");
        }
        else {
          this.getRouter().navTo("home");
        }
      },

      checkOutFunctionality: function () {
        var quantity = {};
        var oCartModel = this.getView().getModel("oDataProducts");
        var raw;
        var globalVar;
        var myHeaders = new Headers();
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");
        if (!guest_access_token) {
          var token = access_token;
        } else {
          token = guest_access_token;
        }
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");
        var oCartEntries = oCartModel.getProperty("/cartEntries");
        if (oCartEntries !== undefined) {
          Object.keys(oCartEntries).forEach(function (sProductId) {
            var oProduct = oCartEntries[sProductId];
            quantity[sProductId] = oProduct.Quantity;
            raw = JSON.stringify({
              "quantity": quantity
            });
          });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
          };
          fetch("http://64.227.115.243:8080/total_amount/", requestOptions)
            .then(response => response.json())
            .then(result => {
              globalVar = Number(Object.values(result));
              this.getView().setModel(globalVar, "oCartItemsData");
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
          MessageBox.information(email + " is not a valid email address");
          this.getView().byId("guestLoginEmail").setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView().byId("guestLoginEmail").setValueState(sap.ui.core.ValueState.None);
        }
      },
      validateLogin: function () {
        var email = this.byId("loginEmailInput").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
          MessageBox.information(email + " is not a valid email address");
          this.getView().byId("loginEmailInput").setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView().byId("loginEmailInput").setValueState(sap.ui.core.ValueState.None);
        }
      },
      validateReg: function () {
        var email = this.byId("emailInput").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
          MessageBox.information(email + " is not a valid email address");
          this.getView().byId("emailInput").setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView().byId("emailInput").setValueState(sap.ui.core.ValueState.None);
        }
      },
      onLoginGuestOpen: function () {
        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(email)) {
          MessageBox.information("Please provide valid email id")
        } else {
          if (!first_name || !last_name || !email) {
            MessageBox.information("Please fill all the required fields")
          }
          else {
            var _sUrl = "http://64.227.115.243:8080/guest_login/";
            var oData = {
              first_name: first_name,
              last_name: last_name,
              email: email
            };
            this.getService()
              .onPost(_sUrl, oData)
              .then((oSuccess) => {
                var resp = (oSuccess.message);
                if (resp == "Email_Id already exists") {
                  this.onGuestToCustomerOpen();
                } else if (resp == "Successfully Logged In") {
                  var Guest_login = oSuccess.customer;
                  sap.ui.getCore()._GcustomerID = Guest_login;
                  localStorage.setItem("guest_access_token", oSuccess.token.access_token);
                  MessageBox.success(`Yaah ${first_name}! ${oSuccess.message} as a New Guest`);
                  this.handleGuestId();
                  this._mGuestLoginDialog.then(function (oDialog) {
                    oDialog.close();
                  });
                }
              })
              .catch((oError) => {
                var data = (JSON.parse(oError.responseText));
                MessageBox.warning(String(Object.values(data)[0]));
              });
          }
        }
      },

      onGuestToCustomer: async function () {
        var password = this.byId("guest_guestPasswordInput").getValue();
        var confirm_password = this.byId("guest_guestConfirmPasswordInput").getValue();
        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();
        var readData = this.getView().byId("guest_readData");
        var data_acceptance = readData.mProperties.selected;

        if (!password || !confirm_password) {
          MessageBox.information("Please fill all the required fields")
        } else {
          if (data_acceptance === false) {
            MessageBox.information("Please accept Terms & Conditions")
          } else if (data_acceptance === true) {
            var guest_token;
            var Guest_login;
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
                Guest_login = result.customer_id;
                sap.ui.getCore()._GcustomerID = Guest_login;
                guest_token = result.token.access_token;
              })
              .catch(error => console.log('error', error));

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + guest_token);

            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };

            fetch(`http://64.227.115.243:8080/customers/${Guest_login}/`, requestOptions)
              .then(response => response.text())
              .then(result => {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + guest_token);

                var formdata = new FormData();
                formdata.append("password", password);
                formdata.append("confirm_password", confirm_password);

                var requestOptions = {
                  method: 'PATCH',
                  headers: myHeaders,
                  body: formdata,
                  redirect: 'follow'
                };

                fetch("http://64.227.115.243:8080/guest_password/", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    var resp = Object.values(result);
                    if (resp == "Password already stored") {
                      localStorage.removeItem("Guest_id")
                      MessageToast.show("You're already a customer!")
                      this.handleLogin();
                    } else if (resp == "Password doesn't match") {
                      localStorage.removeItem("access_token")
                      MessageBox.error("Password doesn't match");
                    } else {
                      localStorage.setItem("access_token", guest_token);
                      MessageToast.show("You are a customer now!");
                    }
                    this.onGuestLoginClose();
                    this.onGuestToCustomerLoginClose();
                  })
                  .catch(error => console.log("error", error));
              })
              .catch(error => console.log('error', error));
          }
        }
      },
      handleGuestId: function () {
        var ID = sap.ui.getCore()._GcustomerID;
        var token = localStorage.getItem("guest_access_token");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        fetch(`http://64.227.115.243:8080/customers/${ID}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            var customer_id = (JSON.parse(result)._id);
            sap.ui.getCore()._boolval = JSON.parse(result).guest_login;
            localStorage.setItem("Guest_id", customer_id)

          })
          .catch((error) => console.log("error", error));
      },
      handleGuest: function () {
        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();
        var bool_val;
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
            sap.ui.getCore()._GcustomerID = Guest_login;
            localStorage.setItem("guest_access_token", result.token.access_token);
            MessageBox.success(`Welcome Back! ${first_name}`);

            var ID = sap.ui.getCore()._GcustomerID;
            var token = localStorage.getItem("guest_access_token")
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
            // var email = this.byId("loginEmailInput").getValue();
            fetch(`http://64.227.115.243:8080/customers/${ID}`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                bool_val = JSON.parse(result).guest_login;
                if (bool_val == true) {
                  this.handleGuestId();
                } else if (bool_val == false) {
                  localStorage.removeItem("access_token");
                  this.onLoginOpen();
                  MessageToast.show("You're already a customer");
                }
              });
            this.onGuestToCustomerLoginClose();
            this.onGuestLoginClose();
          })
          .catch(error => console.log("error", error));
      },

      SetTimeOutTextShow: function () {
        var first_name = this.byId("firstNameInput").getValue();
        setTimeout(() => {
          MessageBox.information("Email Verification Time", first_name);
        }, 2000);
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

      onLoginSubmit: async function () {
        var _sUrl = "http://64.227.115.243:8080/login/";
        var _sLoginEmail = this.byId("loginEmailInput").getValue();
        var _sLoginPassword = this.byId("loginPasswordInput").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!_sLoginEmail || !_sLoginPassword) {
          MessageBox.warning("Please fill all the fields")
        } else if (_sLoginEmail && _sLoginPassword) {
          if (_sLoginEmail && _sLoginPassword) {
            var oData = {
              email: _sLoginEmail,
              password: _sLoginPassword,
            };
            if (!mailregex.test(_sLoginEmail)) {
              MessageBox.information(_sLoginEmail + " is not a valid email address");
            } else {
              await this.getService()
                .onPost(_sUrl, oData)
                .then((oSuccess) => {
                  var ID = oSuccess.id
                  localStorage.setItem("user", ID);
                  var ans = oSuccess.token.access_token;
                  localStorage.setItem("access_token", ans)
                  this.getRouter().navTo("customer");
                  this.onLoginClose();
                  this.setCustomerModel();
                })
                .catch((oError) => {
                  var data = (JSON.parse(oError.responseText));
                  MessageBox.warning(String(Object.values(data)[0]));
                });
            }
          }
        }
      },
      setCustomerModel: async function (sUid) {
        var ID = localStorage.getItem("user")
        var token = localStorage.getItem("access_token");
        var oHeaderToken = {
          Authorization: "Bearer " + token,
        };
        if (!ID) {
          return;
        }
        var _sUrl = `http://64.227.115.243:8080/customers/${ID}`;
        await this.getService()
          .onGet(_sUrl, oHeaderToken)
          .then((oSuccess) => {
            this.getView()
              .getModel("oGlobalModel")
              .setProperty("/", { customerModel: oSuccess });
          })
          .catch((oError) => {
            var data = (JSON.parse(oError.responseText));
            MessageBox.warning(String(Object.values(data)[0]));
          });
      },
      onNavToCustomer: async function () {
        var uid = localStorage.getItem("access_token");
        var Guid = localStorage.getItem("guest_access_token");
        if (uid !== null) {
          this.getRouter().navTo("customer");
          history.go();
        } else if (Guid !== null) {
          MessageToast.show("You must login first!");
        } else {
          this.getRouter().navTo("home");
        }
      },
      onLogout: function () {
        var _sUrl = "http://64.227.115.243:8080/logout/";
        var oGlobalModel = this.getView().getModel("oGlobalModel");
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");

        if (access_token) {
          var token = access_token;
        } else if (guest_access_token) {
          token = guest_access_token;
        }
        //After log out sent user to home page & refresh
        this.getRouter().navTo("home");
        var oHeaderToken = {
          Authorization: "Bearer " + token,
        };
        this.getService()
          .onPost(_sUrl, "", oHeaderToken)
          .then((oSuccess) => {
            MessageBox.success(oSuccess.detail);
            localStorage.clear();
            sessionStorage.clear();
            oGlobalModel.setProperty("/customer", "");
          })
          .catch((oError) => {
            var data = (JSON.parse(oError.responseText));
            MessageBox.warning(String(Object.values(data)[0]));
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
      handleConfirmPD: function () {
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mConfirmPDDialog) {
          this._mConfirmPDDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.ConfirmPD",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mConfirmPDDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      onConfirmPDClose: function () {
        this._mConfirmPDDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      handleConfirmBillAdd: function () {
        var oView = this.getView();
        // creates requested dialog if not yet created
        if (!this._mConfirmBillAddDialog) {
          this._mConfirmBillAddDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.ConfirmBillAdd",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mConfirmBillAddDialog.then(function (oDialog) {
          // opens the requested dialog
          oDialog.open();
        });
      },

      onConfirmBillAddClose: function () {
        this._mConfirmBillAddDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      handleConfirmAdd: function () {
        var oView = this.getView();
        if (!this._mConfirmAddDialog) {
          this._mConfirmAddDialog = Fragment.load({
            id: oView.getId(),
            name: "ag.agasown.view.fragment.dialog.ConfirmAdd",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._mConfirmAddDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      onConfirmAddClose: function () {
        this._mConfirmAddDialog.then(function (oDialog) {
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

      onCustomerNavigationSelect: async function (oEvent) {
        var uid = localStorage.getItem("access_token");
        var Guid = localStorage.getItem("guest_access_token");
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

      emailvalidate: function () {
        var email = this.getView().byId("emailInputFrgt").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
          MessageBox.warning(email + " is not a valid email address");
          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.None);
          MessageBox.information("email send!");
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
            .then((result) => {

            })
            .catch((error) => console.log("error", error));
          this._mForgotDialog.then(function (oDialog) {
            oDialog.close();
          });
        }
      },
      onReturnToShopButtonPress: function () {
        this.getRouter().navTo("home");
      },
      onPasswordSubmit: function (oEvent) {
        var _sPasswordInput1 = this.byId("passwordInput1").getValue();
        var _sConfirmPasswordInput1 = this.byId(
          "confirmPasswordInput1"
        ).getValue();
        var uidb64 = document.location.hash.split("=")[1].split("_")[1];
        var token = document.location.hash.split("=")[1].split("_")[2];

        if (!_sPasswordInput1 || !_sConfirmPasswordInput1) {
          MessageBox.warning("Enter valid password");
          this.getView()
            .byId("passwordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
          this.getView()
            .byId("_sConfirmPasswordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (_sPasswordInput1 != _sConfirmPasswordInput1) {
          MessageBox.warning("not match");
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
      onNewsSubs: async function (data_acceptance) {
        var news_check = this.getView().byId("news_check");
        var data_acceptance = news_check.mProperties.selected;
        var _nwUrl = "http://64.227.115.243:8080/newsletter/";
        var _nwfirstName = this.byId("newsFName").getValue();
        var _nwlastName = this.byId("newsLName").getValue();
        var _nwEmail = this.byId("newsEmail").getValue();
        var final_salutation;
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        var data_acceptance_mr = this.getView().byId("mrSaluNews").getSelected();
        var data_acceptance_mrs = this.getView().byId("mrsSaluNews").getSelected();

        if (data_acceptance_mr === true && data_acceptance_mrs === false) {
          final_salutation = "Mr.";
        } else if (data_acceptance_mr === false && data_acceptance_mrs === true) {
          final_salutation = "Mrs.";
        } else if (data_acceptance_mr === false && data_acceptance_mrs === false) {
          final_salutation = null;
        } else {
          final_salutation = null;
        }

        let exist_emails = new Array();
        if (data_acceptance === false) {
          MessageBox.information("Click to accept Terms & Condition");
        } else {
          if (!_nwfirstName || !_nwlastName || !_nwEmail) {
            MessageBox.information("All Fields are mandatory!")
          } else {
            if (!mailregex.test(_nwEmail)) {
              MessageBox.information(_nwEmail + " is not a valid email address");
            } else {
              if (data_acceptance_mr === true || data_acceptance_mrs === true) {
                if (data_acceptance_mr === true && data_acceptance_mrs === true) {
                  MessageBox.warning("Please Select Single Salutation!")
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
                    salutation: final_salutation,
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
                        var data = (JSON.parse(oError.responseText));
                        MessageBox.warning(String(Object.values(data)[0]));
                      });
                  }
                }
              } else if (data_acceptance_mr === false && data_acceptance_mrs === false) {
                MessageBox.warning("Please Select Any Salutation to continue!")
              }
            }
          }
        }
      },

      onSubmit: function () {
        var readData = this.getView().byId("readData");
        var data_acceptance = readData.mProperties.selected;
        var _sUrl = "http://64.227.115.243:8080/sign-up/";
        var _sfirstName = this.byId("firstNameInput").getValue();
        var _slastName = this.byId("lastNameInput").getValue();
        var _sEmail = this.byId("emailInput").getValue();
        var _sPasswordInput = this.byId("passwordInput").getValue();
        var _sConfirmPasswordInput = this.byId("confirmPasswordInput").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(_sEmail)) {
          MessageBox.information(_sEmail + " is not a valid email address");
        } else {
          if (data_acceptance === false) {
            MessageBox.information("Click to accept Terms & Condition");
          } else {
            if(_sConfirmPasswordInput && _sEmail && _sfirstName && _slastName && _sPasswordInput){
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
                  this.SetTimeOutTextShow();
                  this._mRegistrationDialog.then(function (oDialog) {
                    oDialog.close();
                  });
                })
                .catch((oError) => {
                  MessageBox.error(oError.responseJSON.detail);
                });
            }else if(!_sConfirmPasswordInput || !_sEmail || !_sfirstName || !_slastName || !_sPasswordInput){
              MessageBox.error("All fields are required to be filled to continue")
            }
          }
        }
      },
    });
  }
);
