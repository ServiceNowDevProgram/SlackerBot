/*
activation_example:!lchh
regex:(!lchh)|(!livecodinghappyhour)|(!happyhour) 
flags:gmi
*/

var t = current.text;

if((t.indexOf('!lchh') > -1) || t.indexOf('!livecodinghappyhour') > -1 || t.indexOf(!'happyhour') > -1)){

var message = '<https://www.youtube.com/watch?v=EzE_JLPwCy8&list=PL3rNcyAiDYK3YiwkTj8OUSs_FRz-YSIw2&ab_channel=ServiceNowDevProgram|LCHH>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);

}
