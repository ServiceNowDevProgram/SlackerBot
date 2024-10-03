/*
activation_example:!corporatejoke tell a corporate joke
regex:!corporatejoke
flags:gmi
*/

var where = current.text.indexOf('!corporatejoke ') + 13;
var term = current.text.substr(where).trim();

// Build the search URL using a public joke API
var searchUrl = 'https://api.chucknorris.io/jokes/search?query=' + term;

// Replace "YOUR_API_KEY" with your actual Chuck Norris Jokes API key
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint(searchUrl);
chatReq.setHttpMethod("GET");
var chatResponse = chatReq.execute();
var chatResponseBody = chatResponse.getBody();

// Parse the API response as JSON
var responseData = JSON.parse(chatResponseBody);

// Check if the API response contains any jokes
if (responseData.result.length > 0) {
  var joke = responseData.result[0].value;
  new x_snc_slackerbot.Slacker().send_chat(current, joke, false);
} else {
  new x_snc_slackerbot.Slacker().send_chat(current, "Sorry, I couldn't find a corporate joke related to \"" + term + "\".", false);
}
