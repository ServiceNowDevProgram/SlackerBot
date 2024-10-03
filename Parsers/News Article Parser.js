/*
activation_example:!parse_news name of news website
regex:!parse_news
flags:gmi
*/

var where = current.text.indexOf('!parse_news ') + 12;
var term = current.text.substr(where).trim();

// Build the search URL using a public news API
var searchUrl = 'https://newsapi.org/v2/everything?q=' + term + '&apiKey=981bfffa7e064a22aa8d7c8723e673ae';

// Replace "YOUR_API_KEY" with your actual News API key
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint(searchUrl);
chatReq.setHttpMethod("GET");
var chatResponse = chatReq.execute();
var chatResponseBody = chatResponse.getBody();

// Parse the API response as JSON
var responseData = JSON.parse(chatResponseBody);

// Check if the API response contains any articles
if (responseData.articles.length > 0) {
  // Extract information from the first article
  var article = responseData.articles[0];
  var title = article.title;
  var author = article.author;
  var description = article.description;
  var url = article.url;

  // Send the extracted information as a Slack message
  var message = "**Title:** " + title + "\n**Author:** " + author + "\n**Description:** " + description + "\n**URL:** " + url;
  new x_snc_slackerbot.Slacker().send_chat(current, message, false);
} else {
  new x_snc_slackerbot.Slacker().send_chat(current, "Sorry, I couldn't find any news articles related to \"" + term + "\".", false);
}
