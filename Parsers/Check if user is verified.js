/*
activation_example:!verify @Astrid - Admin-validated users
regex:^!verify$|!verify[^-]
flags:gi
*/

var message_body = '';
var verification_status = '';
var user_info = '';
var user_id = current.text.replace('!verify <@', '');
user_id = user_id.replace(/>.*/, '').trim();

var grUser = new GlideRecord('x_snc_slackerbot_user');
if(grUser.get('user_id',user_id) && Object.keys(grUser).indexOf('verified') != -1){
    verification_status = (grUser.getValue('verified') == 1 ? true : false) ? '*has been verified* and confirmed by the Slack admins.' : '*has not been verified* and confirmed by the Slack admins.';
    user_info = grUser.getValue('user_info') !== null ? grUser.getValue('user_info').toString() : '';

    message_body += '' + grUser.getValue('name') + '\'s identity '+ verification_status;
    if(!gs.nil(user_info)) message_body += '\n\nThe following information has been noted about this user:\n\n> ' + user_info;
}
else {
  message_body += 'I\'m afraid I can\'t do that. Either the user does not exist, or the logic to support this functionality is not yet on the instance.';
}

var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message_body, true);
