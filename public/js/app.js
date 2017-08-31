var applicationId = 'sandbox-sq0idp-CXMf_N4EyyjHL_rn9t2ehg'; // <-- Add your application's ID here

// You can delete this 'if' statement. It's here to notify you that you need
// to provide your application ID.
if (applicationId == '') {
  alert('You need to provide a value for the applicationId variable.');
}

// Initializes the payment form. See the documentation for descriptions of
// each of these parameters.
var paymentForm = new SqPaymentForm({
  applicationId: applicationId,
  inputClass: 'sq-input',
  inputStyles: [
    {
      fontSize: '15px'
    }
  ],
  cardNumber: {
    elementId: 'sq-card-number',
    placeholder: '•••• •••• •••• ••••'
  },
  cvv: {
    elementId: 'sq-cvv',
    placeholder: 'CVV'
  },
  expirationDate: {
    elementId: 'sq-expiration-date',
    placeholder: 'MM/YY'
  },
  postalCode: {
    elementId: 'sq-postal-code'
  },
  callbacks: {

    // Called when the SqPaymentForm completes a request to generate a card
    // nonce, even if the request failed because of an error.
    cardNonceResponseReceived: function(errors, nonce, cardData) {
      if (errors) {
        console.log("Encountered errors:");

        // This logs all errors encountered during nonce generation to the
        // Javascript console.
        errors.forEach(function(error) {
          console.log('  ' + error.message);
        });

      // No errors occurred. Extract the card nonce.
      } else {
        document.getElementsByName('nonce')[0].value = nonce;
        for (var key in cardData) {
          document.getElementsByName(key)[0].value = cardData[key];
        }
        document.getElementById('commerceForm').submit();
      }
    },

    unsupportedBrowserDetected: function() {
      // Fill in this callback to alert buyers when their browser is not supported.
    },

    // Fill in these cases to respond to various events that can occur while a
    // buyer is using the payment form.
    inputEventReceived: function(inputEvent) {
      switch (inputEvent.eventType) {
        case 'focusClassAdded':
          // Handle as desired
          break;
        case 'focusClassRemoved':
          // Handle as desired
          break;
        case 'errorClassAdded':
          // Handle as desired
          break;
        case 'errorClassRemoved':
          // Handle as desired
          break;
        case 'cardBrandChanged':
          // Handle as desired
          break;
        case 'postalCodeChanged':
          // Handle as desired
          break;
      }
    },

    paymentFormLoaded: function() {
    }
  }
});

function requestCardNonce(event) {
  event.preventDefault();
  paymentForm.requestCardNonce();
}