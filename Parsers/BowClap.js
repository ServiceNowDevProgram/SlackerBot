/*
activation_example:!clap your sentence
regex:!clap
flags:gmi
order:200
stop_processing:false
*/

var sentence = current.text.replace(/!clap/gmi, "").trim().toUpperCase();
if (sentence == '') {
	new x_snc_slackerbot.Slacker().send_chat(current, ':upside_down_face: gimme something to clap!', true);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, sentence.split(' ').join(' :clap: '), false);
}
