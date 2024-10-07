/*
activation_example: !divide 10 2
regex: !divide (\d+) (\d+)
flags: gmi
order: 100
stop_processing: true
*/

var matches = current.text.match(/!divide (\d+) (\d+)/);
if (matches) {
    var num1 = parseInt(matches[1], 10);
    var num2 = parseInt(matches[2], 10);
    if (num2 === 0) {
        new x_snc_slackerbot.Slacker().send_chat(current, 'Cannot divide by zero!', true);
    } else {
        var quotient = num1 / num2;
        new x_snc_slackerbot.Slacker().send_chat(current, `The quotient of ${num1} divided by ${num2} is ${quotient}.`, false);
    }
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !divide [number1] [number2]', true);
}
