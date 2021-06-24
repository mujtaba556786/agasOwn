sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	var payment = {

		stripe: Stripe("pk_test_TYooMQauvdEDq54NiTphI7jx"),

		/**
		 * Fetch response 
		 * @param {string} sUrl payment url
		 * @return {string} formatted price
		 */
		createPayment: function (sUrl) {
			fetch("/create-payment-intent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(purchase)
			})
				.then(function (result) {
					console.log(result.json());
				})

		},

		/* ------- UI helpers ------- */

		// Shows a success message when the payment is complete
		orderComplete: function (paymentIntentId) {
			loading(false);
			document
				.querySelector(".result-message a")
				.setAttribute(
					"href",
					"https://dashboard.stripe.com/test/payments/" + paymentIntentId
				);
			document.querySelector(".result-message").classList.remove("hidden");
			document.querySelector("button").disabled = true;
		},

		// Calls stripe.confirmCardPayment
		// If the card requires authentication Stripe shows a pop-up modal to
		// prompt the user to enter authentication details without leaving your page.
		payWithCard: function (stripe, card, clientSecret) {
			loading(true);
			stripe
				.confirmCardPayment(clientSecret, {
					payment_method: {
						card: card
					}
				})
				.then(function (result) {
					if (result.error) {
						// Show error to your customer
						showError(result.error.message);
					} else {
						// The payment succeeded!
						orderComplete(result.paymentIntent.id);
					}
				});
		},



	};

	// Show a spinner on payment submission
	loading: function(isLoading) {
		if (isLoading) {
			// Disable the button and show a spinner
			document.querySelector("button").disabled = true;
			document.querySelector("#spinner").classList.remove("hidden");
			document.querySelector("#button-text").classList.add("hidden");
		} else {
			document.querySelector("button").disabled = false;
			document.querySelector("#spinner").classList.add("hidden");
			document.querySelector("#button-text").classList.remove("hidden");
		}
	};

	return payment;
});