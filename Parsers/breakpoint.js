/*
activation_example:!breakpoint
regex:!breakpoint
flags:gmi
*/
var message = 'devlink.sn/breakpoint';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);
