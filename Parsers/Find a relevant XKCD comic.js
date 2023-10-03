/*
activation_example:!xkcd wisdom of the ancients
regex:!xkcd
flags:g
*/

function buildComicOutput(xkcdPayload, foundComic) {
    var blockArr = [];
    var block = {};
	if(!foundComic) { //if search didn't find a relevant comic add a message that this is a random one.
 		block = {};
     	block.type = "section";
 	    block.text = {};
     	block.text.type = "plain_text";
     	block.text.text = 'No relevant XKCD found, here is a random one';
     	blockArr.push(block);
 	}
 	block = {};
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

function getComic(endpoint) {
	var rm = new sn_ws.RESTMessageV2();
	rm.setHttpMethod('GET');
	rm.setEndpoint(endpoint);
	rm.setRequestHeader('User-Agent', 'servicenow');
	var response = rm.execute();
	var body = response.getBody();
	// Check if we got an empty search result, as the result regex will match the page even if no result
	var checkResponse = body.match(/<p class="mw-search-nonefound">/g);
	if (checkResponse === null) {
		var result = body.match(/(?:<a href="\/wiki\/index.php\/)[0-9]+(?!" class="mw-redirect")/gm)[0].replace(/<a href="\/wiki\/index.php\//g, '');
		if (parseInt(result)) {
			var rm2 = new sn_ws.RESTMessageV2();
			rm2.setHttpMethod('GET');
			rm2.setEndpoint('https://xkcd.com/' + result + '/info.0.json');
			rm2.setRequestHeader('User-Agent', 'servicenow');
			var response2 = rm2.execute();
			var body2 = JSON.parse(response2.getBody());
			return body2;
		} else {
			return false;
		}
	}
}

var terms = current.text.replace(/!xkcd/g, '').trim();
var search = gs.urlEncode(terms);
var endpoint;
if (terms === '-random' || terms === '') {
	endpoint = 'https://www.explainxkcd.com/wiki/index.php/Special:Random';
} else {
	endpoint = 'https://www.explainxkcd.com/wiki/index.php?&title=Special%3ASearch&go=Go&fulltext=1&search=' + search;
}
var foundComic = true;
var comic = getComic(endpoint);
if (comic = false){
	foundComic = false;
	endpoint = 'https://www.explainxkcd.com/wiki/index.php/Special:Random';
	comic = getComic(endpoint);
}
buildComicOutput(comic, foundComic);

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);
