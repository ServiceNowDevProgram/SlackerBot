/*
activation_example:!shorts
regex:(!shorts)|(!youtubeshorts)
flags:gmi
*/
var message = '<https://www.youtube.com/watch?v=UNTYP-D94c0&list=PL3rNcyAiDYK2aHWbavFd7j2L7atc7c0vT&ab_channel=ServiceNowDevProgram|Check out these shorts>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);
