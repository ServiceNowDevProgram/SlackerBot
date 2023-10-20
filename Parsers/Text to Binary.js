/*
activation_example:!binary Hello I am Robot
regex:!binary
flags:gmi
order:200
stop_processing:false
*/

var sentence = current.text.replace(/!binary/gmi, "").trim().toUpperCase();
if (sentence == '') {
	new x_snc_slackerbot.Slacker().send_chat(current, ':robot_face: : :question:', true);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, textToBinary(sentence), false);
}

function textToBinary(str) {
    var answer = [":robot_face: :"];

    for(var i = 0; i < str.length; i++) {
        var charBinary = str[i].charCodeAt().toString(2);

        answer.push(padBinary(charBinary));
    }
    return answer.join(" ");
}

function padBinary(str) {
    if (str.length >= 8) {
        return str;
    } else {
        var diff = 8 - str.length;
        var padding = '0' * (diff);
        return padding + str;
    }
}
