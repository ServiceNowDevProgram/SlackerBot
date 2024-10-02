/*
activation_example:!inspire
regex:\b(inspire|inspiration|inspiring|inspired|motivation|motivate|motivated)\b
flags:gmi
*/

var quote = new sn_ws.RESTMessageV2();
quote.setEndpoint('https://zenquotes.io/api/random');
quote.setHttpMethod('GET');

var chatResponse = quote.execute();
var chatResponseBody = JSON.parse(chatResponse.getBody());
var quoteText = chatResponseBody[0].q;
var author = chatResponseBody[0].a;

new x_snc_slackerbot.Slacker().send_chat(current, 'Some food for thought!:\n "' + quoteText + '" - ' + author, false);
