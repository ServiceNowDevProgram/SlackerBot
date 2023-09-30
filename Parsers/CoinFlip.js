/*
activation_example:!coinflip
regex:!coinflip
flags:gmi
*/

var message = 'Thanks for flipping. You got ' +
    ( Math.ceil( Math.random() * 2 ) == 1 ? 'heads' : 'tails' )

new x_snc_slackerbot.Slacker().send_chat(current, message, true)
