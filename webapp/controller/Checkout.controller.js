sap.ui.define(
  [
    "./BaseController",
    "../model/cart",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "../model/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Link",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "../model/EmailType",
  ],
  function (
    BaseController,
    cart,
    JSONModel,
    Device,
    formatter,
    MessageBox,
    Link,
    MessagePopover,
    MessagePopoverItem,
    MessageToast,
    EmailType
  ) {
    "use strict";

    return BaseController.extend("ag.agasown.controller.Checkout", {
      types: {
        email: new EmailType(),
      },

      formatter: formatter,

      onInit: function () {

        var oModel = new JSONModel({
          SelectedPayment: "Credit Card",
          SelectedDeliveryMethod: "Standard Delivery",
          DifferentDeliveryAddress: false,
          CashOnDelivery: {
            FirstName: "",
            LastName: "",
            PhoneNumber: "",
            Email: "",
          },
          InvoiceAddress: {
            Address: "",
            City: "",
            ZipCode: "",
            Country: "",
            Note: "",
          },
          DeliveryAddress: {
            Address: "",
            Country: "",
            City: "",
            ZipCode: "",
            Note: "",
          },
          CreditCard: {
            Name: "",
            CardNumber: "",
            SecurityCode: "",
            Expire: "",
          },

        }),

          oReturnToShopButton = this.byId("returnToShopButton");

        this.getView().setModel(oModel);

        // previously selected entries in wizard
        this._oHistory = {
          prevPaymentSelect: null,
          prevDiffDeliverySelect: null,
        };

        // Assign the model object to the SAPUI5 core
        this.getView().setModel(
          sap.ui.getCore().getMessageManager().getMessageModel(),
          "message"
        );

        // switch to single column view for checout process
        this.getRouter()
          .getRoute("checkout")
          .attachMatched(function () { }.bind(this));
        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // oRouter.stop();

        this.setHeaderModel();

        //! Hover function on menu button
        this.byId("target").addEventDelegate(
          {
            onmouseover: this._showPopover,
            // onmouseout: this._clearPopover,
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
       * Only validation on client side, does not involve a back-end server.
       * @param {sap.ui.base.Event} oEvent Press event of the button to display the MessagePopover
       */
      onShowMessagePopoverPress: function (oEvent) {
        var oButton = oEvent.getSource();

        var oLink = new Link({
          text: "Show more information",
          href: "http://sap.com",
          target: "_blank",
        });

        /**
         * Gather information that will be visible on the MessagePopover
         */
        var oMessageTemplate = new MessagePopoverItem({
          type: "{message>type}",
          title: "{message>message}",
          subtitle: "{message>additionalText}",
          link: oLink,
        });

        if (!this.byId("errorMessagePopover")) {
          var oMessagePopover = new MessagePopover(
            this.createId("messagePopover"),
            {
              items: {
                path: "message>/",
                template: oMessageTemplate,
              },
              afterClose: function () {
                oMessagePopover.destroy();
              },
            }
          );
          this._addDependent(oMessagePopover);
        }

        oMessagePopover.openBy(oButton);
      },

      //To be able to stub the addDependent function in unit test, we added it in a separate function
      _addDependent: function (oMessagePopover) {
        this.getView().addDependent(oMessagePopover);
      },

      /**
       * Shows next WizardStep according to user selection
       */
      goToPaymentStep: function () {
        var selectedKey = this.getView()
          .getModel()
          .getProperty("/SelectedPayment");
        var oElement = this.byId("paymentTypeStep");
        switch (selectedKey) {
          case "Bank Transfer":
            oElement.setNextStep(this.byId("bankAccountStep"));
            break;
          case "Cash on Delivery":
            oElement.setNextStep(this.byId("cashOnDeliveryStep"));
          case "PayPal":
            oElement.setNextStep(this.byId("cashOnDeliveryStep"));
            break;
          case "Credit Card":
          default:
            oElement.setNextStep(this.byId("creditCardStep"));
            break;
        }
      },

      /**
       * Shows warning message if user changes previously selected payment method
       */
      setPaymentMethod: function () {
        this._setDiscardableProperty({
          message: this.getResourceBundle().getText(
            "checkoutControllerChangePayment"
          ),
          discardStep: this.byId("paymentTypeStep"),
          modelPath: "/SelectedPayment",
          historyPath: "prevPaymentSelect",
        });
      },

      /**
       * Shows warning message if user changes previously selected delivery address
       */
      setDifferentDeliveryAddress: function () {
        this._setDiscardableProperty({
          message: this.getResourceBundle().getText(
            "checkoutControllerChangeDelivery"
          ),
          discardStep: this.byId("invoiceStep"),
          modelPath: "/DifferentDeliveryAddress",
          historyPath: "prevDiffDeliverySelect",
        });
      },

      /**
       * Called from WizardStep "invoiceStep"
       * shows next WizardStep "DeliveryAddressStep" or "orderSummaryStep" according to user selection
       */
      invoiceAddressComplete: function () {
        var sNextStepId = this.getView()
          .getModel()
          .getProperty("/DifferentDeliveryAddress")
          ? "deliveryAddressStep"
          : "orderSummaryStep";
        this.byId("invoiceStep").setNextStep(this.byId(sNextStepId));
      },

      /**
       * Called from <code>ordersummary</code>
       * shows warning message and cancels order if confirmed
       */
      handleWizardCancel: function () {
        var sText = this.getResourceBundle().getText(
          "checkoutControllerAreYouSureCancel"
        );
        this._handleSubmitOrCancel(sText, "warning", "home");
      },

      /**
       * Called from <code>ordersummary</code>
       * shows warning message and submits order if confirmed
       */
      handleWizardSubmit: function () {
        var sText = this.getResourceBundle().getText(
          "checkoutControllerAreYouSureSubmit"
        );
        this._handleSubmitOrCancel(sText, "confirm", "ordercompleted");
      },

      /**
       * Called from <code>_handleSubmitOrCancel</code>
       * resets Wizard after submitting or canceling order
       */
      backToWizardContent: function () {
        this.byId("wizardNavContainer").backToPage(
          this.byId("wizardContentPage").getId()
        );
      },

      /**
       * Removes validation error messages from the previous step
       */
      _clearMessages: function () {
        sap.ui.getCore().getMessageManager().removeAllMessages();
      },

      /**
       * Checks the corresponding step after activation to decide whether the user can proceed or needs
       * to correct the input
       */
      onCheckStepActivation: function (oEvent) {
        this._clearMessages();
        var sWizardStepId = oEvent.getSource().getId();
        switch (sWizardStepId) {
          case this.createId("creditCardStep"):
            this.checkCreditCardStep();
            break;

          // Creating ID for Debit Card API
          case this.createId("deditCardStep"):
            this.checkDeditCardStep();
            break;
          case this.createId("cashOnDeliveryStep"):
            this.checkCashOnDeliveryStep();
            break;
          case this.createId("invoiceStep"):
            this.checkInvoiceStep();
            break;
          case this.createId("deliveryAddressStep"):
            this.checkDeliveryAddressStep();
            break;
        }
      },

      /**
       * Validates the credit card step initially and after each input
       */
      checkCreditCardStep: function () {
        this._checkStep("creditCardStep", [
          "creditCardHolderName",
          "creditCardNumber",
          "creditCardSecurityNumber",
          "creditCardExpirationDate",
        ]);
      },

      /**
       * Validates the cash on delivery step initially and after each input
       */
      checkCashOnDeliveryStep: function () {
        this._checkStep("cashOnDeliveryStep", [
          "cashOnDeliveryName",
          "cashOnDeliveryLastName",
          "cashOnDeliveryPhoneNumber",
          "cashOnDeliveryEmail",
        ]);
      },

      /**
       * Validates the invoice step initially and after each input
       */
      checkInvoiceStep: function () {
        this._checkStep("invoiceStep", [
          "invoiceAddressAddress",
          "invoiceAddressCity",
          "invoiceAddressZip",
          "invoiceAddressCountry",
        ]);
      },
      newFunction: function () {
        $(".sapMSegBBtnInner").click(function () {
          $('.sapMSegBBtnInner').not(this).removeClass("activate");
          $(this).addClass("activate");
        });
      },

      /**
       * Validates the delivery address step initially and after each input
       */
      checkDeliveryAddressStep: function () {
        this._checkStep("deliveryAddressStep", [
          "deliveryAddressAddress",
          "deliveryAddressCity",
          "deliveryAddressZip",
          "deliveryAddressCountry",
        ]);
      },

      /**
       * Checks if one or more of the inputs are empty
       * @param {array} aInputIds - Input ids to be checked
       * @returns {boolean}
       * @private
       */
      _checkInputFields: function (aInputIds) {
        var oView = this.getView();

        return aInputIds.some(function (sInputId) {
          var oInput = oView.byId(sInputId);
          var oBinding = oInput.getBinding("value");
          try {
            oBinding.getType().validateValue(oInput.getValue());
          } catch (oException) {
            return true;
          }
          return false;
        });
      },

      /**
       * Hides button to proceed to next WizardStep if validation conditions are not fulfilled
       * @param {string} sStepName - the ID of the step to be checked
       * @param {array} aInputIds - Input IDs to be checked
       * @private
       */
      _checkStep: function (sStepName, aInputIds) {
        var oWizard = this.byId("shoppingCartWizard"),
          oStep = this.byId(sStepName),
          bEmptyInputs = this._checkInputFields(aInputIds),
          bValidationError = !!sap.ui
            .getCore()
            .getMessageManager()
            .getMessageModel()
            .getData().length;

        if (!bValidationError && !bEmptyInputs) {
          oWizard.validateStep(oStep);
        } else {
          oWizard.invalidateStep(oStep);
        }
      },

      /**
       * Called from  Wizard on <code>complete</code>
       * Navigates to the summary page in case there are no errors
       */
      checkCompleted: function () {
        if (
          sap.ui.getCore().getMessageManager().getMessageModel().getData()
            .length > 0
        ) {
          MessageBox.error(
            this.getResourceBundle().getText("popOverMessageText")
          );
        } else {
        }
      },

      /**
       * navigates to "home" for further shopping
       */
      onReturnToShopButtonPress: function () {
        this.getRouter().navTo("home");
      },


      // *** the following functions are private "helper" functions ***

      /**
       * Called from both <code>setPaymentMethod</code> and <code>setDifferentDeliveryAddress</code> functions.
       * Shows warning message if user changes previously selected choice
       * @private
       * @param {Object} oParams Object containing message text, model path and WizardSteps
       */
      _setDiscardableProperty: function (oParams) {
        var oWizard = this.byId("shoppingCartWizard");
        if (oWizard.getProgressStep() !== oParams.discardStep) {
          MessageBox.warning(oParams.message, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.YES) {
                oWizard.discardProgress(oParams.discardStep);
                this._oHistory[oParams.historyPath] = this.getView()
                  .getModel()
                  .getProperty(oParams.modelPath);
              } else {
                this.getView()
                  .getModel()
                  .setProperty(
                    oParams.modelPath,
                    this._oHistory[oParams.historyPath]
                  );
              }
            }.bind(this),
          });
        } else {
          this._oHistory[oParams.historyPath] = this.getView()
            .getModel()
            .getProperty(oParams.modelPath);
        }
      },

      /**
       * Called from <code>handleWizardCancel</code> and <code>handleWizardSubmit</code> functions.
       * Shows warning message, resets shopping cart and wizard if confirmed and navigates to given route
       * @private
       * @param {string} sMessage message text
       * @param {string} sMessageBoxType message box type (e.g. warning)
       * @param {string} sRoute route to navigate to
       */
      _handleSubmitOrCancel: function (sMessage, sMessageBoxType, sRoute) {
        MessageBox[sMessageBoxType](sMessage, {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              // resets Wizard
              var oWizard = this.byId("shoppingCartWizard");
              var oModel = this.getView().getModel();
              var oCartModel =
                this.getOwnerComponent().getModel("oDataProducts");
              this._navToWizardStep(this.byId("contentsStep"));
              oWizard.discardProgress(oWizard.getSteps()[0]);
              var oModelData = oModel.getData();
              oModelData.SelectedPayment = "Credit Card";
              oModelData.SelectedDeliveryMethod = "Standard Delivery";
              oModelData.DifferentDeliveryAddress = false;
              oModelData.CashOnDelivery = {};
              oModelData.InvoiceAddress = {};
              oModelData.DeliveryAddress = {};
              oModelData.CreditCard = {};
              oModel.setData(oModelData);
              //all relevant cart properties are set back to default. Content is deleted.
              var oCartModelData = oCartModel.getData();
              oCartModelData.cartEntries = {};
              oCartModelData.totalPrice = 0;
              oCartModel.setData(oCartModelData);
              this.getRouter().navTo(sRoute);
            }
          }.bind(this),
        });
      },

      /**
       * gets customData from ButtonEvent
       * and navigates to WizardStep
       * @private
       * @param {sap.ui.base.Event} oEvent the press event of the button
       */
      _navBackToStep: function (oEvent) {
        var sStep = oEvent.getSource().data("navBackTo");
        var oStep = this.byId(sStep);
        this._navToWizardStep(oStep);
      },

      /**
       * navigates to WizardStep
       * @private
       * @param {Object} oStep WizardStep DOM element
       */
      _navToWizardStep: function (oStep) {
        var oNavContainer = this.byId("");
        var _fnAfterNavigate = function () {
          this.byId("shoppingCartWizard").goToStep(oStep);
          // detaches itself after navigaton
          oNavContainer.detachAfterNavigate(_fnAfterNavigate);
        }.bind(this);

        oNavContainer.attachAfterNavigate(_fnAfterNavigate);
        console.log("first", oNavContainer);
        oNavContainer.to(this.byId("wizardContentPage"));
      },
      checkCardHolderName: function (oEvent) {
        var data = oEvent.getParameter("newValue");
        if (data.length < 2) {
          this.getView()
            .byId("creditCardHolderName")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length >= 3) {
          this.getView()
            .byId("creditCardHolderName")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkCardNumber: function (oEvent) {
        let data = this.byId("creditCardNumber");
        let arr = data._oTempValue._aContent;
        let numList = [];
        for (let i = 0; i < arr.length; i++) {
          let cred_number = data._oTempValue._aContent[i];
          if (cred_number != "-" && cred_number != "_") {
            numList.push(cred_number);
          }
        }
        var cred_num = numList.length
        if (cred_num < 16) {
          this.getView()
            .byId("creditCardNumber")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (cred_num >= 4) {
          this.getView()
            .byId("creditCardNumber")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkCardSecurityNumber: function (oEvent) {
        let data = this.byId("creditCardSecurityNumber");
        let arr = data._oTempValue._aContent;
        let numList = [];
        for (let i = 0; i < arr.length; i++) {
          let cred_number = data._oTempValue._aContent[i];
          if (cred_number != "-" && cred_number != "_") {
            numList.push(cred_number);
          }
        }
        var cred_num = numList.length
        if (cred_num < 3) {
          this.getView()
            .byId("creditCardSecurityNumber")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (cred_num === 3) {
          this.getView()
            .byId("creditCardSecurityNumber")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkInvoiceAddressAddress: function (oEvent) {
        let data = this.byId("invoiceAddressAddress").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("invoiceAddressAddress")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("invoiceAddressAddress")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkInvoiceAddressCity: function (oEvent) {
        let data = this.byId("invoiceAddressCity").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("invoiceAddressCity")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("invoiceAddressCity")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkInvoiceAddressZip: function (oEvent) {
        let data = this.byId("invoiceAddressZip").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("invoiceAddressZip")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("invoiceAddressZip")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkInvoiceAddressCountry: function (oEvent) {
        let data = this.byId("invoiceAddressCountry").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("invoiceAddressCountry")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("invoiceAddressCountry")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkDeliveryAddressAddress: function (oEvent) {
        let data = this.byId("deliveryAddressAddress").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("deliveryAddressAddress")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("deliveryAddressAddress")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkDeliveryAddressCity: function (oEvent) {
        let data = this.byId("deliveryAddressCity").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("deliveryAddressCity")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("deliveryAddressCity")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkDeliveryAddressZip: function (oEvent) {
        let data = this.byId("deliveryAddressZip").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("deliveryAddressZip")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("deliveryAddressZip")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkDeliveryAddressCountry: function (oEvent) {
        let data = this.byId("deliveryAddressCountry").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("deliveryAddressCountry")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("deliveryAddressCountry")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkPaypalUserName: function (oEvent) {
        let data = this.byId("cashOnDeliveryName").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("cashOnDeliveryName")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("cashOnDeliveryName")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkPaypalUserLastName: function (oEvent) {
        let data = this.byId("cashOnDeliveryLastName").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("cashOnDeliveryLastName")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("cashOnDeliveryLastName")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },
      checkPaypalUserPhoneNumber: function (oEvent) {
        let data = this.byId("cashOnDeliveryPhoneNumber").getValue();
        if (data.length < 9 || data.length > 10) {
          this.getView()
            .byId("cashOnDeliveryPhoneNumber")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 9) {
          this.getView()
            .byId("cashOnDeliveryPhoneNumber")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },

      checkPaypalUserEmail: function (oEvent) {
        let data = this.byId("cashOnDeliveryEmail").getValue();
        if (data.length < 3) {
          this.getView()
            .byId("cashOnDeliveryEmail")
            .setValueState(sap.ui.core.ValueState.Error);
        } else if (data.length > 3) {
          this.getView()
            .byId("cashOnDeliveryEmail")
            .setValueState(sap.ui.core.ValueState.Success);
        }
      },

      handleWizardSubmitss: async function (oEvent) {
        var selectedKey = this.getView()
          .getModel()
          .getProperty("/SelectedPayment");
        var customer_id_guest = sessionStorage.getItem("Guid");
        var customer_id_login = sessionStorage.getItem("uid");
        if (!customer_id_guest){
          var customer_id = customer_id_login;
        }else{
          customer_id = customer_id_guest;
        }
        var total_Price2 = this.byId("totalPricefinal").getText();
        var total_Price1 = total_Price2.split(" ");
        var total_price5 = total_Price1[1];
        var total_price0 = total_Price1[1].split(".");
        var total_price = total_price0[0];
        var total_price3 = total_price.replace(',', '');

        var expDate = this.byId("creditCardExpirationDate").getValue();
        var expDate1 = expDate.slice(0, 2);
        var expYear = expDate.slice(3);
        // product details
        var oCartModels = this.getView()
          .getModel("oDataProducts")
          .getProperty("/cartEntries");
        var ans = Object.keys(oCartModels);
        var oCartModel = this.getView()
          .getModel("oDataProducts")
          .getProperty(`/cartEntries/${ans}`);


        var pro_Quantity = oCartModel.Quantity;
        var product_name = oCartModel.product_name;
        var product_price = oCartModel.price;

        if (selectedKey == "Credit Card" || selectedKey == "Dedit Card") {
          var formdata = new FormData();
          formdata.append("card_number", this.byId("creditCardNumber").getValue());
          formdata.append("exp_month", expDate1);
          formdata.append("exp_year", expYear);
          formdata.append("cvc", this.byId("creditCardSecurityNumber").getValue());
          formdata.append("name", this.byId("creditCardHolderName").getValue());
          formdata.append("email", this.byId("loginEmailInput").getValue());
          formdata.append("amount", total_price5);
          formdata.append("currency", "EUR");
          formdata.append("description", "card_payment");
          formdata.append("customer_id", customer_id);

          var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          let respo = await fetch("http://64.227.115.243:8080/stripe/", requestOptions)
            .then(response => {
              return response.status
            })
            .catch(error => console.log('error', error));
          if (respo === 200) {
            alert("Order Accepted!");
            window.location.replace("index.html#/payment");
          }
          else {
            alert('order not accepted')
          }
        } else if (selectedKey == "PayPal") {
          var formdata = new FormData();
          formdata.append("product_name", product_name);
          formdata.append("price", product_price);
          formdata.append("currency", "EUR");
          formdata.append("quantity", pro_Quantity);
          formdata.append("customer_id", customer_id);

          var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
          };

          fetch("http://64.227.115.243:8080/paypal/payment/", requestOptions)
            .then((response) => response.text())
            .then((result) => window.open(result, "_self"))
            .catch((error) => console.log("error", error));

        } else if (selectedKey == "Bank Transfer") {
          var formdata = new FormData();
          formdata.append("name", "User");
          formdata.append("email", this.byId("loginEmailInput").getValue());
          formdata.append("cus_add_line1", this.byId("invoiceAddressAddress").getValue());
          formdata.append("cus_add_city", this.byId("invoiceAddressCity").getValue());
          formdata.append("cus_add_state", this.byId("invoiceAddressCountry").getValue());
          formdata.append("amount", total_price5);
          formdata.append("currency", "eur");
          formdata.append("country", "DE");
          formdata.append("descrition", "SOFORT");
          formdata.append("customer_id", customer_id);
          var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
          };
          fetch("http://64.227.115.243:8080/stripe/sofort/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              window.open(result, "_self")
            })
            .catch((error) => console.log("error", error));
        }
      },
    });
  }
);

