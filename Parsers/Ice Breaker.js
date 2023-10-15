/*
activation_example:!ice breaker
regex:(!ice breaker)
flag:gmi
*/

var ice_breakers = [
    {
        prompt: "How many siblings do you have?"
    }, {
        prompt: "What's your favorite movie?"
    }, {
        prompt: "What do you do for fun?" 
    }, {
        prompt: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?" 
    }, {
        prompt: "What's your name, and is there a story behind it?"  
    } 
];

var random = Math.floor(Math.random() * ice_breakers.length);

//Send the ice breaker prompt to Slack
new x_snc_slackerbot.Slacker().send_chat(current, ice_breakers[random].prompt, false);