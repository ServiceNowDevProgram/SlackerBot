/*
activation_example:!bitcoinprice
regex:!bitcoinprice
flags:gmi
*/

var input = current.text.trim(); 
if (/!bitcoinprice/i.test(input)) {  
    var quote = new sn_ws.RESTMessageV2();
    quote.setEndpoint('https://api.coindesk.com/v1/bpi/currentprice.json');
    quote.setHttpMethod('GET');

    var chatResponse = quote.execute();
    var chatResponseBody = JSON.parse(chatResponse.getBody());

    if (chatResponseBody && chatResponseBody.length > 0) {
        var bitcoinpriceFormatted = chatResponseBody.bpi.USD.rate;
        new x_snc_slackerbot.Slacker().send_chat(current, 'The current price of one bitcoin is: ' + bitcoinpriceFormatted + '$', false);
    }
}
