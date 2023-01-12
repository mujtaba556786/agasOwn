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
        //!CUSTOM CODE FOR ADD TO CART
        var aData = {
          recipient: {
            value: 1,
            min: 1,
            max: 8,
            width: " 10px",
            validationMode: "LiveChange",
          },
        };
        var oModel = new JSONModel(aData);
        this.getView().setModel(oModel);

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("productDetail")
          .attachPatternMatched(this._onObjectMatched, this);

      },
      _setProductVariant: function (oEvent, typeVariant) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("oGlobalModel");
        var aDataProducts = this.getView().getModel("oDataProducts").getData();
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);
        var sQuery = selectedPath[typeVariant];
        function filterWithId(value) {
          return value._id === sQuery;
        }
        var detailProduct = aDataProducts.filter(filterWithId);
        this.getView()
          .getModel("oGlobalModel")
          .setProperty("/", { detailProduct: detailProduct[0] });
        this._onObjectMatched();

      },
      onPressColorVariant: function (oEvent) {
        this._setProductVariant(oEvent, "color");
      },
      onPressSizeVariant: function (oEvent) {
        this._setProductVariant(oEvent, "size");
      },
      handleImagePress: function (oEvent) {
        var oView = this.getView().byId("bigImg");
        var sImgSrc = oEvent.getSource().getSrc();
        oView.setSrc(sImgSrc);
      },
      _onObjectMatched: function () {
        var oDetailPrdct = this.getView()
          .getModel("oGlobalModel").getData().detailProduct;

        var fnFilterProducts = function (item) {
          return item.category === oDetailPrdct.category;
        };

        var oDataProducts = this.getView().getModel("oDataProducts").getData();
        var selectedProducts = oDataProducts.filter(fnFilterProducts);
        var oModel = new JSONModel(selectedProducts);
        this.getView().setModel(oModel, "prdctCatgryMdl");
      },

      onProductItemPress: function (oEvent) {
        var oBndngCtxt = oEvent.getSource().getBindingContext("prdctCatgryMdl");
        var spath = oBndngCtxt.getPath();
        var selectedPath = oBndngCtxt.getProperty(spath);
        this.getView()
          .getModel("oGlobalModel")
          .setProperty("/", { detailProduct: selectedPath });
        this.getRouter().navTo("productDetail", {
          detailObj: selectedPath.product_name,
        });
        this._onObjectMatched();
      },

      onSort: function () {
        this._bDescendingSort = !this._bDescendingSort;
        var oBinding = this.oProductsTable.getBinding("items"),
          oSorter = new Sorter("Name", this._bDescendingSort);

        oBinding.sort(oSorter);
      },
      onChange: function (oEvent) {
        var sRecipient = this.getView()
          .getModel()
          .getProperty("/recipient/value");

        // show message
        // MessageToast.show("Value changed to " + sRecipient);
      },

      /**
       * Called, when the add button of a product is pressed.
       * Saves the product, the i18n bundle, and the cart model and hands them to the <code>addToCart</code> function
       * @public
       */
      onAddToCartDetails: function (oEvent) {
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var product_id = oSelectedPath._id;
        var previous_wishlist = sessionStorage.getItem('product_id')
        if (previous_wishlist != null) {
          var temp = previous_wishlist + ';' + product_id
          sessionStorage.setItem('product_id', temp)
        } else {
          sessionStorage.setItem('product_id', ('' + product_id))
        }
        var item_status = this.getView().byId("product_status");
        var item_exist = item_status.mProperties.text;
        if (item_exist === "In Stock") {
          var oResourceBundle = this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
          //!Store Cart data into session storage
          var sRecipient = this.getView()
            .getModel()
            .getProperty("/recipient/value");
          sessionStorage.setItem("myvalue5", sRecipient);
          var oSelectedPath = this.getView()
            .getModel("oGlobalModel")
            .getData().detailProduct;
          var oDataProducts = this.getView().getModel("oDataProducts");
          cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);
          //   After add item to the cart the default value will be 1
          this.getView().byId("defaultValue").setValue(1);
        } else {
          MessageToast.show("Product is not available!");
          this.getView().byId("defaultValue").setValue(1);
        }

        var cus_id = localStorage.getItem("customer_id")
        var gues_id = localStorage.getItem("Guest_id");
        if (!gues_id) {
          var customer_id = cus_id;
        } else if (gues_id) {
          customer_id = gues_id;
        }
        // else if(!gues_id && !cus_id){
        //   MessageToast.show("You must login First!")
        //   this.getRouter().navTo("home");
        // }
        var formdata = new FormData();
        formdata.append("customer_id", customer_id);
        formdata.append("product_id", product_id);

        var requestOptions = {
          method: 'PATCH',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://64.227.115.243:8080/checkout/", requestOptions)
          .then(response => response.text())
          .then(result => { console.log(result) })
          .catch(error => console.log('error', error));

      },
      validUser: function () {
        var access_token = localStorage.getItem("access_token");
        if (!access_token) {
          this.getRouter().navTo("home");
          MessageToast.show("You must Login first!");
        } else if (access_token) {
          this.onAddToCartDetails();
        }
      },
      onAddToCartDetails_delete: function (oEvent) {
        var prod_id = oEvent.getSource().data("itemId");
        var oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        //!Store Cart data into session storage
        var sRecipient = this.getView()
          .getModel()
          .getProperty("/recipient/value");
        sessionStorage.setItem("myvalue5", sRecipient);
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var oDataProducts = this.getView().getModel("oDataProducts");
        // var cart_entity = oDataProducts.oData.cartEntries
        cart.deleteFromCart(oResourceBundle, oSelectedPath, oDataProducts, prod_id);
      },
      onBuyItNow: function () {
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var product_id = oSelectedPath._id;
        var customer_id_guest = localStorage.getItem("Guest_id");
        var customer_id_login = localStorage.getItem("customer_id");
        if (!customer_id_guest) {
          var customer_id = customer_id_login;
        } else {
          customer_id = customer_id_guest;
        }
        var item_status = this.getView().byId("product_status");
        var item_exist = item_status.mProperties.text;
        if (item_exist === "In Stock") {
          var oResourceBundle = this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
          //!Store Cart data into session storage
          var sRecipient = this.getView()
            .getModel()
            .getProperty("/recipient/value");
          sessionStorage.setItem("myvalue5", sRecipient);
          var oSelectedPath = this.getView()
            .getModel("oGlobalModel")
            .getData().detailProduct;
          var oDataProducts = this.getView().getModel("oDataProducts");
          cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);

          var formdata = new FormData();
          formdata.append("customer_id", customer_id);
          formdata.append("product_id", product_id);
          formdata.append("quantity", "1");
          formdata.append("voucher", "welcome12");
          // formdata.append("voucher", "welcome12");

          var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          fetch("http://64.227.115.243:8080/buy_now/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

          //   After add item to the cart the default value will be 1
          this.getView().byId("defaultValue").setValue(1);
          this.getRouter().navTo("checkout");
        } else {
          MessageToast.show("Product is not available!");
        }
      },

      onAddToWishList: function (oEvent) {

        var login_id = localStorage.getItem("customer_id");
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var product_id = oSelectedPath._id;
        var previous_wishlist = sessionStorage.getItem('product_id')
        if (previous_wishlist != null) {
          var temp = previous_wishlist + ';' + product_id
          sessionStorage.setItem('product_id', temp)
        } else {
          sessionStorage.setItem('product_id', ('' + product_id))
        }
        var customer_id = localStorage.getItem("customer_id");

        if (!login_id) {
          MessageToast.show("You have to login first");
          var uid = localStorage.getItem("customer_id");
          var Guid = localStorage.getItem("Guest_id");
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
              // MessageToast.show(JSON.parse(result).message)

              if (JSON.parse(result).message === "Product already exists") {
                // sessionStorage.setItem("product_id");
                var login_id = localStorage.getItem("customer_id");
                var oSelectedPath = this.getView()
                  .getModel("oGlobalModel")
                  .getData().detailProduct;
                var product_id = oSelectedPath._id;
                var customer_id = localStorage.getItem("customer_id");

                if (!login_id) {
                  MessageToast.show("You have to login first");
                  var uid = localStorage.getItem("customer_id");
                  var Guid = localStorage.getItem("Guest_id");

                  if (uid == null && Guid == null) {
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
