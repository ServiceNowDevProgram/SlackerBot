/*
activation_example:!snbooks
regex:^!snbooks
flags:gmi
*/

(function(){

  var strMessage = 'Take a look at `https://www.amazon.com/s?k=servicenow` for all ServiceNow related books on Amazon.'
  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, strMessage, false);

})();
