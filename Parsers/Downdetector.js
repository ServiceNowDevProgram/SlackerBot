/*
activation_example:!downdetector service-name
regex:!downdetector
flags:gmi
*/
var service = current.text.replace(/!downdetector/gmi, "").trim().toLowerCase();
if (sentence == '') {
	var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current.channel, ':upside_down_face: No service name given! Try with services like "google", "aws", etc.', false, '', current.thread_ts);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, "https://downdetector.com/search/?q="+ service.toString(), current.thread_ts);
}
