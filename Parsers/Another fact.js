/*
activation_example:fact
regex:fact
flags:gmi
*/

var fact = new sn_ws.RESTMessageV2();
fact.setEndpoint('https://uselessfacts.jsph.pl/api/v2/facts/random/');
fact.setHttpMethod("GET");
var chatResponse = fact.execute();
var chatResponseBody = JSON.parse(chatResponse.getBody());

new x_snc_slackerbot.Slacker().send_chat(current, 'Another fact is: " + chatResponseBody.text, false);
