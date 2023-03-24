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
          MessageToast.show("Ins Englische übersetzen");

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
        var product_id;
        var product_quantity;
        var user_id = localStorage.getItem("user");
        var req_url = `http://64.227.115.243:8080/customers/${user_id}/`;
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");
        var token;

        if (access_token) {
          token = access_token;
        } else if (guest_access_token) {
          token = guest_access_token;
        }

        var oHeaderToken = {
          Authorization: "Bearer " + token
        }
        if (user_id) {
          this.getService().onGet(req_url, oHeaderToken).
            then(async (oSuccess) => {
              product_id = oSuccess.checkout;
              product_quantity = oSuccess.checkout_quantity;
              var id_exists = product_id.length 

              if (id_exists !== 0) {
                var globArr = [];
                var answ = product_id.split(',');
                answ.forEach(function (obj) {
                  globArr.push(obj);
                });
                const data = globArr.map(async (item) => {
                  return await this.onGetCartDataProductDetails(item);
                })
                const product = await Promise.all(data);

                if (product_quantity !== null) {
                  var globArray = [];
                  var newansw = product_quantity.split(',');
                  newansw.forEach(function (obj) {
                    globArray.push(Number(obj));
                  });
                } else {
                  //pass product
                }
                var eachProduct = product.map((i, ine) => {
                  i.quan = globArray[ine]
                  return i;

                });
                var oCartFinalModel = new JSONModel(eachProduct);
              } else {
                oCartFinalModel = new JSONModel(null);  //pass product
              }
              this.getView().setModel(oCartFinalModel, "oCartFinalModel");
            }).catch((oError) => {
              console.log("error", oError);
            });
        }


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
      onGetCartDataProductDetails: async function (item) {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const res = await fetch(`http://64.227.115.243:8080/products/${item}`, requestOptions)
        return res.json();

      },

      onNavToCheckout: function () {
        //  After logout user cannot access the cart option
        var uid = localStorage.getItem("access_token");
        var gid = localStorage.getItem("guest_access_token");
        var pid = this.getView().getModel("oCartFinalModel").getData();
        var geTerms = localStorage.getItem('deValue');
        var enTerms = localStorage.getItem('enValue');

        if ((uid !== null && pid !== null) || gid !== null) {
          this.getRouter().navTo("checkout");
          this.checkOutFunctionality();
          
        } else if (uid === null) {
          this.getRouter().navTo("home");
          if (geTerms) {
            MessageToast.show("Hi friend, you must login first!");
          } else if (enTerms) {
            MessageToast.show("Hallo Freund, Sie müssen sich zuerst anmelden!");
          } else {
            MessageToast.show("Hi friend, you must login first!")
          }
        } else if (pid === null) {
          this.getRouter().navTo("home");
          if (geTerms) {
            MessageToast.show("You must add some item!");
          } else if (enTerms) {
            MessageToast.show("Sie müssen ein Element hinzufügen!");
          } else {
            MessageToast.show("You must add some item!");
          }
        } else if (gid !== null && pid !== null) {
          this.getRouter().navTo("checkout");
        } else if (gid !== null && pid === null) {
          this.getRouter().navTo("home");
        }
        else {
          this.getRouter().navTo("home");
        }
      },

      checkOutFunctionality: async function () {
        var globalVar;
        var _sUrl = "http://64.227.115.243:8080/total_amount/";
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");
        if (!guest_access_token) {
          var token = access_token;
        } else {
          token = guest_access_token;
        }
        var oHeaderToken = {
          Authorization: "Bearer " + token,
        };
        await this.getService()
          .onPost(_sUrl, "", oHeaderToken)
          .then((oSuccess) => {
            globalVar = Number(Object.values(oSuccess));
            this.getView().setModel(globalVar, "oCartItemsData");
            sap.ui.getCore()._globalVar = globalVar;
          }).catch(error => console.log("error", error));
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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        if (!mailregex.test(email)) {
          if (geTerms) {
            MessageBox.information(`${email} is not a valid email address`);
          } else if (enTerms) {
            MessageBox.information(`${email} ist keine gültige E-Mail-Adresse`)
          } else {
            MessageBox.information(email + " is not a valid email address");
          }

          this.getView().byId("guestLoginEmail").setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView().byId("guestLoginEmail").setValueState(sap.ui.core.ValueState.None);
        }
      },
      validateLogin: function () {
        var email = this.byId("loginEmailInput").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        if (!mailregex.test(email)) {
          if (geTerms) {
            MessageBox.information(`${email} is not a valid email address`);
          } else if (enTerms) {
            MessageBox.information(`${email} ist keine gültige E-Mail-Adresse`)
          } else {
            MessageBox.information(email + " is not a valid email address");
          }
          this.getView().byId("loginEmailInput").setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView().byId("loginEmailInput").setValueState(sap.ui.core.ValueState.None);
        }
      },
      validateReg: function () {
        var email = this.byId("emailInput").getValue();
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
          if (geTerms) {
            MessageBox.information(`${email} is not a valid email address`);
          } else if (enTerms) {
            MessageBox.information(`${email} ist keine gültige E-Mail-Adresse`)
          } else {
            MessageBox.information(email + " is not a valid email address");
          }
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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");

        if (!mailregex.test(email)) {
          if (geTerms) {
            MessageBox.information("Please provide a valid email address");
          } else if (enTerms) {
            MessageBox.information("Bitte geben Sie eine gültige E-Mail Adresse an");
          } else {
            MessageBox.information("Please provide a valid email address");
          }
        } else {
          if (!first_name || !last_name || !email) {
            if (geTerms) {
              MessageBox.information("Please fill all the required fields");
            } else if (enTerms) {
              MessageBox.information("Bitte füllen Sie alle Pflichtfelder aus");
            } else {
              MessageBox.information("Please fill all the required fields");
            }
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

                  if (geTerms) {
                    MessageBox.success(`Yaah ${first_name}! ${oSuccess.message} as a New Guest`);
                  } else if (enTerms) {
                    MessageBox.success(`Yaah ${first_name}! Erfolgreich als Neuer Gast angemeldet`)
                  } else {
                    MessageBox.success(`Yaah ${first_name}! ${oSuccess.message} as a New Guest`);
                  }

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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");

        if (!password || !confirm_password) {
          if (geTerms) {
            MessageBox.information("Please fill all the required fields");
          } else if (enTerms) {
            MessageBox.information("Bitte füllen Sie alle Pflichtfelder aus");
          } else {
            MessageBox.information("Please fill all the required fields");
          }

        } else {
          if (data_acceptance === false) {
            if (geTerms) {
              MessageBox.information("Please accept Terms and Conditions");
            } else if (enTerms) {
              MessageBox.information("Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen");
            } else {
              MessageBox.information("Please accept Terms & Conditions");
            }
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
                      if (geTerms) {
                        MessageToast.show("You're already a customer!");
                      } else if (enTerms) {
                        MessageToast.show("Sie sind bereits Kunde!")
                      } else {
                        MessageToast.show("You're already a customer!");
                      }
                      this.handleLogin();
                    } else if (resp == "Password doesn't match") {
                      localStorage.removeItem("access_token")
                      if (geTerms) {
                        MessageBox.error("Password doesn't match");
                      } else if (enTerms) {
                        MessageBox.error("Passwort stimmt nicht überein");
                      } else {
                        MessageBox.error("Password doesn't match");
                      }
                    } else {
                      localStorage.setItem("access_token", guest_token);
                      if (geTerms) {
                        MessageToast.show("Congrats! You are a customer now!");
                      } else if (enTerms) {
                        MessageBox.show("Glückwunsch! Sie sind jetzt Kunde!")
                      } else {
                        MessageToast.show("Congratulations! You are a customer now!");
                      }
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
      handleGuestId: async function () {
        var ID = sap.ui.getCore()._GcustomerID;
        var token = localStorage.getItem("guest_access_token");

        var oHeaderToken = {
          Authorization: "Bearer " + token,
        };
        var _sUrl = `http://64.227.115.243:8080/customers/${ID}`;
        await this.getService()
          .onGet(_sUrl, oHeaderToken)
          .then((oSuccess) => {
            var customer_id = oSuccess._id;
            sap.ui.getCore()._boolval = oSuccess.guest_login;
            localStorage.setItem("Guest_id", customer_id)
          })
          .catch((oError) => {
            console.log("oError", oError);
          });
      },
      handleGuest: function () {
        var first_name = this.byId("guestLoginFN").getValue();
        var last_name = this.byId("guestLoginLN").getValue();
        var email = this.byId("guestLoginEmail").getValue();
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        var bool_val;
        var _sUrl = "http://64.227.115.243:8080/guest_login/";
        var oData = {
          first_name: first_name,
          last_name: last_name,
          email: email
        };
        this.getService()
          .onPost(_sUrl, oData).then((oSuccess) => {
            var Guest_login = oSuccess.customer_id;
            sap.ui.getCore()._GcustomerID = Guest_login;
            localStorage.setItem("guest_access_token", oSuccess.token.access_token);
            if (geTerms) {
              MessageBox.success(`Welcome Back! ${first_name}`);
            } else if (enTerms) {
              MessageBox.success(`Willkommen zurück! ${first_name}`);
            } else {
              MessageBox.success(`Welcome Back! ${first_name}`);
            }

            var ID = sap.ui.getCore()._GcustomerID;
            var token = localStorage.getItem("guest_access_token");
            var oHeaderToken = {
              Authorization: "Bearer " + token,
            };
            var newUrl = `http://64.227.115.243:8080/customers/${ID}`;
            this.getService()
              .onGet(newUrl, oHeaderToken)
              .then((oSuccess) => {
                bool_val = oSuccess.guest_login;
                this.SetTimeOutTextShow();
                if (bool_val == true) {
                  this.handleGuestId();
                } else if (bool_val == false) {
                  localStorage.removeItem("access_token");
                  this.onLoginOpen();
                  if (geTerms) {
                    MessageToast.show("You're already a customer");
                  } else if (enTerms) {
                    MessageToast.show("Sie sind bereits Kunde")
                  } else {
                    MessageToast.show("You're already a customer");
                  }
                }
              });
            this.onGuestToCustomerLoginClose();
            this.onGuestLoginClose();

          })
          .catch(error => console.log("error", error));
      },

      SetTimeOutTextShow: function () {
        var first_name = this.byId("guestLoginFN").getValue();
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        setTimeout(() => {
          if (geTerms) {
            MessageBox.information(`Dear ${first_name}, Let's become customer to explore more!`);
          } else if (enTerms) {
            MessageBox.information(`Liebling ${first_name}, Lassen Sie uns Kunde werden, um mehr zu entdecken!`)
          } else {
            MessageBox.information(`Hey ${first_name}, Let's become customer to explore more!`);
          }
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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");


        if (!_sLoginEmail || !_sLoginPassword) {
          MessageBox.warning("Please fill all the fields")
        } else if (_sLoginEmail && _sLoginPassword) {
          if (_sLoginEmail && _sLoginPassword) {
            var oData = {
              email: _sLoginEmail,
              password: _sLoginPassword,
            };
            if (!mailregex.test(_sLoginEmail)) {
              //TRY Forcebolt
              if (geTerms) {
                MessageBox.information(_sLoginEmail + " is not a valid email address");
              } else if (enTerms) {
                MessageBox.information(_sLoginEmail + " ist keine gültige E-Mail-Adresse");
              } else {
                MessageBox.information(_sLoginEmail + " is not a valid email address");
              }


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
        var geTerms = localStorage.getItem('deValue');
        var enTerms = localStorage.getItem('enValue');

        if (uid !== null) {
          this.getRouter().navTo("customer");
          history.go();
        } else if (Guid !== null) {
          if (geTerms) {
            MessageToast.show("Hi friend, you must login first!");
          } else if (enTerms) {
            MessageToast.show("Hallo Freund, Sie müssen sich zuerst anmelden!");
          } else {
            MessageToast.show("Hi friend, you must login first!")
          }
        } else {
          this.getRouter().navTo("home");
        }
      },
      onLogout: function () {
        var _sUrl = "http://64.227.115.243:8080/logout/";
        var oCartFinalModel = this.getView().getModel("oCartFinalModel");
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");

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
            if (geTerms) {
              MessageBox.success(oSuccess.detail);
            } else if (enTerms) {
              MessageBox.success("Du hast dich erfolgreich abgemeldet.")
            } else {
              MessageBox.success(oSuccess.detail);
            }
            localStorage.clear();
            sessionStorage.clear();
            oCartFinalModel.setProperty("/", "");
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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
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
                if (geTerms) {
                  MessageToast.show("We received your queries, We will contact you soon!");
                } else if (enTerms) {
                  MessageToast.show("Wir haben Ihre Anfragen erhalten, wir werden uns bald mit Ihnen in Verbindung setzen!")
                } else {
                  MessageToast.show("We received your queries, We will contact you soon!");
                }
              } else {
                if (geTerms) {
                  MessageToast.show(`${oDataNew.fname} , Sorry! You are not connected with us.`);
                } else if (enTerms) {
                  MessageToast.show(`${oDataNew.fname} , Verzeihung! Sie sind nicht mit uns verbunden.`);
                } else {
                  MessageToast.show(`${oDataNew.fname} , Sorry! You are not connected with us.`);
                }
              }
            });
        } else {
          if (geTerms) {
            MessageToast.show("All Fields are mandatory!");
          } else if (enTerms) {
            MessageToast.show("Alle Felder sind Pflichtfelder!")
          } else {
            MessageToast.show("All Fields are mandatory!");
          }
        }
      },


      onCustomerNavigationSelect: async function (oEvent) {
        var uid = localStorage.getItem("access_token");
        var Guid = localStorage.getItem("guest_access_token");
        var geTerms = localStorage.getItem('deValue');
        var enTerms = localStorage.getItem('enValue');

        if (uid !== null) {
          this.getRouter().navTo("customer");
        } else if (Guid !== null) {
          if (geTerms) {
            MessageToast.show("Hi friend, you must login first!");
          } else if (enTerms) {
            MessageToast.show("Hallo Freund, Sie müssen sich zuerst anmelden!");
          } else {
            MessageToast.show("Hi friend, you must login first!")
          }
        } else {
          if (geTerms) {
            MessageToast.show("Hi friend, you must login first!");
          } else if (enTerms) {
            MessageToast.show("Hallo Freund, Sie müssen sich zuerst anmelden!");
          } else {
            MessageToast.show("Hi friend, you must login first!")
          }
          this.getRouter().navTo("home");
        }
      },
      handleRegistrationClose: function () {
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.close();
        });
      },

      emailvalidate: async function () {
        var email = this.getView().byId("emailInputFrgt").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        if (!mailregex.test(email)) {
          if (geTerms) {
            MessageBox.warning(`${email} is not a valid email address`);
          } else if (enTerms) {
            MessageBox.warning(`${email} ist keine gültige E-Mail-Adresse`)
          }
          MessageBox.warning(`${email} is not a valid email address`);
          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView()
            .byId("emailInputFrgt")
            .setValueState(sap.ui.core.ValueState.None);
          if (geTerms) {
            MessageBox.information("email send!");
          } else if (enTerms) {
            MessageBox.information("E-Mail senden!")
          } else {
            MessageBox.information("email send!");
          }

          var oData = {
            email: email
          };
          var _sUrl = "http://64.227.115.243:8080/request_reset_email/";
          await this.getService()
            .onPost(_sUrl, oData)
            .then((oSuccess) => {
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
      onPasswordSubmit: async function (oEvent) {
        var _sPasswordInput1 = this.byId("passwordInput1").getValue();
        var _sConfirmPasswordInput1 = this.byId("confirmPasswordInput1").getValue();
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        var uidb64 = document.location.hash.split("=")[1].split("_")[1];
        var token = document.location.hash.split("=")[1].split("_")[2];

        if (!_sPasswordInput1 || !_sConfirmPasswordInput1) {
          if (geTerms) {
            MessageBox.warning("Enter valid password");
          } else if (enTerms) {
            MessageBox.warning("Geben Sie ein gültiges Passwort ein")
          } else {
            MessageBox.warning("Enter valid password");
          }

          this.getView()
            .byId("passwordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
          this.getView()
            .byId("_sConfirmPasswordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (_sPasswordInput1 != _sConfirmPasswordInput1) {
          if (geTerms) {
            MessageBox.warning("Password does not match");
          } else if (enTerms) {
            MessageBox.warning("Passwort stimmt nicht überein")
          } else {
            MessageBox.warning("Password does not match");
          }
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
              if (geTerms) {
                MessageToast.show("Reset Password Done!");
              } else if (enTerms) {
                MessageToast.show("Passwort zurücksetzen Fertig!")
              } else {
                MessageToast.show("Reset Password Done!");
              }
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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");

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
          if (geTerms) {
            MessageBox.information("Click to accept Terms & Condition");
          } else if (enTerms) {
            MessageBox.information("Klicken Sie hier, um die Allgemeinen Geschäftsbedingungen zu akzeptieren")
          } else {
            MessageBox.information("Click to accept Terms & Condition");
          }
        } else {
          if (!nwfirstName || !nwlastName || !_nwEmail) {
            if (geTerms) {
              MessageBox.information("All Fields are mandatory!");
            } else if (enTerms) {
              MessageBox.information("Alle Felder sind Pflichtfelder!")
            } else {
              MessageBox.information("All Fields are mandatory!")
            }
          } else {
            if (!mailregex.test(_nwEmail)) {
              if (geTerms) {
                MessageBox.information(`${_nwEmail} is not a valid email address`);
              } else if (enTerms) {
                MessageBox.information(`${_nwEmail} ist keine gültige E-Mail-Adresse`)
              } else {
                MessageBox.information(`${_nwEmail} is not a valid email address`);
              }
            } else {
              if (data_acceptance_mr === true || data_acceptance_mrs === true) {
                if (data_acceptance_mr === true && data_acceptance_mrs === true) {
                  if (geTerms) {
                    MessageBox.warning("Please Select Single Salutation!")
                  } else if (enTerms) {
                    MessageBox.warning("Bitte Einzelanrede auswählen!")
                  } else {
                    MessageBox.warning("Please Select Single Salutation!")
                  }
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
                    message: "You subscribe to Agas'Own Shopping Site",
                    gerMessage: "Sie abonnieren Agas'Own Shopping Site",
                    text: "Testing",
                    user_email: "mailto:titlishawan@gmail.com",
                  };
                  if (!exist_emails.includes(oDataa.email.toLowerCase().trim())) {
                    this.getService()
                      .onPost(_nwUrl, oDataa)
                      .then((oSuccess) => {
                        if (geTerms) {
                          MessageBox.success("Successfully subscribed!");
                        } else if (enTerms) {
                          MessageBox.success("Erfolgreich abonniert!");
                        } else {
                          MessageBox.success("Successfully subscribed!");
                        }
                        this._mNewsLetterDialog.then(function (oDialog) {
                          oDialog.close();
                        });
                        emailjs
                          .send("service_mr4cg1j", "template_a7z62ad", oDataa)
                          .then(function (res) {
                            if (res.status === 200) {
                              if (geTerms) {
                                MessageToast.show(
                                  "Thanks for Subscribing us!"
                                );
                              } else if (enTerms) {
                                MessageToast.show(
                                  "Danke, dass Sie uns abonniert haben!"
                                );
                              } else {
                                MessageToast.show(
                                  "Thanks for Subscribing us!"
                                );
                              }
                            } else {
                              if (geTerms) {
                                MessageToast.show(
                                  `${_nwfirstName} , Sorry! You are not connected with us.`
                                );
                              } else if (enTerms) {
                                MessageToast.show(
                                  `${_nwfirstName} , Verzeihung! Sie sind nicht mit uns verbunden.`
                                );
                              } else {
                                MessageToast.show(
                                  `${_nwfirstName} , Sorry! You are not connected with us.`
                                );
                              }
                            }
                          });
                      })
                      .catch((oError) => {
                        var data = (JSON.parse(oError.responseText));
                        MessageBox.warning(String(Object.values(data)[0]));
                      });
                  }
                }
              } else if (data_acceptance_mr === false && data_acceptance_mrs === false) {
                if (geTerms) {
                  MessageBox.warning("Please Select Any Salutation to continue!")
                } else if (enTerms) {
                  MessageBox.warning("Bitte wählen Sie eine beliebige Anrede aus, um fortzufahren!")
                } else {
                  MessageBox.warning("Please Select Any Salutation to continue!")
                }
              }
            }
          }
        }
      },

      showToLoginFun: function () {
        var _sfirstName = this.byId("firstNameInput").getValue();
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        setTimeout(() => {
          if (geTerms) {
            MessageBox.information(`Hello ${_sfirstName}, Please Login to continue`);
          } else if (enTerms) {
            MessageBox.information(`Hello ${_sfirstName}, bitte einloggen zum Fortfahren`);
          } else {
            MessageBox.information(`Hello ${_sfirstName}, Please Login to explore us!`);
          }
        }, 5000);
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
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(_sEmail)) {
          if (geTerms) {
            MessageBox.information(`${_sEmail} is not a valid email address`);
          } else if (enTerms) {
            MessageBox.information(`${_sEmail} ist keine gültige E-Mail-Adresse`);
          } else {
            MessageBox.information(`${_sEmail} is not a valid email address`);
          }
        } else {
          if (data_acceptance === false) {
            if (geTerms) {
              MessageBox.information("Click to accept Terms & Condition");
            } else if (enTerms) {
              MessageBox.information("Klicken Sie hier, um die Allgemeinen Geschäftsbedingungen zu akzeptieren");
            } else {
              MessageBox.information("Click to accept Terms & Condition");
            }
          } else {
            if (_sConfirmPasswordInput && _sEmail && _sfirstName && _slastName && _sPasswordInput) {
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
                  if (geTerms) {
                    MessageBox.success(oSuccess.detail);
                    this.showToLoginFun();
                  } else if (enTerms) {
                    MessageBox.success("Benutzer wurde erfolgreich registriert.");
                    this.showToLoginFun();
                  }
                  else {
                    MessageBox.success(oSuccess.detail);
                    this.showToLoginFun();
                  }
                  this._mRegistrationDialog.then(function (oDialog) {
                    oDialog.close();
                  });
                })
                .catch((oError) => {
                  MessageBox.error(oError.responseJSON.detail);
                });
            } else if (!_sConfirmPasswordInput || !_sEmail || !_sfirstName || !_slastName || !_sPasswordInput) {
              if (geTerms) {
                MessageBox.error("All fields are required to be filled to continue")
              } else if (enTerms) {
                MessageBox.error("Alle Felder müssen ausgefüllt werden, um fortzufahren")
              } else {
                MessageBox.error("All fields are required to be filled to continue")
              }
            }
          }
        }
      },
    });
  }
);
