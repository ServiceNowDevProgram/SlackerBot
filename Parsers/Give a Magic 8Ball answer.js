/*
activation_example:!8ball or !magic8
regex:(!8ball)|(!magic8)
flags:gmi
*/

var responses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];
var randMagic8 = responses[parseInt(Math.random() * responses.length)];
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, randMagic8, true);
