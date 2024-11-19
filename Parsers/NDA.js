/*
activation_example:!nda
regex:(!nda|!confidential)
flags:gmi
*/

//Provides a response to the strings that will cause the `Summarize the thread so far` parser to not produce a summary.

var message = []; //Array of potential messages to respond with
message.push(":zipper_mouth_face:");
message.push(":shushing_face:");
message.push("I got you :fingerguns:");
message.push("Lips are sealed");
message.push(":spill-the-tea:");
message.push(":popcorn2:");
message.push(":speak_no_evil:");
message.push("Request for confidentiality acknowledged. Use of !summary, !catchmeup, and !catchup have been disabled.");


//Select one at random.
var randomIndex = Math.floor(Math.random() * message.length);

new x_snc_slackerbot.Slacker().send_chat(current, message[randomIndex], true);
