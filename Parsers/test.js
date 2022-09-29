/*
activation_example:!clap your sentence
regex:!test
flags:gmi
*/
var sentence = current.text.replace(/!test/gmi, "").trim().toUpperCase();
if (sentence == '') {
	var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current, ':upside_down_face: gimme something to clap!', true);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, sentence.split(' ').join(' :clap: '), false);
}
