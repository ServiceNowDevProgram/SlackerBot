/*
activation_example:parrotwave
regex:(parrot wave)|(parrotwave)|(wave parrot)|(waveparrot)|(parrot party)|(parrotparty)
flags:gmi
*/

for (var i = 1; i <= 7; i++){
    new x_snc_slackerbot.Slacker().send_reaction(current, 'parrotwave'+i);
}
