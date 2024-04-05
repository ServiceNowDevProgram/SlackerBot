/*
activation_example:!info-admin @Astrid Notes here
regex:^!info-admin\b
flags:gi
*/

if (current.channel == "GD51HTR46" || current.channel == "G9LAJG7G8" || current.channel == "G7M4AP6U8") { //admin channels on sndevs
  var message_body = '';
  var verification_status = false;

  // Grab user ID and then prep invocation if admin-visible info provided
  var invocation = current.text;
  var user_id = invocation.replace('!info-admin <@', '');
  user_id = user_id.replace(/>.*/, '').trim();
  invocation = invocation.replace('!info-admin <@' + user_id + '>','').trim();
  
  var grUser = new GlideRecord('x_snc_slackerbot_user');
  if(grUser.get('user_id',user_id) && Object.keys(grUser).indexOf('verified') != -1){
    if(invocation.length == 0){
      message_body += 'A message is required to update/replace the existing admin info. Call in format !info-admin @User Admin Note Here';
    } else {
      grUser.setValue('admin_info', invocation);
      grUser.update();
      message_body += 'Updated <@' + user_id + '>\'s admin info message.';
    }
    grUser.update();
  }
  else {
    message_body += 'I\'m afraid I can\'t do that. Either the user does not exist, or the logic to support this functionality is not yet on the instance.';
  }

  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message_body, true);
}
