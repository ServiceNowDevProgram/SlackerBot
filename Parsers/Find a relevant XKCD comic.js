/*
activation_example:!xkcd wisdom of the ancients
regex:!xkcd
flags:g
*/

function buildComicOutput(xkcdPayload, comicFound) {
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
				"text": "*Alt-text:* " + xkcdPayload.alt + "\n*Link:* https://xkcd.com/" + xkcdPayload.num + "/"
			}
		]
	})

	return {
		"text": xkcdPayload.safe_title,
		"blocks": blockArr
	};

}

function getComicNumbers(body) {
	var regex = /title="([0-9]+): .+"/gm;
	var matches;
	var comicNumbers = []; // store the search results, just the comic number
	while ((matches = regex.exec(body)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (matches.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// push the actual match to the array
		comicNumbers.push(matches[1]);
	}

	return comicNumbers;
}

// if no parameters, display latest
// if number, display that number if valid otherwise random
// if -random then find a random
// anything else, do a search and return one of the search results

var terms = current.text.replace(/!xkcd/g, '').trim();
var comicNumProvided = /^-?\d+$/.test(terms);
var endPoint = 'https://xkcd.com/info.0.json';
var comicFound = (terms == "");

if (terms != "" && (terms == "-random" || comicNumProvided)) {
	// random or a number specified, so we need the number of comics to be able to check either
	var restMsg = new sn_ws.RESTMessageV2();
	restMsg.setHttpMethod('GET');
	restMsg.setEndpoint(endPoint);
	restMsg.setRequestHeader('User-Agent', 'servicenow');
	var response = restMsg.execute();
	var jsonBody = JSON.parse(response.getBody());

	if (comicNumProvided && parseInt(terms) <= jsonBody.num) {
		// a comic number was provided and it's within the range of available comics
		endPoint = "https://xkcd.com/" + terms + "/info.0.json";
		comicFound = true;
	} else {
		// otherwise just work out 
		var randomComic = Math.floor(Math.random() * parseInt(jsonBody.num));
		endPoint = "https://xkcd.com/" + randomComic + "/info.0.json";
		comicFound = !comicNumProvided; // set comic found to true only if a random one was selected on purpose
	}
} else if (terms != "") {
	// assume it's a search, so use the search facility of explainxkcd
	// the search results don't give us an indication of relevance, so to clean the results
	// up we'll remove punctuation and insignificant words
	var littleWords = ['of', 'the', "in", "on", "at", "to", "a", "is"];
	terms = terms.split(' ')
		.filter(function (_x) {
			return _x != '' && littleWords.indexOf(_x.toLowerCase()) == -1;
		})
		.join('+');

	var searchEndPoint = "https://www.explainxkcd.com/wiki/index.php?search=" + terms + "&title=Special%3ASearch&profile=default&fulltext=1";
	var searchMsg = new sn_ws.RESTMessageV2();
	searchMsg.setHttpMethod('GET');
	searchMsg.setEndpoint(searchEndPoint);
	searchMsg.setRequestHeader('User-Agent', 'servicenow');
	var response = searchMsg.execute();
	var body = response.getBody();

	// search the body in two passes, first the section that contains the page title matches
	// if nothing found there, we'll search the page text section which is a search of body text
	var pageTitleBody = body.substr(0, body.indexOf('Page text matches'));
	var pageTextBody = body.substr(body.indexOf('Page text matches'));
	var comicNumbers = getComicNumbers(pageTitleBody);
	comicNumbers = comicNumbers.length > 0 ? comicNumbers : getComicNumbers(pageTextBody);

	if (comicNumbers.length > 0) {
		// we have some comics so get a random one
		var randomComic = Math.floor(Math.random() * comicNumbers.length);
		endPoint = "https://xkcd.com/" + comicNumbers[randomComic] + "/info.0.json";
		comicFound = true;
	}
}

var comicDataMsg = new sn_ws.RESTMessageV2();
comicDataMsg.setHttpMethod('GET');
comicDataMsg.setEndpoint(endPoint);
comicDataMsg.setRequestHeader('User-Agent', 'servicenow');
var response = comicDataMsg.execute();
var body = JSON.parse(response.getBody());

var msg = buildComicOutput(body, comicFound)

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);
