/*
activation_example:!huh need more info
regex:!huh
flags:gmi
order:200
stop_processing:false
*/


new x_snc_slackerbot.Slacker().send_chat(current, 'https://i.imgflip.com/6vvasp.jpg?' + new GlideDateTime().getNumericValue(), true)
//a time signature is added to the URL so that Slack interprets each picture as a different picture (repeated pictures don't unfurl)
