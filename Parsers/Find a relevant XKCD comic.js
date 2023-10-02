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

var search = gs.urlEncode(current.text.replace(/!xkcd/g, '').trim());

var rm = new sn_ws.RESTMessageV2();
rm.setHttpMethod('GET');
rm.setEndpoint('https://www.explainxkcd.com/wiki/index.php?&title=Special%3ASearch&go=Go&fulltext=1&search=' + search);
rm.setRequestHeader('User-Agent', 'servicenow');
var response = rm.execute();
var body = response.getBody();

var msg;

// Check if we got an empty search result, as the result regex will match the page even if no result
var checkResponse = body.match(/<p class="mw-search-nonefound">/g);
if (checkResponse === null){
	var result = body.match(/(?:<a href="\/wiki\/index.php\/)[0-9]+/gm)[0].replace(/<a href="\/wiki\/index.php\//g, '');
	if (parseInt(result)) {
		var rm2 = new sn_ws.RESTMessageV2();
		rm2.setHttpMethod('GET');
		rm2.setEndpoint('https://xkcd.com/' + result + '/info.0.json');
		rm2.setRequestHeader('User-Agent', 'servicenow');
		var response2 = rm2.execute();
		var body2 = JSON.parse(response2.getBody());

		msg = buildComicOutput(body2);
	} else {
    msg = 'No relevant XKCD found for `' + search + '`';
	}
}
else {
	msg = 'No relevant XKCD found for `' + search + '`';
}

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);
