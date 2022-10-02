/*
activation_example:!trout Helming
regex:(!trout)|(!slap) 
flags:gmi
*/

var term ='';
var msg = '';

if(current.text.indexOf('!trout') > -1){
    term = current.text.replace('!trout ', '');
} else{
    term = current.text.replace('!slap ', '');
}

msg = (term ? '<@'+current.user.user_id+'> slapped ' + term + ' with a large trout' : ':upside_down_face: !trout *something*');

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);
