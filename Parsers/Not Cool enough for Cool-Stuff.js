/*
emoji:passport_control
*/

var message = []; //Array of potential messages to respond with
message.push("Is this really cool enough for #cool-stuff?");
message.push("Automated coolness check has has encountered warmth... This post may belong elsewhere.");
message.push("Not cool...");
message.push("As a bot I am unsure if this isn't cool or isn't stuff. Either way it may not belong here.");

//Select one at random.
var randomIndex = Math.floor(Math.random() * message.length);

if (current.channel == "C31K05PHQ") { //#cool-stuff on SNDevs
    new x_snc_slackerbot.Slacker().send_chat(current, message[randomIndex], true);
}
