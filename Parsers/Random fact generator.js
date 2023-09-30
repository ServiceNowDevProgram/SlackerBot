/*
activation_example:!fact
regex:!fact
flags:gmi
*/
var prompt = current.text.replace(/!chatgpt/gmi, "").trim().substring(0, 1000);
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint('http://numbersapi.com/random');
chatReq.setHttpMethod("GET");
var chatResponse = chatReq.execute();
var chatResponseBody =chatResponse.getBody();

new x_snc_slackerbot.Slacker().send_chat(current, chatResponseBody, false);
