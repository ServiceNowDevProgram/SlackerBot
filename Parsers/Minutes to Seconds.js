/*
activation_example:!minutes-to-seconds 5
regex:!minutes-to-seconds
flags:gmi
order:200
stop_processing:false
*/

var number = current.text.replace(/!minutes-to-seconds/gmi, "").trim();
if (number == '') {
    new x_snc_slackerbot.Slacker().send_chat(current, ':clock1: : :question:', true);
} else {
    var minutes = parseFloat(number);
    if (isNaN(minutes)) {
        new x_snc_slackerbot.Slacker().send_chat(current, ':exclamation: Invalid input. Please provide a number.', true);
    } else {
        var seconds = minutesToSeconds(minutes);
        new x_snc_slackerbot.Slacker().send_chat(current, ':clock1: ' + minutes + ' minute(s) is ' + seconds + ' seconds.', false);
    }
}

function minutesToSeconds(mins) {
    return mins * 60;
}