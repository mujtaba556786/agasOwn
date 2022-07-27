sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel"],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("ag.agasown.controller.Customer", {
      onInit: function () {
        // Storing user data into session Storage
        this.setHeaderModel();
        var uid = sessionStorage.getItem("uid");
        var oData = {
          uid: uid,
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
            if (oData.uid !== null) {
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
    });
  }
);
