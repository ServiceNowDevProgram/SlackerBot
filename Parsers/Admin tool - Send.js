/*
activation_example:!send !random !hey
regex:!send !.+!.+
flags:gi
*/
var channels = current.channel;
if (channels == "GD51HTR46" || channels == "G9LAJG7G8" || channels == "G7M4AP6U8") { //admin channels on sndevs
  var parsing = current.text.split('!');
  var channel = parsing[2].trim();
  var build_message = parsing;
  build_message.shift();
  build_message.shift();
  build_message.shift();
  var message = build_message.join('!');
  var send_chat = new x_snc_slackerbot.Slacker().send_chat({'channel':channel}, message);
}
