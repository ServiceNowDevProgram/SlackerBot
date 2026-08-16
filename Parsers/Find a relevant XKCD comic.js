/*
activation_example:!xkcd wisdom of the ancients
regex:!xkcd
flags:g
*/

function buildComicOutput(xkcdPayload, comicFound, additionalComics) {
	var blockArr = [];

	if (!comicFound) {
		blockArr.push({
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": gs.getMessage("No relevant XKCD found, here is a random one")
			}
		});
	}

	blockArr.push({
		"type": "header",
		"text": {
			"type": "plain_text",
			"text": xkcdPayload.safe_title + ""
		}
	});

	blockArr.push({
		"type": "image",
		"image_url": xkcdPayload.img,
		"alt_text": xkcdPayload.alt
	});

	blockArr.push({
		"type": "context",
		"elements": [
			{
				"type": "mrkdwn",
				"text": "*Alt-text:* " + xkcdPayload.alt
			}
		]
	});
	
if (additionalComics && additionalComics.length > 1) {
    var msgArr = [];
    for (var i = 0; i < additionalComics.length; i++) {
        if (parseInt(additionalComics[i].id, 10) !== xkcdPayload.num) {
            msgArr.push(
                "- #" +
                additionalComics[i].id +
                " - " +
                additionalComics[i].title
            );

            if (msgArr.length >= 3) {
                break;
            }
        }
    }

    if (msgArr.length > 0) {
        blockArr.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text":
                        "*Other matching comics:*\n" +
                        msgArr.join("\n")
                }
            ]
        });
    }
}

	return {
		"text": xkcdPayload.safe_title,
		"blocks": blockArr
	};

}

// if no parameters, display latest
// if number, display that number if valid otherwise random
// if -random then find a random
// anything else, do a search and return one of the search results

var terms = current.text.replace(/!xkcd/g, '').trim();
var comicNumProvided = /^-?\d+$/.test(terms);
var endPoint = 'https://xkcd.com/info.0.json';
var comicFound = (terms == "");
var msg;
var comicNumbers = [];

// we need the number of comics to be able to handle random, number, and negative path
var restMsg = new sn_ws.RESTMessageV2();
restMsg.setHttpMethod('GET');
restMsg.setEndpoint(endPoint);
restMsg.setRequestHeader('User-Agent', 'servicenow');
var response = restMsg.execute();
var jsonBody = JSON.parse(response.getBody());

if (terms != "" && (terms == "-random" || comicNumProvided)) {
	if (comicNumProvided && parseInt(terms) > 0 && parseInt(terms) <= jsonBody.num) {
		// a comic number was provided and it's within the range of available comics
		endPoint = "https://xkcd.com/" + terms + "/info.0.json";
		comicFound = true;
	} else {
		// otherwise just work out 
		var randomComic = Math.floor(Math.random() * parseInt(jsonBody.num)) + 1;
		endPoint = "https://xkcd.com/" + randomComic + "/info.0.json";
		comicFound = !comicNumProvided; // set comic found to true only if a random one was selected on purpose
	}
} else if (terms != "") {

    var searchEndPoint =
        "https://qtg5aekc2iosjh93p.a1.typesense.net" +
        "/collections/xkcd/documents/search" +
        "?q=" + encodeURIComponent(terms) +
        "&query_by=title,altTitle,transcript,topics" +
        "&query_by_weights=127,80,80,1" +
        "&num_typos=1" +
        "&exclude_fields=embedding";

    var searchMsg = new sn_ws.RESTMessageV2();
    searchMsg.setHttpMethod('GET');
    searchMsg.setEndpoint(searchEndPoint);

	// this is a public key, not specific to us.
    searchMsg.setRequestHeader(
        'X-TYPESENSE-API-KEY',
        '8hLCPSQTYcBuK29zY5q6Xhin7ONxHy99'
    );

    response = searchMsg.execute();

    if (response.getStatusCode() == 200) {

        var searchResults = JSON.parse(response.getBody());
        comicNumbers = [];

        if (searchResults.hits) {
            for (var i = 0; i < Math.min(searchResults.hits.length, 10); i++) {
                comicNumbers.push({
				    id: searchResults.hits[i].document.id,
				    title: searchResults.hits[i].document.title
				});
            }
        }

        if (comicNumbers.length > 0) {

            // Use the highest ranked result instead of random
            endPoint =
                "https://xkcd.com/" +
                comicNumbers[0].id +
                "/info.0.json";

            comicFound = true;

        } else {

            var randomComic = Math.floor(Math.random() * parseInt(jsonBody.num)) + 1;

            endPoint =
                "https://xkcd.com/" +
                randomComic +
                "/info.0.json";
        }
    }
}

var comicDataMsg = new sn_ws.RESTMessageV2();
comicDataMsg.setHttpMethod('GET');
comicDataMsg.setEndpoint(endPoint);
comicDataMsg.setRequestHeader('User-Agent', 'servicenow');
response = comicDataMsg.execute();
var body = JSON.parse(response.getBody());

if(comicNumbers.length > 1){
	msg = buildComicOutput(body, comicFound, comicNumbers);
} else {
	msg = buildComicOutput(body, comicFound, null);
}

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);
