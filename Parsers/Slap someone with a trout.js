/*
activation_example:!trout @username
regex:(!trout)|(!slap) 
flags:gmi
*/

//Determine which input was used
var troutFlag = (current.text.indexOf('!trout') > -1);

//Try to find term from input
var term = current.text.replace((troutFlag ? '!trout' : '!slap'), '').trim();

//Determine message to send
var msg = (term ? '<@'+current.user.user_id+'> slapped ' + term + ' with a large trout' : ':upside_down_face: ' + (troutFlag ? '!trout' : '!slap') + ' *something*');

//Send Slack message
var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);