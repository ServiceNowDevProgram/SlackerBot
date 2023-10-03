/*
activation_example:!xkcd wisdom of the ancients
regex:!xkcd
flags:g
*/

function buildComicOutput(xkcdPayload) {
    var blockArr = [];
    var block = {};
    block.type = "header";
    block.text = {};
    block.text.type = "plain_text";
    block.text.text = xkcdPayload.safe_title + "";
    blockArr.push(block);

    block = {};
    block.type = "image";
    block.image_url = xkcdPayload.img + "";
    block.alt_text = xkcdPayload.alt + "";
    blockArr.push(block);

    block = {};
    block.type = "context";
    block.elements = [];
    var contextElement = {};
    contextElement.type = "mrkdwn";
    contextElement.text = "*Alt-text:* " + xkcdPayload.alt + "\n"; 
	contextElement.text += "*Link:* https://xkcd.com/" + xkcdPayload.num + "/";
	
    block.elements.push(contextElement);
    blockArr.push(block);

    block = {};
    block.text = xkcdPayload.safe_title + "";
    block.blocks = blockArr;

    return block;
}

// if no parameters, display latest
// if number, display that number if valid otherwise random
// if -random then find a random
// anything else, do a search and find first match

var terms = current.text.replace(/!xkcd/g, '').trim();
var comicNumProvided = /^-?\d+$/.test(terms);
var endPoint = 'https://xkcd.com/info.0.json';
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
    } else {
        // otherwise just work out 
        var randomComic = Math.floor(Math.random() * parseInt(jsonBody.num));
        endPoint = "https://xkcd.com/" + randomComic + "/info.0.json";
    }
} else if (terms != "") {
    // assume it's a search, so use the search facility of 
    var regex = /title="([0-9]+): [\w\s]+"/gm;
    var searchEndPoint = "https://www.explainxkcd.com/wiki/index.php?search=" + terms;
    var searchMsg = new sn_ws.RESTMessageV2();
    searchMsg.setHttpMethod('GET');
    searchMsg.setEndpoint(searchEndPoint);
    searchMsg.setRequestHeader('User-Agent', 'servicenow');
    var response = searchMsg.execute();

    var matches;
    var comicNumbers = []; // store the search results, just the cominc number
    while ((matches = regex.exec(response.getBody())) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (matches.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // push the actual match to the array
        comicNumbers.push(matches[1]);
    }
    
    if (comicNumbers.length > 0) {
        // we have some comics so get a random one
        var randomComic = Math.floor(Math.random() * comicNumbers.length);
        endPoint = "https://xkcd.com/" + comicNumbers[randomComic] + "/info.0.json";
    }
}

var comicDataMsg = new sn_ws.RESTMessageV2();
comicDataMsg.setHttpMethod('GET');
comicDataMsg.setEndpoint(endPoint);
comicDataMsg.setRequestHeader('User-Agent', 'servicenow');
var comicResponse = comicDataMsg.execute();
var body = JSON.parse(comicResponse.getBody());

var msg = buildComicOutput(body);

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);
