/*
activation_example:!nextcoe
regex:(!nextcoe)|(!nextexperience) 
flags:gmi
*/

var t = current.text;

var message = '<nxtxp.link/coe|Next Experience Center of Excellence>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);

