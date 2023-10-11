/*
activation_example:I am excited, I'm excited, or so excited
regex:(I am excited|I'?m excited|so excited)
flags:gmi
order:200
stop_processing:false
*/

var message = []; //Array of potential messages to respond with
message.push("Not my problem");
message.push("What should I do?");
message.push("Should I call a doctor?");
message.push("As a bot I am unsure what to reply");

//Select one at random.
var randomIndex = Math.floor(Math.random() * message.length);
new x_snc_slackerbot.Slacker().send_chat(current, message[randomIndex], true);
