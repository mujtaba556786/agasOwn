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
          AboutUs: "ag/agasown/img/AboutUsPage.jpg",
          Jewel: "ag/agasown/img/goyna.jpg",
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
        });
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
        console.log("categories")
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
      
      // onCategoryLinkPress_PDP: function (oEvent) {
      //   console.log("categories at PDP")
      //   var oSelectedItem = oEvent.getSource();
      //   var oContext = oSelectedItem.getBindingContext("oDataCategory");
      //   var sValue1 = oContext.getProperty("_id");

      //   var fnFilterCategory = function (item) {
      //     return item.parent === sValue1;
      //   };

      //   var oDataCategory = this.getView().getModel("oDataCategory").getData();
      //   var selectedCategory = oDataCategory.filter(fnFilterCategory);

      //   this.getView().getModel("oGlobalModel").setProperty("/", {
      //     detailCategory: selectedCategory,
      //   });

      //   this.getRouter().navTo("product", {
      //     productPath: sValue1,
      //   });
      // },

      onProductItemPress: function (oEvent) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("oDataProducts");
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);
        console.log(selectedPath.product_name);
        this.getView()
          .getModel("oGlobalModel")
          .setProperty("/", { detailProduct: selectedPath });
        this.getRouter().navTo("productDetail", {
          detailObj: selectedPath.product_name,
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
        var Guid = sessionStorage.getItem("Guid");
        var oData = {
          uid: uid,
          Guid: Guid,
        };
        if (oData.uid == null && oData.Guid == null) {
          this.handleLogin(oEvent);
        } else {
          this.handleLogout(oEvent);
        }
      },
      onLanguageSelect: function () {
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
      // onWishlistShow: function (oEvent) {
      //   //this.getRouter().navTo("cart");
      //   var oMenu = oEvent.getSource();
      //   var oView = this.getView();

      //   // create popover
      //   if (!this._oPopoverCart) {
      //     this._oPopoverCart = Fragment.load({
      //       id: oView.getId(),
      //       name: "ag.agasown.view.fragment.Wishlist",
      //       controller: this,
      //     }).then(function (oPopover) {
      //       oView.addDependent(oPopover);
      //       return oPopover;
      //     });
      //   }
      //   this._oPopoverCart.then(function (oPopover) {
      //     oPopover.openBy(oMenu);
      //   });
      // },
      onNavToCheckout: function () {
        //  After logout user cannot access the cart option

        var uid = sessionStorage.getItem("uid");
        var pid  =sessionStorage.getItem("single");
        var oData = {
          uid: uid,
          pid: pid
        };

        if (oData.uid !== null && oData.pid!==null) {
          this.getRouter().navTo("checkout");
        } else if (oData.uid === null) {
          this.getRouter().navTo("home");
          MessageToast.show("You must login first!");
        }
        else if (oData.pid === null) {
          this.getRouter().navTo("home");
          MessageToast.show("You must add some item!");
        } else {
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
        sap.m.URLHelper.redirect("https://www.facebook.com/agasown/",true);
      },
      onPressYouTube: function(){
        sap.m.URLHelper.redirect("https://www.youtube.com/watch?v=-PlZw4RmNGk&ab_channel=Aga%27sOwn",true);
      },
      onPressInstaGram: function(){
        sap.m.URLHelper.redirect("https://www.instagram.com/agasown/?hl=en",true);
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
            this.onLoginSucces(oSuccess);
            var ans = oSuccess.token.access_token;
            sessionStorage.setItem("access_token", ans);
            this.getRouter().navTo("customer");
          })
          .catch((oError) => {
            MessageBox.error(oError.responseText);
          });
      },

      onLoginSucces: async function (oData) {
        var access_token = sessionStorage.getItem("access_token");
        var req_id = oData.id
        this.myName = oData.first_name;
        this.myLastName = oData.last_name;
        this.myUserName = oData.first_name + oData.last_name;
        this.email = oData.email;
        this.credit_card_type_id = "credit_card_type_id";
        var myHeaders = new Headers();
        var oHeaderToken = {
          Authorization: "Bearer " + access_token,
        };
        myHeaders.append("Authorization", oHeaderToken.Authorization);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          first_name: this.myName,
          last_name: this.myLastName,
          username: this.myUserName,
          email: this.email,
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
            method: 'GET',
            headers: headEr,
            redirect: 'follow'
          };
          
          await fetch("http://64.227.115.243:8080/customers/", req_ans)
            .then(response => response.text())
            .then(result => {
              const res = JSON.parse(result).filter(data=>data.user === req_id)
              var new_ans = res[0]._id;
              sessionStorage.setItem("uid",new_ans);


            })
            .catch(error => console.log('error', error));
      },

      onLoginGoogleOpen: function (e) {
        //open in same window
        window.location.href = "http://localhost:5000/auth/google";
        //open in new window
        // window.open("http://localhost:5000/auth/google");

        window.onbeforeunload = function () {
          return "Are you sure want to LOGOUT the session ?";
        };
        const myUniversallyUniqueID = globalThis.crypto.randomUUID();
        sessionStorage.setItem("uid", myUniversallyUniqueID);
      },

      onLoginGuestOpen: function () {
        const myUniversallyUniqueIDG = globalThis.crypto.randomUUID();
        sessionStorage.setItem("Guid", myUniversallyUniqueIDG);
        this._mLoginDialog.then(function (oDialog) {
          oDialog.close();
        });
        window.onbeforeunload = function () {
          return "Are you sure want to LOGOUT the session ?";
        };
        MessageBox.success("You are successfully logged in", {
          icon: MessageBox.Icon.INFORMATION,
          title: "GUEST USER",
          actions: [MessageBox.Action.OK],
          emphasizedAction: MessageBox.Action.YES,
        });
      },

      onNavToCustomer: function () {
        var uid = sessionStorage.getItem("uid");
        var Guid = sessionStorage.getItem("Guid");
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
        var oCustomer = oGlobalModel.getData().customer;

        //After log out sent user to home page & refresh
        this.getRouter().navTo("home");
        location.reload();
        // Remove UserID from Session Storage
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("Guid");
        sessionStorage.removeItem("myvalue5");
        sessionStorage.removeItem("single");
        
        sessionStorage.removeItem("product_id");
        
        var oCustomer = oGlobalModel.getData().customer;
        var oHeaderToken = {
          Authorization: "Bearer " + oCustomer.token.access_token,
        };
        this.getService()
          .onPost(_sUrl, "" , oHeaderToken)
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
        if(this._mLoginDialog !== undefined){
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

      //Shawan
      onLoginPage: function (oEvent) {
        this.handleLogin(oEvent);
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      onContinueShopping: function () {
        this.getRouter().navTo("home");
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
              console.log("success", res.status);
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
        var uid = sessionStorage.getItem("uid");
        var Guid = sessionStorage.getItem("Guid");
        if (uid !== null) {
          this.getRouter().navTo("customer");
        } else if (Guid !== null) {
          MessageToast.show("You must login first!");
        } else {
          MessageToast.show("You must login first!");
          this.getRouter().navTo("home");
        }
      },
      // Shawan ends

      handleRegistrationClose: function () {
        this._mRegistrationDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      //reset password
      emailvalidate: function () {
        // alert("forgot click!!")
        var email = this.getView().byId("emailInput").getValue();

        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(email)) {
          alert(email + " is not a valid email address");

          this.getView()
            .byId("emailInput")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.getView()
            .byId("emailInput")
            .setValueState(sap.ui.core.ValueState.None);
          alert("email send!");
          var formdata = new FormData();
          formdata.append("email", this.byId("emailInput").getValue());
          var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
          };

          fetch("http://64.227.115.243:8080/request_reset_email/", requestOptions)
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
          location.reload();
          alert("Enter valid password");
          this.getView()
            .byId("passwordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
          this.getView()
            .byId("_sConfirmPasswordInput1")
            .setValueState(sap.ui.core.ValueState.Error);
          // alert("field is empty!");
        } else if (_sPasswordInput1 != _sConfirmPasswordInput1) {
          location.reload();
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
        var _nwUrl = "http://64.227.115.243:8080/newsletter/";
        var _nwfirstName = this.byId("firstNameInput1").getValue();
        var _nwlastName = this.byId("lastNameInput1").getValue();
        var _nwEmail = this.byId("emailInput1").getValue();
        let exist_emails = new Array();

        await this.getService()
          .onGet(_nwUrl)
          .then((oSuccess) => {
            var i = oSuccess.length;
            for (var input = 0; input < i; input++) {
              var req_ans = oSuccess[input].email;
              exist_emails.push(req_ans.toLowerCase().trim());
            };
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
          user_email: "dhirenderrawat@forcebolt.com",
        };
        if (!exist_emails.includes(oDataa.email.toLowerCase().trim())) {
          this.getService()
            .onPost(_nwUrl, oDataa)
            .then((oSuccess) => {
              MessageBox.success("Successfully subscribed!");

            })
            .catch((oError) => {
              console.log(oError);
              MessageBox.error("Hey! Mail id already exist!");
            });
        }
        else {
          MessageToast.show("Mail id already exist!");
          MessageBox.error("Hey! Mail id already exist!");
        }
        // Send mail through EmailJs
        // emailjs
        //   .send("service_iqmgnpc", "template_um2rjon", oDataa)
        //   .then(function (res) {
        //     console.log("success", res.status);
        //     if (res.status === 200) {
        //       alert(`Heya ${oDataa.first_name}, Subscription added!`);
        //       MessageToast.show(
        //         "You will receive mail soon regarding your subscription!"
        //       );
        //     } else {
        //       alert("Error");
        //     }
        //   });
      },

      onSubmit: function (oEvent) {
        var _sUrl = "http://64.227.115.243:8080/sign-up/";
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
            console.log(oSuccess.detail);
            MessageBox.success(oSuccess.detail);

          })
          .catch((oError) => {
            MessageBox.error(oError.responseJSON.detail);
          });
      },
    });
  }
);
