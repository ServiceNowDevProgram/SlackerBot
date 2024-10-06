/*
activation_example:!dalle minty donut
regex:!dalle
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
    "size": "1024x1024",
    quality: "standard",
    model: "dall-e-3",
    "response_format": "url",
    "user": current.user.name.toString()
};
dalleReq.setRequestBody(JSON.stringify(body));
var dalleResponse = dalleReq.execute();
var dalleResponseStatusCode = dalleResponse.getStatusCode();
var dalleResponseBody = JSON.parse(dalleResponse.getBody());
var failureMessage = "Image Generation failed. If this is your first error please try again, otherwise contact an admin";

if (dalleResponseStatusCode != 200) {
    new x_snc_slackerbot.Slacker().send_chat(current, failureMessage);
    if (gs.getProperty("generateaiimage.debug.enable", "true") == "true") {
        gs.error("Error: " + dalleResponseStatusCode + " \n" + dalleResponseBody.error.message + "\n" + "Prompt: " + prompt);
    }

} else {
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

    if (cloudinaryResponseBody.url) {
        new x_snc_slackerbot.Slacker().send_chat(current, "<" + cloudinaryResponseBody.url + "|" + prompt + ">\n");
    } else {
        new x_snc_slackerbot.Slacker().send_chat(current, failureMessage);
    }
}
