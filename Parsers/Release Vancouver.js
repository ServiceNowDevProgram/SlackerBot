/*
activation_example:vancouver
regex:(?i)(?<![:\/\w])vancouver(?![\/\w])
flags:gmi
order:200
stop_processing:false
*/

new x_snc_slackerbot.Slacker().send_reaction(current,'vancouver');
