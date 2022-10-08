/*
activation_example:!ctb
regex:(!ctb)||(!creatortoolbox)||(!toolbox) 
flags:gmi
*/
var sentence = current.text;


var message = '<https://www.youtube.com/watch?v=fDvEqAQIHzQ&list=PL3rNcyAiDYK08_Xjuvu6IFEK8pqFT99WQ>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, true);
