/*
activation_example:!ajb 5
regex:!ajb
flags:gm
*/

var choices = [
    ':ajb:',
    ':partyajb:',
    ':mobilityajb:',
    ':ajbconga:',
    ':ajbgoespoof:',
    ':ajbleftfall:',
    ':ajbdownfall:',
    ':ajbispumped:',
    ':ajbdescends:',
    ':ajbupsidedown:',
    ':ajbheadswillroll:'
];

//Store the numerical value of the second split
var split = parseInt((current.text.split(' ')[1]), 10);
var text;

//Determine text to send
if(!split || split == '' || split <= 0) text = "You're not going to get any :ajb: with that attitude! Add a number and try again.";
else text = (split > 10 ? 'Now that would just be rude. Shame on you' : choices.join('').repeat(split));

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, text, false);