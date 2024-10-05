/*
activation_example:!strangerthings
regex:!strangerthings
flags:gmi
*/

var input = current.text.trim(); 
if (/!strangerthings/i.test(input)) {  
    var quote = new sn_ws.RESTMessageV2();
    quote.setEndpoint('https://strangerthings-quotes.vercel.app/api/quotes');
    quote.setHttpMethod('GET');

    var chatResponse = quote.execute();
    var chatResponseBody = JSON.parse(chatResponse.getBody());

    if (chatResponseBody && chatResponseBody.length > 0) {
        var quoteText = chatResponseBody[0].quote;
        var author = chatResponseBody[0].author;

        new x_snc_slackerbot.Slacker().send_chat(current, 'Here is a Stranger Things quote for you:\n "' + quoteText + '" - ' + author, false);
    }
}
