/*
activation_example:!verify-admin @Astrid
regex:^!verify-admin\b
flags:gi
*/

if (current.channel == "GD51HTR46" || current.channel == "G9LAJG7G8" || current.channel == "G7M4AP6U8") { //admin channels on sndevs
  var message_body = '';
  var verification_status = false;

  // Grab user ID and then prep invocation if User-visible info provided
  var invocation = current.text;
  var user_id = invocation.replace('!verify-admin <@', '');
  user_id = user_id.replace(/>.*/, '').trim();
  invocation = invocation.replace('!verify-admin <@' + user_id + '>','').trim();
  
  var grUser = new GlideRecord('x_snc_slackerbot_user');
  if(grUser.get('user_id',user_id) && Object.keys(grUser).indexOf('verified') != -1){
    if(invocation.length == 0){
      verification_status = !(grUser.getValue('verified') == 1 ? true : false); // Get verified and toggle
      grUser.setValue('verified',verification_status);
      message_body += 'Updated <@' + user_id + '>\'s verification status. They are now ' + (verification_status ? 'verified.' : 'unverified. To add a user-visible note instead of toggling verification, add text after `!verify-admin @User `. Example: `!verify-admin @Astrid Is upside down`');
    } else {
      grUser.setValue('user_info', invocation);
      grUser.update();
      message_body += 'Updated <@' + user_id + '>\'s user info message.';
    }
    grUser.update();
  }
  else {
    message_body += 'I\'m afraid I can\'t do that. Either the user does not exist, or the logic to support this functionality is not yet on the instance.';
  }

  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message_body, true);
}
