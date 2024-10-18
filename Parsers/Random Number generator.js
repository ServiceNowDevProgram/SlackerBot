/*
activation_example:!random 1 10
regex:!random (\d+) (\d+)
flags:gmi
order:100
stop_processing:false
active:true
*/

var matches = current.text.match(/!random (\d+) (\d+)/);
if (matches) {
    var min = parseInt(matches[1], 10);
    var max = parseInt(matches[2], 10);
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    new x_snc_slackerbot.Slacker().send_chat(current, `Random number between ${min} and ${max}: ${randomNumber}`, false);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !random [min] [max]', true);
}
