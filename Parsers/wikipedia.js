/*
activation_example:!wiki ServiceNow
regex:!wiki
flags:gmi
*/

var term = /(?:!wiki )(.*)/gmi.exec(current.text);
//gs.info("WIKI: " + term);

if (term == null) {
	var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current, ':upside_down_face: !wiki *something*', false);
} else {
	var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, 'https://en.wikipedia.org/w/index.php?title=Special%3ASearch&search=' + escape(term[1]) , false);
}
