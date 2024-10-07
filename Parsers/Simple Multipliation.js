/*
activation_example: !multiply 3 4
regex: !multiply (\d+) (\d+)
flags: gmi
order: 100
stop_processing: true
*/

var matches = current.text.match(/!multiply (\d+) (\d+)/);
if (matches) {
    var num1 = parseInt(matches[1], 10);
    var num2 = parseInt(matches[2], 10);
    var product = num1 * num2;
    new x_snc_slackerbot.Slacker().send_chat(current, `The product of ${num1} and ${num2} is ${product}.`, false);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !multiply [number1] [number2]', true);
}
