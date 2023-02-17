sap.ui.define(
  ["./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
     "sap/m/MessageToast"],
  function (BaseController, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("ag.agasown.controller.Customer", {
      onInit: function () {
        // Storing user data into session Storage
        this.setHeaderModel();
        this._sIdHomeAdrs();
        this._sIdBillingAdrs();
        this._sIdPersonalAdrs();
        this.onCustomerOderDetails();
        this.onCustomerNavigationWishlistSelect();
        },
      _sIdHomeAdrs: function () {
        this.oAddress = this.byId("address1");
        this.oCity = this.byId("city");
        this.oPostalCode = this.byId("postalCode");
        this.oCountry = this.byId("country");
        this.oBtnEditHmAdrs = this.byId("btnEditHmAdrs");
        this.oBtnSaveHmAdrs = this.byId("btnSaveHmAdrs");
        this.oFirstNameHome = this.byId("firstNameHome");
        this.oLastNameHome = this.byId("lastNameHome");
      },

      _sIdPersonalAdrs: function () {
        this.oFirstNamePrsnlDtl = this.byId("firstNamePrsnlDtl");
        this.oLastNamePrsnlDtl = this.byId("lastNamePrsnlDtl");
        this.oDateOfBirthPrsnlDtl = this.byId("dateOfBirthPrsnlDtl");
        this.oEmailPrsnlDtl = this.byId("emailPrsnlDtl");
        this.oPwdPrsnlDtl = this.byId("pwdPrsnlDtl");
        this.oSaluMr = this.getView().byId("saluMr");
        this.oSaluMrs = this.getView().byId("saluMrs");
        this.oSaluOther = this.getView().byId("saluOthers")
        this.oBtnEditPrsnlAdrs = this.byId("btnEditPrsnlAdrs");
        this.oBtnSavePrsnlAdrs = this.byId("btnSavePrsnlAdrs");
      },

      _sIdBillingAdrs: function () {
        this.oBillingAddress = this.byId("billingAddress");
        this.oBillingCity = this.byId("billingCity");
        this.oBillingPostalCode = this.byId("billingPostalCode");
        this.oBillingCountry = this.byId("billingCountry");
        this.oBtnEditblngAdrs = this.byId("btnEditblngAdrs");
        this.oSaluMrblngAdrs = this.getView().byId("billingSaluMr");
        this.oSaluMrsblngAdrs = this.getView().byId("billingSaluMrs");
        this.oBtnSaveblngAdrs = this.byId("btnSaveblngAdrs");
        this.oBillingName = this.byId("name");
        this.oSaluOthersblngAdrs = this.byId("billingSaluOther");
      },

      onPressCustomerTile: function (oEvent) {
        var sId = this.byId("customerTab");
        var sHeader = oEvent.getSource().getHeader();
        sId.setSelectedKey(sHeader);
        this.onCustomerNavigationWishlistSelect();
        this.onCustomerOderDetails();
      },

      onEditHomeAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(true);
        };
        this.oBtnEditHmAdrs.setVisible(false);
        this.oBtnSaveHmAdrs.setVisible(true);
        var aHomeAdrsInptId = [this.oAddress, this.oCity, this.oPostalCode, this.oCountry, this.oFirstNameHome, this.oLastNameHome];
        aHomeAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onSaveHomeAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditHmAdrs.setVisible(true);
        this.oBtnSaveHmAdrs.setVisible(false);
        var aHomeAdrsInptId = [this.oAddress, this.oCity, this.oPostalCode, this.oCountry, this.oFirstNameHome, this.oLastNameHome];
        aHomeAdrsInptId.filter(fnSetVisibleInptFld);
        this.EditCustomerAddress();
        this.onConfirmAddClose();
      },
      onNotSaveHomeAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditHmAdrs.setVisible(true);
        this.oBtnSaveHmAdrs.setVisible(false);
        var aHomeAdrsInptId = [this.oAddress, this.oCity, this.oPostalCode, this.oCountry, this.oFirstNameHome, this.oLastNameHome];
        aHomeAdrsInptId.filter(fnSetVisibleInptFld);
        this.onConfirmAddClose();
        history.go();
      },
 
      EditCustomerAddress: function () {
        var ID = localStorage.getItem("user");
        var token = localStorage.getItem("access_token");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "address1": this.byId("address1").getValue(),
          "city": this.byId("city").getValue(),
          "postal_code": this.byId("postalCode").getValue(),
          "country": this.byId("country").getValue(),
          "first_name": this.byId("firstNameHome").getValue(),
          "last_name": this.byId("lastNameHome").getValue()
        });

        var requestOptions = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`http://64.227.115.243:8080/customers/${ID}/`, requestOptions)
          .then(response => response.text())
          .then(result => {
            MessageToast.show("Home Address Updated Successfully!");
          
          })
          .catch(error => {
            MessageToast.show("Error while updating Home Address!")
          });
      },
      onEditBillingAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(true);
        };
        this.oBtnEditblngAdrs.setVisible(false);
        this.oBtnSaveblngAdrs.setVisible(true);
        var aBillingAdrsInptId = [this.oBillingAddress, this.oBillingCity, this.oBillingPostalCode, this.oBillingCountry, this.oBillingName, this.oSaluMrblngAdrs, this.oSaluMrsblngAdrs, this.oSaluOthersblngAdrs];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
       
      },
      onSaveBillingAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditblngAdrs.setVisible(true);
        this.oBtnSaveblngAdrs.setVisible(false);
        var aBillingAdrsInptId = [this.oBillingAddress, this.oBillingCity, this.oBillingPostalCode, this.oBillingCountry, this.oBillingName, this.oSaluMrblngAdrs, this.oSaluMrsblngAdrs, this.oSaluOthersblngAdrs];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
        this.editCustomerBillingAddress();
        this.onConfirmBillAddClose();
      },
      onNotSaveBillingAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditblngAdrs.setVisible(true);
        this.oBtnSaveblngAdrs.setVisible(false);
        var aBillingAdrsInptId = [this.oBillingAddress, this.oBillingCity, this.oBillingPostalCode, this.oBillingCountry, this.oBillingName, this.oSaluMrblngAdrs, this.oSaluMrsblngAdrs, this.oSaluOthersblngAdrs];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
        this.onConfirmBillAddClose();
        history.go();
      },
      //Patch Method for Customer API
      editCustomerBillingAddress: function () {
        var ID = localStorage.getItem("user");
        var token = localStorage.getItem("access_token");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");
        var salutation;
        var maleSalutation = this.getView().byId("billingSaluMr").getSelected();
        var femaleSalutation = this.getView().byId("billingSaluMrs").getSelected();
        var otherSalutation = this.getView().byId("billingSaluOther").getSelected();
        if (maleSalutation === true) {
          salutation = "Mr."
        } else if (femaleSalutation === true) {
          salutation = "Mrs."
        } else if (otherSalutation === true) {
          salutation = "Others"
        }else if (maleSalutation === false && femaleSalutation === false && otherSalutation === false) {
          salutation = null
        }

        var raw = JSON.stringify({
          "billing_address": this.byId("billingAddress").getValue(),
          "billing_city": this.byId("billingCity").getValue(),
          "billing_postal_code": this.byId("billingPostalCode").getValue(),
          "billing_country": this.byId("billingCountry").getValue(),
          "name": this.byId("name").getValue(),
          "salutation_billing": salutation
        });

        var requestOptions = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`http://64.227.115.243:8080/customers/${ID}/`, requestOptions)
          .then(response => response.text())
          .then(result => {
            MessageToast.show("Billing Address Updated Successfully!")
          })
          .catch(error => {
            console.log('error', error);
            MessageToast.show("Error while updating Billing Address!")
          });
      },
      onEditPersonalAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(true);
        };
        this.oBtnEditPrsnlAdrs.setVisible(false);
        this.oBtnSavePrsnlAdrs.setVisible(true);
        var aBillingAdrsInptId = [this.oFirstNamePrsnlDtl, this.oLastNamePrsnlDtl,
        this.oDateOfBirthPrsnlDtl, this.oSaluMr, this.oSaluMrs, this.oSaluOther];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
      },
      onSavePersonalAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditPrsnlAdrs.setVisible(true);
        this.oBtnSavePrsnlAdrs.setVisible(false);
        var aBillingAdrsInptId = [this.oFirstNamePrsnlDtl, this.oLastNamePrsnlDtl,
        this.oDateOfBirthPrsnlDtl, this.oSaluMr, this.oSaluMrs, this.oSaluOther];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
        this.EditCustomerDetails();
        this.onConfirmPDClose();

      },
      onNotSavePersonalAddress: function () {
        var fnSetVisibleInptFld = function (oId) {
          oId.setEditable(false);
        };
        this.oBtnEditPrsnlAdrs.setVisible(true);
        this.oBtnSavePrsnlAdrs.setVisible(false);
        var aBillingAdrsInptId = [this.oFirstNamePrsnlDtl, this.oLastNamePrsnlDtl,
        this.oDateOfBirthPrsnlDtl, this.oSaluMr, this.oSaluMrs, this.oSaluOther];
        aBillingAdrsInptId.filter(fnSetVisibleInptFld);
        this.onConfirmPDClose();
        history.go();
      },
      // Patch API works here
 
      EditCustomerDetails: function () {
        
        var token = localStorage.getItem("access_token");
        var ID = localStorage.getItem("user");
        var salutation;
        var maleSalutation = this.getView().byId("saluMr").getSelected();
        var femaleSalutation = this.getView().byId("saluMrs").getSelected();
        var othersSalutation = this.getView().byId("saluOthers").getSelected();
        if (maleSalutation === true) {
          salutation = "Mr."
        } else if (femaleSalutation === true) {
          salutation = "Mrs."
        } else if (othersSalutation === true) {
          salutation = "Others"
        } else if (maleSalutation === false && femaleSalutation === false && othersSalutation === false) {
          salutation = null
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "first_name": this.byId("firstNamePrsnlDtl").getValue(),
          "last_name": this.byId("lastNamePrsnlDtl").getValue(),
          "salutation": salutation
        });

        var requestOptions = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`http://64.227.115.243:8080/customers/${ID}/`, requestOptions)
          .then(response => response.text())
          .then(result => {
            MessageToast.show("Personal Details Updated Successfully!")
          
          })
          .catch(error => {
            MessageToast.show("Error while updating Personal Details!")
          });
      },
      onProductItemPress: function (oEvent) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("wishListmodel");
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);
        this.getView().getModel("oGlobalModel").setProperty("/", { detailProduct: selectedPath });
        this.getRouter().navTo("productDetail", {
          detailObj: selectedPath.product_name,
        });
      },

      onCustomerNavigationSelect: function (oEvent) {
        var oCustomerLayout = this.getView().byId("customerContent");
        var _sFragmentName = oEvent.getSource().data("fragmentName");
        var oFragment = sap.ui.xmlfragment(
          "ag.agasown.view.fragment.customer." + _sFragmentName,
        );
        oCustomerLayout.destroyContent();
        oCustomerLayout.addContent(oFragment);
      },
      // customer order details
      onCustomerOderDetails: function () {
        var pro_data
        var globArr = [];
        var token = localStorage.getItem("access_token");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        fetch("http://64.227.115.243:8080/order_customer/", requestOptions)
          .then(response => response.json())
          .then(async (oSuccess) => {
            var prod_ids = Object(oSuccess)["order_details"];
            prod_ids.map((i) => {
              var req_ans = JSON.parse((i.product_details).replace(/'/g, '"'));
               pro_data = String(Object.keys(req_ans))
                globArr.push(pro_data);
            })
            const data = globArr.map(async (item) => {
              return await this.onGetWishlistProductDetails(item);
            })
            const product = await Promise.all(data);
            var eachProd =  product.map((i) => { return (i) });
            var oGlobalModel = new JSONModel(eachProd);
            this.getView().setModel(oGlobalModel, "customerOrderModel");
          })
          .catch(error => console.log('error', error));
      },

      onGetProductDetails: async function (product_id) {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const res = await fetch(`http://64.227.115.243:8080/products/${product_id}`, requestOptions)
        return res.json();
      },


      onCustomerNavigationWishlistSelect : function (oEvent) {
        var id = localStorage.getItem("user");
        var access_token = localStorage.getItem("access_token");
        var headEr = new Headers();
        headEr.append("Authorization", "Bearer " + access_token);
        var requestOptions = {
          method: "GET",
          headers: headEr,
          redirect: "follow",
        };
        fetch(`http://64.227.115.243:8080/customers/${id}`, requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
            var wishData = result.wishlist;
         if (wishData !== null){
          var globArr = [];
          var answ = wishData.split(',');
          answ.forEach(function(obj){
            globArr.push(obj);
      });
          const data = globArr.map(async (item) => {
            return await this.onGetWishlistProductDetails(item);
          });
          const product = await Promise.all(data);
          var eachProd =  product.map((i) => { return (i) });
          var oGlobalModel = new JSONModel(eachProd);
         }else{
           oGlobalModel = new JSONModel(null);  //pass product
         }
         this.getView().setModel(oGlobalModel, "wishListmodel");
          })
          .catch(error => console.log('error', error));
      },
      onGetWishlistProductDetails: async function (item) {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const res = await fetch(`http://64.227.115.243:8080/products/${item}`, requestOptions)
        return res.json();
        
      },

      onAddToWishListDel: function (oEvent) {
        var prod_id = oEvent.getSource().data("itemId");
        var formdata = new FormData();
        formdata.append("product_id", prod_id);
        var access_token = localStorage.getItem("access_token");
        var ID = localStorage.getItem("user");
        var headEr = new Headers();
        headEr.append("Authorization", "Bearer " + access_token);

        var requestOptions = {
          method: "DELETE",
          headers: headEr,
          body: formdata,
          redirect: "follow",
        };
        fetch("http://64.227.115.243:8080/delete_wishlist/", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            MessageToast.show(JSON.parse(result).message);
            this.onCustomerNavigationWishlistSelect();
            
          });
      },
      userFirstNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("firstNamePrsnlDtl")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("firstNamePrsnlDtl")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("firstNamePrsnlDtl")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userLastNameCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("lastNamePrsnlDtl")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("lastNamePrsnlDtl")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("lastNamePrsnlDtl")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userFirstNameCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("firstNameHome")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("firstNameHome")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("firstNameHome")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userLastNameCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView().byId("lastNameHome").setValueState(sap.ui.core.ValueState.Error)
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("lastNameHome")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("lastNameHome")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userAddressCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView().byId("address1").setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("address1")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("address1")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userAddressCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView().byId("billingAddress").setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("billingAddress")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("billingAddress")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userCityCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView().byId("city").setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("city")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("city")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userCityCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView().byId("billingCity").setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("billingCity")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("billingCity")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userZipCodeCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        if (newValue.length >= 4) {
          this.getView()
            .byId("postalCode")
            .setValueState(sap.ui.core.ValueState.None);
        } else {
          this.getView()
            .byId("postalCode")
            .setValueState(sap.ui.core.ValueState.Error);
        }
      },
      userZipCodeCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        if (newValue.length >= 4) {
          this.getView()
            .byId("billingPostalCode")
            .setValueState(sap.ui.core.ValueState.None);
        } else {
          this.getView()
            .byId("billingPostalCode")
            .setValueState(sap.ui.core.ValueState.Error);
        }
      },
      userCountryCheck: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("country")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("country")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("country")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userCountryCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("billingCountry")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("billingCountry")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("billingCountry")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      },
      userNameCheckAgain: function (oEvent) {
        let newValue = oEvent.getParameter("newValue");
        var bool = /\d/.test(newValue);
        if (bool === true) {
          this.getView()
            .byId("name")
            .setValueState(sap.ui.core.ValueState.Error);
        } else {
          if (newValue.length >= 4) {
            this.getView()
              .byId("name")
              .setValueState(sap.ui.core.ValueState.None);
          } else {
            this.getView()
              .byId("name")
              .setValueState(sap.ui.core.ValueState.Error);
          }
        }
      }
    }
    );
  }
);
