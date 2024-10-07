/*
activation_example: !add 5 10
regex: !add (\d+) (\d+)
flags: gmi
order: 100
stop_processing: true
*/

var matches = current.text.match(/!add (\d+) (\d+)/);
if (matches) {
    var num1 = parseInt(matches[1], 10);
    var num2 = parseInt(matches[2], 10);
    var sum = num1 + num2;
    new x_snc_slackerbot.Slacker().send_chat(current, `The sum of ${num1} and ${num2} is ${sum}.`, false);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !add [number1] [number2]', true);
}
