/*
activation_example:!docs GlideRecord
regex:!docs
flags:gmi
*/

var where = current.text.indexOf('!docs ') + 6;
var term = current.text.substr(where).trim();
if (term == '') {
	var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current, ':upside_down_face: !docs *something*', false);
} else {
	var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, 'https://docs.servicenow.com/search?q=' + escape(term) + '&labels=2', false);
}
