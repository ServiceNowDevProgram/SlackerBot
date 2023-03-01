/*
activation_example:!lchh
regex:(!lchh)|(!livecodinghappyhour)|(!happyhour) 
flags:gmi
*/

var t = current.text;

var message = '<https://www.youtube.com/playlist?list=PL3rNcyAiDYK3YiwkTj8OUSs_FRz-YSIw2|LCHH>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);
