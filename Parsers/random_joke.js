/*
activation_example:!joke tell me a joke
regex:joke
flags:gmi
*/

var where = current.text.indexOf('joke') + 13;
var term = current.text.substr(where).trim();

// Build the search URL using a public joke API
var searchUrl = 'https://official-joke-api.appspot.com/random_joke';

var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint(searchUrl);
chatReq.setHttpMethod("GET");
var chatResponse = chatReq.execute();
var chatResponseBody = chatResponse.getBody();

// Parse the API response as JSON
var responseData = JSON.parse(chatResponseBody);

// Check if the API response contains any   
 jokes
if (responseData.setup.length > 0) {
  var joke = responseData.setup;
  var punchline = response.punchline
  new x_snc_slackerbot.Slacker().send_chat(current, joke, false); // this will build up the Joke Setup i.e question
  new x_snc_slackerbot.Slacker().send_chat(current, punchline, false); // to provide the a funny answer
  
} else {
  new x_snc_slackerbot.Slacker().send_chat(current, "Sorry, I couldn't find any jokes in the moment Come back later.", false);
}
