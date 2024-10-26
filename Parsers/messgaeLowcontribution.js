/*
activation_example:!newmessage
regex:!newmessage
flags:gmi
*/
var message = '*newmessage*: This is your low contribution in slackerbot repo, it will be enough for consideration'
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, true);
