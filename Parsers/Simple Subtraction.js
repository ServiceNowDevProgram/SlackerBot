/*
activation_example: !subtract 10 5
regex: !subtract (\d+) (\d+)
flags: gmi
order: 100
stop_processing: true
*/

var matches = current.text.match(/!subtract (\d+) (\d+)/);
if (matches) {
    var num1 = parseInt(matches[1], 10);
    var num2 = parseInt(matches[2], 10);
    var difference = num1 - num2;
    new x_snc_slackerbot.Slacker().send_chat(current, `The difference between ${num1} and ${num2} is ${difference}.`, false);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !subtract [number1] [number2]', true);
}
