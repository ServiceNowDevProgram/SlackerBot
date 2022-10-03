/*
activation_example:!lmgtfy or !google search term 
regex:!lmgtfy
flags:gmi
*/

var where = 0;
var which = '';

if (current.text.indexOf('!lmgtfy') > -1) {

    where = current.text.indexOf('!lmgtfy') + 8;
    which = 'lmgtfy';


} else if (current.text.indexOf('!google') > -1) {
    where = current.text.indexOf('!google') + 8;
    which = 'google';
}

var term = current.text.substr(where).trim();

if (term == '') {
    var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current.channel, ':upside_down_face: !docs *something*', false, '', current.thread_ts);

}
if (which == 'lmgtfy')

{
    var send_lmgtfy = new x_snc_slackerbot.Slacker().send_chat(current, 'http://lmgtfy.com/?q=' + escape(term), false, '', current.thread_ts);
	
} else if (which == 'google') {
	
    var send_google = new x_snc_slackerbot.Slacker().send_chat(current, 'https://www.google.com/search?q=' + escape(term), false, '', current.thread_ts);
}
