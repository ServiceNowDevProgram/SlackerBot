/*
activation_example:!dad
regex:!dad
flags:gmi
*/

var prompt = current.text.replace(/!dad/gmi, "").trim().substring(0, 1000);
var dadJoke = new sn_ws.RESTMessageV2();
dadJoke.setEndpoint('https://icanhazdadjoke.com/');
dadJoke.setHttpMethod("GET");
dadJoke.setRequestHeader("Accept","text/plain");
var chatResponse = dadJoke.execute();
var chatResponseBody = chatResponse.getBody();

new x_snc_slackerbot.Slacker().send_chat(current, chatResponseBody, false);
