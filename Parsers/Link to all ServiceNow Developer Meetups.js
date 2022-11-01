/*
activation_example:!devmeetups
regex:^!devmeetups
flags:gmi
*/

(function(){

  var strMessage = 'Checkout `https://devlink.sn/meetups` for all upcoming ServiceNow Developer meetup events in and around your area.'
  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, strMessage, false);

})();
