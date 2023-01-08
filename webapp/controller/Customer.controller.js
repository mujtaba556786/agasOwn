sap.ui.define(
  ["./BaseController",
    "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/Fragment"],
  function (BaseController, JSONModel, MessageToast, MessageBox, Fragment) {
    "use strict";

    return BaseController.extend("ag.agasown.controller.Customer", {
      onInit: function () {
        // Storing user data into session Storage
        this.setHeaderModel();
        var uid = sessionStorage.getItem("uid");
        var Guid = sessionStorage.getItem("Guid");
        var oData = {
          uid: uid,
          Guid: Guid,
        };

        let expirationDate = new Date(new Date().getTime() + 60000 * 0.5);
        let currentDate = new Date();
        // try...
        var currentDates = Date.parse(currentDate);
        var expirationDates = Date.parse(expirationDate);
        while (currentDates < expirationDates) {
          this.getRouter().navTo("customer");

          window.onbeforeunload = function () {
            return "Done";
          }
          currentDates++;
        }

        //Start from there!
        this.getRouter()
          .getRoute("customer")
          .attachPatternMatched((event) => {
            if (oData.uid !== null || oData.Guid == null) {
              if (oData.uid !== null) {
                this.setCustomerModel(oData.uid);
              }

              this.getRouter().navTo("customer");
            } else {
              this.getRouter().navTo("home");
            }
          });
        this._sIdHomeAdrs();
        this._sIdBillingAdrs();
        this._sIdPersonalAdrs();
      },
      _sIdHomeAdrs: function () {
        this.oAddress = this.byId("address1");
        this.oCity = this.byId("city");
        this.oPostalCode = this.byId("postalCode");
        this.oCountry = this.byId("country");
        this.oBtnEditHmAdrs = this.byId("btnEditHmAdrs");
        this.oBtnSaveHmAdrs = this.byId("btnSaveHmAdrs");
      },

      _sIdPersonalAdrs: function () {
        this.oFirstNamePrsnlDtl = this.byId("firstNamePrsnlDtl");
        this.oLastNamePrsnlDtl = this.byId("lastNamePrsnlDtl");
        this.oDateOfBirthPrsnlDtl = this.byId("dateOfBirthPrsnlDtl");
        this.oEmailPrsnlDtl = this.byId("emailPrsnlDtl");
        this.oPwdPrsnlDtl = this.byId("pwdPrsnlDtl");

        this.oBtnEditPrsnlAdrs = this.byId("btnEditPrsnlAdrs");
        this.oBtnSavePrsnlAdrs = this.byId("btnSavePrsnlAdrs");
      },

      _sIdBillingAdrs: function () {
        this.oBillingAddress = this.byId("billingAddress");
        this.oBillingCity = this.byId("billingCity");
        this.oBillingPostalCode = this.byId("billingPostalCode");
        this.oBillingCountry = this.byId("billingCountry");
        this.oBtnEditblngAdrs = this.byId("btnEditblngAdrs");
        this.oBtnSaveblngAdrs = this.byId("btnSaveblngAdrs");
      },
      onProductItemPress: function (oEvent) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("wish");
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);
        this.getView().getModel("oGlobalModel").setProperty("/", { detailProduct: selectedPath });
        this.getRouter().navTo("productDetail", {
          detailObj: selectedPath.product_name,
        });
      },

      onPressCustomerTile: function (oEvent) {
        var sId = this.byId("customerTab");
        var sHeader = oEvent.getSource().getHeader();
        sId.setSelectedKey(sHeader);
      },

      onEditHomeAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(true);
        };
        this.oBtnEditHmAdrs.setVisible(false);
        this.oBtnSaveHmAdrs.setVisible(true);
        var aHomeAdrsInptId = [this.oAddress, this.oCity, this.oPostalCode, this.oCountry];
        aHomeAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onSaveHomeAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditHmAdrs.setVisible(true);
        this.oBtnSaveHmAdrs.setVisible(false);
        var aHomeAdrsInptId = [this.oAddress, this.oCity, this.oPostalCode, this.oCountry];
        aHomeAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onEditBillingAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(true);
        };
        this.oBtnEditblngAdrs.setVisible(false);
        this.oBtnSaveblngAdrs.setVisible(true);
        var aBillingAdrsInptId = [this.oBillingAddress, this.oBillingCity, this.oBillingPostalCode, this.oBillingCountry];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onSaveBillingAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditblngAdrs.setVisible(true);
        this.oBtnSaveblngAdrs.setVisible(false);
        var aBillingAdrsInptId = [this.oBillingAddress, this.oBillingCity, this.oBillingPostalCode, this.oBillingCountry];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onEditPersonalAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(true);
        };
        this.oBtnEditPrsnlAdrs.setVisible(false);
        this.oBtnSavePrsnlAdrs.setVisible(true);
        var aBillingAdrsInptId = [this.oFirstNamePrsnlDtl, this.oLastNamePrsnlDtl,
        this.oDateOfBirthPrsnlDtl, this.oEmailPrsnlDtl, this.oPwdPrsnlDtl];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onSavePersonalAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditPrsnlAdrs.setVisible(true);
        this.oBtnSavePrsnlAdrs.setVisible(false);
        var aBillingAdrsInptId = [this.oFirstNamePrsnlDtl, this.oLastNamePrsnlDtl,
        this.oDateOfBirthPrsnlDtl, this.oEmailPrsnlDtl, this.oPwdPrsnlDtl];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onCustomerNavigationWishlistSelect: function (oEvent) {
        var uid = sessionStorage.getItem("uid");
        var access_token = sessionStorage.getItem("access_token");
        var wishlistItems = [];
        var headEr = new Headers();
        var TokenPass = {
          Authorization: "Bearer " + access_token,
        };
        headEr.append("Authorization", TokenPass.Authorization);
        var requestOptions = {
          method: "GET",
          headers: headEr,
          redirect: "follow",
        };
        var new_reqestOptions = {
          method: "GET",
          redirect: "follow",
        };
        fetch("http://64.227.115.243:8080/customers", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const users = JSON.parse(result);
            let currentUser = users.filter((user) => user._id == uid)
            fetch("http://64.227.115.243:8080/products/", new_reqestOptions)
              .then((response) => response.json())
              .then((res) => {
                var wishlistProduct = currentUser[0].wishlist;

                wishlistItems = res.filter((elem) => wishlistProduct.split(',').find((id) => elem._id === id));

                var oViewModel = new JSONModel(wishlistItems);
                this.getView().setModel(oViewModel, "wish");
              })
          })
          .catch((error) => console.log("error", error));
        if (wishlistItems) {
          var sId = this.byId("customerTab");
          sId.setSelectedKey("Wishlist");
        }
      },
      onAddToWishList11: function (oEvent) {
        var prod_id = oEvent.getSource().data("itemId");
        var customer_id = sessionStorage.getItem("uid");
        var formdata = new FormData();
        formdata.append("customer_id", customer_id);
        formdata.append("product_id", prod_id);
        var requestOptions = {
          method: "DELETE",
          body: formdata,
          redirect: "follow",
        };
        fetch("http://64.227.115.243:8080/wishlist/delete", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            MessageToast.show(JSON.parse(result).message);
            this.onCustomerNavigationWishlistSelect();

          })
          .catch((error) => {
            // MessageToast.show(error)
          });
      }
    }
    );
  }
);
