/*
activation_example:!newdalle minty donut
regex:!newdalle
flags:gmi
*/
var prompt = current.text.replace(/!dalle/gmi, "").trim().substring(0, 1000);
var dalleReq = new sn_ws.RESTMessageV2();
dalleReq.setEndpoint('https://api.openai.com/v1/images/generations');
dalleReq.setHttpMethod("POST");
dalleReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("openai.key"));
dalleReq.setRequestHeader('Content-Type', "application/json");
dalleReq.setRequestHeader('User-Agent', "ServiceNow");
dalleReq.setRequestHeader("Accept", "*/*");
var body = {
	"prompt": prompt,
	"n": 1,
	"size": "512x512",
	"response_format": "url",
	"user": current.user.name.toString()
};
dalleReq.setRequestBody(JSON.stringify(body));
var dalleResponse = dalleReq.execute();
var dalleResponseBody = JSON.parse(dalleResponse.getBody());

//Cloudinary
var cloudinary = new sn_ws.RESTMessageV2();
cloudinary.setEndpoint('https://api.cloudinary.com/v1_1/dxllc568e/image/upload');
cloudinary.setHttpMethod('POST');
cloudinary.setRequestHeader('Content-Type', "application/json");
cloudinary.setRequestHeader('User-Agent', "ServiceNow");
cloudinary.setRequestHeader("Accept", "*/*");
var cloudinaryBody = {
	"file": dalleResponseBody.data[0].url,
	"upload_preset": gs.getProperty("cloudinary_upload_preset"), 
	"api_key": gs.getProperty("cloudinary_api_key"),
	"timestamp": Math.floor(new Date().getTime() / 1000),
};

cloudinary.setRequestBody(JSON.stringify(cloudinaryBody));

var cloudinaryResponse = cloudinary.execute();
var cloudinaryResponseBody = JSON.parse(cloudinaryResponse.getBody());
new x_snc_slackerbot.Slacker().send_chat(current, "<" + cloudinaryResponseBody.url + "|" + prompt + ">\n");
//new x_snc_slackerbot.Slacker().send_chat(current, "<" + cloudinaryResponseBody.url + "|" + prompt + "> (<" + "https://collection.cloudinary.com/dxllc568e/86896fd03420bdbdb47adcc037086bdf" + "|" + "gallery>)");
