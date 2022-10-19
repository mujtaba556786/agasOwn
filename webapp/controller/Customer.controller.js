sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel"],
  function (BaseController, JSONModel) {
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
      
		  window.onbeforeunload = function() {
			return "Done";
		  }
          currentDates++;
        }
   
        //Start from there!
        this.getRouter()
          .getRoute("customer")
          .attachPatternMatched((event) => {
            if (oData.uid !== null || oData.Guid == null ) {
              this.getRouter().navTo("customer");
            } else {
              this.getRouter().navTo("home");
            }
          });
      },

      onCustomerNavigationSelect: function (oEvent) {
        var oCustomerLayout = this.getView().byId("customerContent");
        var _sFragmentName = oEvent.getSource().data("fragmentName");
        var oFragment = sap.ui.xmlfragment(
          "ag.agasown.view.fragment.customer." + _sFragmentName,
          this
        );
        oCustomerLayout.destroyContent();
        oCustomerLayout.addContent(oFragment);
      },

      onCustomerNavigationWishlistSelect: function (oEvent) {
        var uid = sessionStorage.getItem("uid");
        var access_token = sessionStorage.getItem("access_token");
        var wishlistItems =[];
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
					let currentUser =users.filter((user)=>user._id == uid)
					fetch("http://64.227.115.243:8080/products/", new_reqestOptions)
				.then((response) => response.json())
				.then((res) => {
					var wishlistProduct = currentUser[0].wishlist;
					
					 wishlistItems = res.filter((elem) => wishlistProduct.split(',').find(( id ) => elem._id === id));

					var oViewModel = new JSONModel(wishlistItems);
				  this.getView().setModel(oViewModel,"wish");
			})
				})
				.catch((error) => console.log("error", error));
        if(wishlistItems){
        var oCustomerLayout = this.getView().byId("customerContent");
        var _sFragmentName = oEvent.getSource().data("fragmentName");
        var oFragment = sap.ui.xmlfragment(
          "ag.agasown.view.fragment.customer." + _sFragmentName,
          this
        );
        oCustomerLayout.destroyContent();
        oCustomerLayout.addContent(oFragment);
      }
      },
    });
  }
);
