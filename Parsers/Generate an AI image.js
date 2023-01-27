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
	"size": "512x512",
	"response_format": "url",
	"user": current.user.name.toString()
};
dalleReq.setRequestBody(JSON.stringify(body));
var dalleResponse = dalleReq.execute();
var dalleResponseBody = JSON.parse(dalleResponse.getBody());

//Second RM to get the image into the sys_attachments table
var getImageReq = new sn_ws.RESTMessageV2();
getImageReq.setEndpoint(dalleResponseBody.data[0].url);
getImageReq.setHttpMethod("GET");

//Need to save the file to this parser as it's within scope
var dalleTable = 'x_snc_slackerbot_parser';
var parserLookup = new GlideRecord('x_snc_slackerbot_parser');
parserLookup.addQuery('regexLIKEdalle');
parserLookup.query();
parserLookup.next();
var dalleRecord = parserLookup.getValue('sys_id');

//Indicate we want to save the image to the parser record as `${prompt}.png`
getImageReq.saveResponseBodyAsAttachment(dalleTable, dalleRecord, (prompt.trim() + '.png'));

var getImageResponse = getImageReq.execute();

//Get the sys_id of the newly created attachment
var newAttachmentSysId = getImageResponse.getResponseAttachmentSysid();

//Lookup the attachment
var attachGr = new GlideRecord('sys_attachment');
attachGr.get(newAttachmentSysId);

//Get the base 64 from the image
var sysAtt = new GlideSysAttachment();
var b64 = sysAtt.getContentBase64(attachGr);

//Start the upload to Imgur
var imgurReq = new sn_ws.RESTMessageV2();
imgurReq.setEndpoint('https://api.imgur.com/3/image');
imgurReq.setHttpMethod('POST');
imgurReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("imgur.token"));
imgurReq.setRequestHeader('Content-Type', "application/json");
imgurReq.setRequestHeader('User-Agent', "ServiceNow");
imgurReq.setRequestHeader("Accept", "*/*");
var imgurBody = {
	"image": b64,
	"type": "base64",
	"title": (current.user.name.toString() + ' - ' + prompt),
	"description": "DALL-E generated image for the prompt '" + prompt + "'"
};
//Set the album, if it exists
if(gs.getProperty('imgur.album')) imgurBody.album = gs.getProperty('imgur.album');

imgurReq.setRequestBody(JSON.stringify(imgurBody));

var imgurResponse = imgurReq.execute();
var imgurResponseBody = JSON.parse(imgurResponse.getBody());

try{
	new x_snc_slackerbot.Slacker().send_chat(current, "<" + imgurResponseBody.data.link + "|" + prompt + ">\n");

	//Now that we're done, get rid of the attachment
	gs.eventQueue('x_snc_slackerbot.delete_attachment', attachGr, attachGr.sys_id);

} catch(em){
	new x_snc_slackerbot.Slacker().send_chat(current, "I'm finicky and decided to not work this time, try again.", true);
}
