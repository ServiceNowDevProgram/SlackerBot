/*
activation_example:!music https://music.apple.com/us/song/inferna/1814573909
regex:^!music
flags:gmi
*/

function getTapeLink(url) {

    try {
        const endpointURL = 'https://www.tapelink.io/api/generate-link';
        const request = new sn_ws.RESTMessageV2();
        request.setHttpMethod('post');
        request.setEndpoint(endpointURL);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        const payload = {
            'url': url
        };
        request.setRequestBody(JSON.stringify(payload));
        const response = request.execute();

        const httpStatus = response.getStatusCode();
        const responseBody = JSON.parse(response.getBody());

        return {
            body: responseBody,
            status: httpStatus
        };
    } catch (ex) {
        gs.error(`An error occurred in the RESTMessageV2 script: ${ex.getMessage()}`);
    }
}

const slacker = new x_snc_slackerbot.Slacker();
let input = current.text.trim();
let link = input.replace('!music ', '');
const tapeLinkObj = getTapeLink(link);
let msg = '';
if (tapeLinkObj.status == '200' && tapeLinkObj.body.success) {
    msg = `<https://${tapeLinkObj.body.shareableLink}|Stream this song on other platforms>`;
} else {
    msg = `Something went wrong. Please check that you entered a full link. Error details: ${tapeLinkObj.body.error}`;
}

slacker.send_chat(current, msg, false);
