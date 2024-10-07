/*
activation_example: !remind me in 5 minutes
regex: !remind me in (\d+) (minutes|hours|days)
flags: gmi
order: 100
stop_processing: true
*/

var matches = current.text.match(/!remind me in (\d+) (minutes|hours|days)/);
if (matches) {
    var duration = parseInt(matches[1], 10);
    var unit = matches[2];
    var milliseconds;

    switch (unit) {
        case 'minutes':
            milliseconds = duration * 60 * 1000;
            break;
        case 'hours':
            milliseconds = duration * 60 * 60 * 1000;
            break;
        case 'days':
            milliseconds = duration * 24 * 60 * 60 * 1000;
            break;
        default:
            new x_snc_slackerbot.Slacker().send_chat(current, 'Invalid time unit. Please use minutes, hours, or days.', true);
            return;
    }

    setTimeout(() => {
        new x_snc_slackerbot.Slacker().send_chat(current, 'Reminder: Your time is up!', false);
    }, milliseconds);

    new x_snc_slackerbot.Slacker().send_chat(current, `Reminder set for ${duration} ${unit}.`, false);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !remind me in X minutes/hours/days', true);
}
