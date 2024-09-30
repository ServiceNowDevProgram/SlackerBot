/*
activation_example:fact
regex:\bfact\b
flags:gi
*/

if (Math.floor(Math.random() * 4) == 0) {
    var fact = new sn_ws.RESTMessageV2();
    fact.setEndpoint('https://uselessfacts.jsph.pl/api/v2/facts/random/');
    fact.setHttpMethod("GET");
    var chatResponse = fact.execute();
    var chatResponseBody = JSON.parse(chatResponse.getBody());

    new x_snc_slackerbot.Slacker().send_chat(current, 'Another fact is: " + chatResponseBody.text, false);
    }
