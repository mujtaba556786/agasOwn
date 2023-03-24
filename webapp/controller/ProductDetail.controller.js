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
        var product = {};
        var oSelectedPath = this.getView().getModel("oGlobalModel").getData().detailProduct;
        var oDataProducts = this.getView().getModel("oDataProducts");
        var product_id = oSelectedPath._id;
        var previous_wishlist = sessionStorage.getItem('product_id');
        var item_status = this.getView().byId("product_status");
        var item_exist = item_status.mProperties.text;
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
        var access_token = localStorage.getItem("access_token")
        var guest_access_token = localStorage.getItem("guest_access_token");
        //TRY Start

        var oCartModel = this.getView().getModel("oDataProducts");
        // var oCartModel = this.getView().getModel("oCartFinalModel");
        var sRecipient = this.getView()
          .getModel()
          .getProperty("/recipient/value");

        if (previous_wishlist != null) {
          var temp = previous_wishlist + ';' + product_id
          sessionStorage.setItem('product_id', temp)
        } else {
          sessionStorage.setItem('product_id', ('' + product_id))
        }

        if (item_exist === "In Stock") {
          var oResourceBundle = this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
          //!Store Cart data into session storage

          sessionStorage.setItem("myvalue5", sRecipient);
          var oSelectedPath = this.getView().getModel("oGlobalModel").getData().detailProduct;
          var oDataProducts = this.getView().getModel("oDataProducts");
          cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);
          //   After add item to the cart the default value will be 1
          this.getView().byId("defaultValue").setValue(1);
        } else {
          if (geTerms) {
            MessageToast.show("Product is not available!");
          } else if (enTerms) {
            MessageToast.show("Produkt ist nicht verfügbar!");
          } else {
            MessageToast.show("Product is not available!");
          }
          this.getView().byId("defaultValue").setValue(1);
        }


        if (!guest_access_token) {
          var token = access_token;
        } else if (guest_access_token) {
          token = guest_access_token;
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");
        var raw;
        var oCartEntries = oCartModel.getProperty("/cartEntries");
        Object.keys(oCartEntries).forEach(function (sProductId) {
          if (sProductId === product_id) {
            product[sProductId] = sRecipient;
            raw = JSON.stringify({
              "product": product
            });
            product = {}
          }
        });

        var requestOptions = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://64.227.115.243:8080/checkout/", requestOptions)
          .then(response => response.text())
          .then(async (result) => {
            //SetModel Code
            var globArr = [];
            var itemdata = String(Object.keys(product));
            var items = itemdata.split(',');
            items.forEach(function (obj) {
              globArr.push(obj);
            });

            const data = globArr.map(async (item) => {
              return await this.onGetCartProductDetails(item);
            });
            const ty = await Promise.all(data);
            var eachProd = ty.map((i) => { return (i) });
            // var oCartDataItemModel = new JSONModel(eachProd);
            // this.getView().setModel(oCartDataItemModel);

          })
          .catch(error => console.log('error', error));

      },
      onGetCartProductDetails: async function (item) {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const res = await fetch(`http://64.227.115.243:8080/products/${item}`, requestOptions)
        return res.json();

      },
      validUser: function () {
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");

        if (access_token) {
          var token = access_token;
        } else if (guest_access_token) {
          token = guest_access_token
        }
        if (!token) {
          this.getRouter().navTo("home");
          if (geTerms) {
            MessageToast.show("You must Login first!");
          } else if (enTerms) {
            MessageToast.show("Du musst dich zuerst einloggen!");
          } else {
            MessageToast.show("You must Login first!");
          }
        } else if (token) {
          this.onAddToCartDetails();
        }
      },
      onAddToCartDetails_delete: function (oEvent) {
        var access_token = localStorage.getItem("access_token");
        var guest_access_token = localStorage.getItem("guest_access_token");
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
        //DELETE API works here.
        // this.onRemoveCartItems()
        if (access_token) {
          var token = access_token
        } else if (guest_access_token) {
          token = guest_access_token
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "product_id": prod_id
        });

        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://64.227.115.243:8080/delete_checkout/", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result);
            MessageToast.show(JSON.parse(result).message);
          })
          .catch(error => console.log('error', error));

      },
      onBuyItNow: function () {
        var oSelectedPath = this.getView()
          .getModel("oGlobalModel")
          .getData().detailProduct;
        var product_id = oSelectedPath._id;
        var product = {};
        var oCartModel = this.getView().getModel("oDataProducts");
        var customer_id_guest = localStorage.getItem("guest_access_token");
        var customer_id_login = localStorage.getItem("access_token");
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("envalue");
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
          //!Store Cart data sinto session storage
          var sRecipient = this.getView()
            .getModel()
            .getProperty("/recipient/value");
          sessionStorage.setItem("myvalue5", sRecipient);
          var oSelectedPath = this.getView()
            .getModel("oGlobalModel")
            .getData().detailProduct;
          var oDataProducts = this.getView().getModel("oDataProducts");
          cart.addToCart(oResourceBundle, oSelectedPath, oDataProducts);

          //Checkout API[Patch]
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer " + customer_id);
          myHeaders.append("Content-Type", "application/json");
          var raw;
          product[product_id] = 1;
          raw = JSON.stringify({
            "product": product
          });
          product = {};


          var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("http://64.227.115.243:8080/checkout/", requestOptions)
            .then(response => response.text())
            .then(async (result) => {
              //SetModel Code
              var globArr = [];
              var itemdata = String(Object.keys(product));
              var items = itemdata.split(',');
              items.forEach(function (obj) {
                globArr.push(obj);
              });

              const data = globArr.map(async (item) => {
                return await this.onGetCartProductDetails(item);
              });
              // var oCartDataItemModel = new JSONModel(eachProd);
              // this.getView().setModel(oCartDataItemModel);

            })
            .catch(error => console.log('error', error));

          //   After add item to the cart the default value will be 1
          this.getView().byId("defaultValue").setValue(1);
          this.getRouter().navTo("checkout");
        } else {
          if (geTerms) {
            MessageToast.show("Product is not available at this moment!");
          } else if (enTerms) {
            MessageToast.show("Produkt ist derzeit nicht verfügbar!");
          } else {
            MessageToast.show("Product is not available at this moment!");
          }
        }
      },
      onGetWishItems: async function (item) {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const res = await fetch(`http://64.227.115.243:8080/products/${item}`, requestOptions)
        return res.json();
      },
      onWishlistSelect: function () {

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
            if (wishData !== null) {
              var globArr = [];
              var answ = wishData.split(',');
              answ.forEach(function (obj) {
                globArr.push(obj);
              });
              const data = globArr.map(async (item) => {
                return await this.onGetWishlistProductDetails(item);
              })
              const product = await Promise.all(data);
              var eachProd = product.map((i) => { return (i) });
              var oGlobalModel = new JSONModel(eachProd);
              // this.onInit();  //pass product
            } else {
              oGlobalModel = new JSONModel(null);  //pass product
            }  //pass product
            this.getView().setModel(oGlobalModel, "wishListmodel");
          })
          .catch(error => {
            console.log('error', error)
          });
      },
      onAddToWishList: async function (oEvent) {
        // this.onWishlistSelect();
        var token;
        var geTerms = localStorage.getItem("deValue");
        var enTerms = localStorage.getItem("enValue");
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
        var token = localStorage.getItem("access_token");

        if (!token) {
          if (geTerms) {
            MessageToast.show("You have to login first");
          } else if (enTerms) {
            MessageToast.show("Sie müssen sich zuerst anmelden");
          } else {
            MessageToast.show("You have to login first");
          }
          if (token == null) {
            this.handleLogin(oEvent);
          } else {
            this.handleLogout(oEvent);
          }
        } else {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer " + token);
          var formdata = new FormData();
          formdata.append("product_id", product_id);

          var requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
          };

          fetch("http://64.227.115.243:8080/wishlist/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              if (JSON.parse(result).message === "Product already exists") {
                var oSelectedPath = this.getView()
                  .getModel("oGlobalModel")
                  .getData().detailProduct;
                var product_id = oSelectedPath._id;

                if (!token) {
                  if (geTerms) {
                    MessageToast.show("You have to login first");
                  } else if (enTerms) {
                    MessageToast.show("Sie müssen sich zuerst anmelden");
                  } else {
                    MessageToast.show("You have to login first");
                  }
                } else {
                  var formdata = new FormData();
                  formdata.append("product_id", product_id);
                  var myHeaders = new Headers();
                  myHeaders.append("Authorization", "Bearer " + token);
                  var requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                    body: formdata,
                    redirect: "follow",
                  };

                  fetch("http://64.227.115.243:8080/delete_wishlist/", requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                      MessageToast.show(JSON.parse(result).message)
                    }
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
                if (geTerms) {
                  MessageToast.show("Added Successfully");
                } else if (enTerms) {
                  MessageToast.show("Erfolgreich hinzugefügt");
                } else {
                  MessageToast.show("Added Successfully");
                }
              }
            })

            .catch((error) => console.log("error", error));
        }

      },
    });
  }
);
