/*
activation_example:!spongebob your sentence
regex:!spongebob
flags:gmi
*/

var text = current.text.replace(/!spongebob/gmi, "").trim();
var newText = text.split('').map(function(e) {
    return Math.floor(Math.random() * 2) ? e.toUpperCase() : e.toLowerCase();
}).join('').replaceAll('I','i').replaceAll('l','L');
new x_snc_slackerbot.Slacker().send_chat(current, newText);
