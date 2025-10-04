/*
activation_example:!music https://music.apple.com/us/song/inferna/1814573909
regex:!music
flags:gmi
*/

var input = current.text.trim();
var link = input.replace('!music ', '');
var tapeLinkObj = getTapeLink(link);
var msg;
if (tapeLinkObj.status == '200' && tapeLinkObj.body.success) {
    msg = `<https://${tapeLinkObj.body.shareableLink}|Stream this song on other platforms>`;
} else {
    msg = `Something went wrong. Please check that you entered a full link. Error details: ${tapeLinkObj.body.error}`;
}

gs.info(msg);

function getTapeLink(url) {

    try {
        var endpointURL = 'https://www.tapelink.io/api/generate-link';

        var request = new sn_ws.RESTMessageV2();
        request.setHttpMethod('post');
        request.setEndpoint(endpointURL);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        var payload = {
            "url": url
        };

        request.setRequestBody(JSON.stringify(payload));


        var response = request.execute();

        var httpStatus = response.getStatusCode();
        var responseBody = JSON.parse(response.getBody());

        return {
            body: responseBody,
            status: httpStatus
        };

    } catch (ex) {
        gs.error('An error occurred in the RESTMessageV2 script: ' + ex.getMessage());
    }
}