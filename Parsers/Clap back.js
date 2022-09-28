/*
activation_example:!clap your sentence
regex:!clap
flags:gmi
*/
var sentence = current.text.replace(/!clap/gmi, "").trim().toUpperCase();
if (sentence == '') {
	var send_confusion = new SlackFall().send_chat(current.channel, ':upside_down_face: gimme something to clap!', false, '', current.thread_ts);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, sentence.split(' ').join(' :clap: '), current.thread_ts);
}
