sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "./BaseController",
    "sap/ui/model/Sorter",
    "../model/formatter",
    "../model/cart",
    "sap/m/MessageToast",
  ],
  function (JSONModel, BaseController, Sorter, formatter, cart, MessageToast) {
    "use strict";

    return BaseController.extend("ag.agasown.controller.ProductDetail", {
      cart: cart,
      formatter: formatter,

      onInit: function () {

        this.oView = this.getView();
        this._bDescendingSort = false;
        this.oDetailProduct = this.oView.byId("detailProduct");
        this.setHeaderModel();

        var aData = {
          value: 6,
          min: 1,
          max: 100,
          width: "90px",
          validationMode: "LiveChange",
        };
        var oModel = new JSONModel(aData);
        this.getView().setModel(oModel, "detailView");

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("productDetail")
          .attachPatternMatched(this._onObjectMatched, this);
        //! Hover function on menu button
        this.byId("target").addEventDelegate(
          {
            onmouseover: this._showPopover,
            // onmouseout: this._clearPopover,
          },
          this
        );
      },
      handleImagePress: function (oEvent) {
        var oView = this.getView().byId("bigImg");
        var sImgSrc = oEvent.getSource().getSrc();
        oView.setSrc(sImgSrc);
      },
      //! Hover function on menu button
      _showPopover: function () {
        this._timeId = setTimeout(() => {
          this.byId("popover").openBy(this.byId("target"));
        });
      },
      _onObjectMatched: function (oEvent) {
        var sCurrentRouteName = oEvent.getParameter("name");
        this.getView()
          .getModel("oGlobalModel")
          .setProperty("/currentRouteName", sCurrentRouteName);
      },

      onSort: function () {
        this._bDescendingSort = !this._bDescendingSort;
        var oBinding = this.oProductsTable.getBinding("items"),
          oSorter = new Sorter("Name", this._bDescendingSort);

        oBinding.sort(oSorter);
      },
      onChange: function (oEvent) {
        MessageToast.show(
          "Value changed to '" + oEvent.getParameter("value") + "'"
        );
      },

      /**
       * Called, when the add button of a product is pressed.
       * Saves the product, the i18n bundle, and the cart model and hands them to the <code>addToCart</code> function
       * @public
       */
      onAddToCartDetails: function (oEvent) {
        var oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var oDataProducts = this.getView().getModel("oDataProducts");
        var product_id = oSelectedPath._id;
        sessionStorage.setItem("single", product_id)


        cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);
      },

      onAddToWishList: function (oEvent) {

        var login_id = sessionStorage.getItem("uid");
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var product_id = oSelectedPath._id;
        // var all = []; // Moved up, and replaced with bracket notation.
        // var a = 1;
        // for (  var i= 0; i < 4; i++) {
        //   all.push(product_id);
        //   // all[i] = product_id;
        //   // all++;
        // }
        // console.log("stord array",all);
        // var arr = [];

        // for(var i = 0; i < 5; i++){

        // arr.push({valueItem: product_id});
        // arr.push({valueItem: product_id});

        // }
        // forEach(( product_id) => {
        //   arr.push( product_id);
        // });
        // var newarr=arr.map(function(isss){
        //   arr.push(product_id);
        // });
        // console.log("==================>",arr)
        // foreach()
        var previous_wishlist = sessionStorage.getItem('product_id')
        console.log("=========>", previous_wishlist);
        if (previous_wishlist != null) {
          var temp = previous_wishlist + ';' + product_id
          sessionStorage.setItem('product_id', temp)
        } else {
          sessionStorage.setItem('product_id', ('' + product_id))
        }
        console.log("product_id", product_id);
        var customer_id = sessionStorage.getItem("uid");

        if (!login_id) {
          MessageToast.show("You have to login first");
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
        } else {
          var formdata = new FormData();
          formdata.append("customer_id", customer_id);
          formdata.append("product_id", product_id);

          var requestOptions = {
            method: "PATCH",
            body: formdata,
            redirect: "follow",
          };

          fetch("http://64.227.115.243:8080/wishlist/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              // MessageToast.show(JSON.parse(result).message)

              if (JSON.parse(result).message === "Product already exists") {
                // sessionStorage.setItem("product_id");
                var login_id = sessionStorage.getItem("uid");
                var oSelectedPath = this.getView()
                  .getModel("oGlobalModel")
                  .getData().detailProduct;
                var product_id = oSelectedPath._id;
                console.log("product_id", product_id);
                var customer_id = sessionStorage.getItem("uid");

                if (!login_id) {
                  MessageToast.show("You have to login first");
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
                } else {
                  var formdata = new FormData();
                  formdata.append("customer_id", customer_id);
                  formdata.append("product_id", product_id);

                  var requestOptions = {
                    method: "DELETE",
                    body: formdata,
                    redirect: "follow",
                  };

                  fetch("http://64.227.115.243:8080/wishlist/delete", requestOptions)
                    .then((response) => response.text())
                    .then((result) =>
                      //  MessageToast.show(JSON.parse(result).message)
                      console.log(result)
                    )
                    .catch((error) => console.log("error", error));
                }
                $(".productFavourite").click(function () {
                  $(this).addClass("bgcol");
                });
              }
              else {

                $(".productFavourite").click(function () {
                  $(this).removeClass("bgcol");
                });
                MessageToast.show("Added Successfully")
              }
            })

            .catch((error) => console.log("error", error));
        }

      },
    });
  }
);
