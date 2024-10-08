/*
activation_example: !quote
regex: !quote
flags: gmi
order: 100
stop_processing: true
active: true
*/

// GlideCacheManager to store quote for the day
var cache = GlideCacheManager.get().getCache('daily_quote');
var currentDate = new Date().toDateString(); // Get the current date

// Retrieve the cached quote
var cachedQuote = cache.get(currentDate);

if (cachedQuote) {
    // If there is cached data then send it
    new x_snc_slackerbot.Slacker().send_chat(current, `Quote of the Day: "${cachedQuote.content}" - ${cachedQuote.author}`, false);
} else {
    // fetch a new quote from the API
    var request = new sn_ws.RESTMessageV2();
    request.setHttpMethod('GET');
    request.setEndpoint('https://api.quotable.io/random');
    var response = request.execute();
    var responseBody = response.getBody();
    var parsedResponse = JSON.parse(responseBody);
    
    if (response.getStatusCode() == 200 && parsedResponse.content) {
        var newQuote = parsedResponse.content;
        var author = parsedResponse.author;

        // Cache the quote for the current data
        cache.put(currentDate, { content: newQuote, author: author });
        new x_snc_slackerbot.Slacker().send_chat(current, `Quote of the Day: "${newQuote}" - ${author}`, false);
    } else {
        // If any error occurs
        new x_snc_slackerbot.Slacker().send_chat(current, 'Sorry, I could not retrieve the quote of the day. Please try again later.', true);
    }
}
