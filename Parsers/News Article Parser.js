/*
activation_example:!news topic or story to search for
regex:!news
flags:gmi
*/

var term = current.text.replace("!news ", "").trim();

// Build the search URL using a public news API to search for a specific topic or story
var searchUrl = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(term) + '&apiKey=' + gs.getProperty("newsapi.key");

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
  var author = article.author || "Unknown author";
  var description = article.description.length > 255 ? article.description.substring(0, 252) + "... Read More" : article.description;
  var url = article.url;

  // Send the extracted information as a Slack message
  var message = "*Title:* " + title + "\n*Author:* " + author + "\n*Description:* " + description + "\n*URL:* " + url;
  new x_snc_slackerbot.Slacker().send_chat(current, message, true);
} else {
  new x_snc_slackerbot.Slacker().send_chat(current, "Sorry, I couldn't find any news articles related to \"" + term + "\".", true);
}
