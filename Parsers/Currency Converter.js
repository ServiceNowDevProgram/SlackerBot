/*
activation_example:!convert <amount> <currency> to <currency>
regex:!convert (\d+) (\w+) to (\w+)
flags:gmi
*/

var input = current.text.trim(); // Get entire user input after trimming

// Extract amount, fromCurrency, and toCurrency from the input
var match = input.match(/!convert (\d+) (\w+) to (\w+)/);
var amount = match ? match[1] : "";
var fromCurrency = match ? match[2] : "";
var toCurrency = match ? match[3] : "";

// Build the search URL using the Currency Converter API
var baseUrl = 'https://api.exchangeratesapi.io/latest';
var searchUrl = baseUrl + '?base=' + fromCurrency;

// Make the API request
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint(searchUrl);
chatReq.setHttpMethod("GET");
var chatResponse = chatReq.execute();
var chatResponseBody = chatResponse.getBody();

// Parse the API response as JSON
var responseData = JSON.parse(chatResponseBody);

// Check if the API response contains exchange rates
if (responseData.rates && responseData.rates[toCurrency]) {
  var exchangeRate = responseData.rates[toCurrency];
  var convertedAmount = amount * exchangeRate;

  // Send a formatted message to Slack
  new x_snc_slackerbot.Slacker().send_chat(current, `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(2)} ${toCurrency}`, false);
} else {
  new x_snc_slackerbot.Slacker().send_chat(current, "Sorry, I couldn't find the exchange rate for ${fromCurrency} to ${toCurrency}.", false);
}
