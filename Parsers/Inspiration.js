/*
activation_example:!inspiration
regex:!inspiration
flags:gmi
*/

var input = current.text.trim(); 
if (/!inspiration/i.test(input)) {  
    var quote = new sn_ws.RESTMessageV2();
    quote.setEndpoint('https://zenquotes.io/api/random');
    quote.setHttpMethod('GET');

    var chatResponse = quote.execute();
    var chatResponseBody = JSON.parse(chatResponse.getBody());

    if (chatResponseBody && chatResponseBody.length > 0) {
        var quoteText = chatResponseBody[0].q;
        var author = chatResponseBody[0].a;

        new x_snc_slackerbot.Slacker().send_chat(current, 'A dose of inspiration for you!:\n "' + quoteText + '" - ' + author, false);
    }
}

