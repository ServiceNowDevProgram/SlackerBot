/*
activation_example:!dalle minty donut
regex:!dalle
flags:gmi
*/
var prompt = current.text.replace(/!dalle/gmi, "").trim().substring(0, 1000);
var rm = new sn_ws.RESTMessageV2();
rm.setEndpoint('https://api.openai.com/v1/images/generations');
rm.setHttpMethod("POST");
rm.setLogLevel("all");
var auth = "Bearer " + gs.getProperty("openai.key");
rm.setRequestHeader("Authorization", auth);
rm.setRequestHeader('Content-Type', "application/json");
rm.setRequestHeader('User-Agent', "ServiceNow");
rm.setRequestHeader("Accept", "*/*");
var body = {
	"prompt": prompt,
	"n": 1,
	"size": "512x512",
	"response_format": "url",
	"user": current.user.name.toString()
};
rm.setRequestBody(JSON.stringify(body));
var response = rm.execute();
var response_body = JSON.parse(response.getBody());
new x_snc_slackerbot.Slacker().send_chat(current, "<" + response_body.data[0].url + "|" + prompt + ">");
