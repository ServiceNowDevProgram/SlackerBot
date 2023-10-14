/*
activation_example:!apod, or !apod -r to get a random result
regex:!apod(\s-r)?
flags:gmi
*/

// Set a System Property named 'nasaapi.key' to leverage a free dedicated API key (get one here https://api.nasa.gov/) 
// DEMO_KEY rate limit is (default) of 30/hr, with 50/day
// API Key rate limist is (default) 1000/hr
var apiKey = gs.getProperty('nasaapi.key', 'DEMO_KEY');

var isRandom = (current.text.match(/!apod\s-r/gmi) !== null);
var endpoint = isRandom ? 'https://api.nasa.gov/planetary/apod?count=1&thumbs=True&api_key=' + apiKey : 'https://api.nasa.gov/planetary/apod?thumbs=True&api_key=' + apiKey;

// Perform image call
var picReq = new sn_ws.RESTMessageV2();
picReq.setEndpoint(endpoint);
picReq.setHttpMethod('GET');
picReq.setRequestHeader('User-Agent', 'ServiceNow');
var picResp = picReq.execute();

// Process output
var output = handleAPI(picResp, isRandom);
var message = buildBlocks(output);

// Send to Slack
new x_snc_slackerbot.Slacker().send_chat(current, message, true);

// Function declarations

function handleAPI(response, random) {
    var out = {};
    out.payload = {};

    // Check negative paths - rate limit or error
    if (response.getStatusCode() == 429) {
        out.success = false;
        out.type = 'reached the API rate limit';
        out.message = 'Your token has encountered the API limit, which is currently set to ' + picResp.getHeader('X-Ratelimit-Limit') + '. If you have not yet added a NASA API key, consider adding this to get a higher limit.';
    } else if (response.getStatusCode() != 200) {
        out.success = false;
        out.type = 'encountered an unexpected response';
        out.message = 'Please try again later. Response status code: ' + response.getStatusCode();
    } else if (response.getErrorCode() != 0) {
        out.success = false;
        out.type = 'encountered unexpected behaviour';
        out.message = 'Please try again later. Error message: ' + response.getErrorMessage();
    } else {
        // Positive path
        var body = JSON.parse(response.getBody());
        if (random) { // Returns array
            body = body[0];
        }
        out.payload.date = body.date;
        out.payload.title = body.title;
        out.payload.copyright = (body.copyright !== undefined) ? body.copyright : null;
        out.payload.type = body.media_type;
        out.payload.thumb = (body.thumbnail_url !== undefined) ? body.thumbnail_url : null;
        out.payload.content = body.url;
        out.payload.image_fullres = body.hdurl;
        out.success = true;
        out.type = random ? 'random' : 'latest';
        out.message = body.explanation;
    }
    return out;
}

function buildBlocks(details) {
    var blockArr = [];
    if (!details.success) {
        blockArr.push({
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '!apod: Unfortunately, this parser ' + details.type + ' :service_no:. ' + details.message
            }
        });
    } else {
        blockArr.push({
            'type': 'header',
            'text': {
                'type': 'plain_text',
                'text': 'Astronomy Picture of the Day: ' + details.payload.title
            }
        });

        blockArr.push({
            'type': 'context',
            'elements': [
                {
                    'type': 'mrkdwn',
                    'text': '*Date:* ' + details.payload.date
                }
            ]
        });

        if (details.payload.image_fullres !== undefined) {
            blockArr.push({
                'type': 'context',
                'elements': [
                    {
                        'type': 'mrkdwn',
                        'text': '*HD Url:* <' + details.payload.image_fullres + '|Image>'
                    }
                ]
            });
        }

        if (details.payload.copyright !== null) {
            blockArr.push({
                'type': 'context',
                'elements': [
                    {
                        'type': 'mrkdwn',
                        'text': '*Copyright:* ' + details.payload.copyright
                    }
                ]
            });
        }

        if (details.payload.type == 'image') {
            blockArr.push({
                'type': 'image',
                'title': {
                    'type': 'plain_text',
                    'text': details.payload.title
                },
                'image_url': details.payload.content,
                'alt_text': details.payload.title
            });
        } else {
            blockArr.push({
                'type': 'video',
                'title': {
                    'type': 'plain_text',
                    'text': details.payload.title,
                    'emoji': true
                },
                'title_url': details.payload.content,
                'description': {
                    'type': 'plain_text',
                    'text': 'NASA Astronomy Picture of the Day: Video',
                    'emoji': true
                },
                'video_url': details.payload.content,
                'alt_text': details.payload.title,
                'thumbnail_url': details.payload.thumb,
                'provider_name': 'NASA',
                'provider_icon_url': 'https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg'
            });
        }

        blockArr.push({
            'type': 'context',
            'elements': [
                {
                    'type': 'mrkdwn',
                    'text': '*Explanation:* ' + details.message
                }
            ]
        });
    }

    return {
        'text': 'NASA Astronomy Picture of the Day',
        'blocks': blockArr
    };
}
