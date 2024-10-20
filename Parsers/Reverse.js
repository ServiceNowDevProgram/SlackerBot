/*
activation_example:!reverse your string or not
regex:!reverse
flags:gmi
order:250
stop_processing:false
*/

var uno = `⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀
⡈⠀⢀⣴⣦⢶⣴⣴⣦⢶⣴⢦⣶⡴⣦⡶⣴⣦⢶⣴⣤⡀⠀⠠⡀
⠀⠀⣿⣟⣾⠗⢀⢸⣾⢿⣽⣻⣾⠻⠝⠛⢉⡈⠛⠻⢾⣿⠀⠀⠀
⠀⠀⣿⣾⠷⠞⣹⡿⣯⢿⡞⠋⣡⣴⣾⢿⣟⡿⣟⣷⣄⠹⠀⠀⠀
⠀⠀⣿⣯⣤⣼⡿⣽⡛⢁⣴⣿⣻⣽⡾⣯⡿⣽⣟⣷⣻⡆⠀⠀⠀
⠀⠀⣿⣽⣻⢯⡟⠃⣴⣿⣻⢾⣽⣳⡿⣽⣻⣽⡾⣯⣷⢿⠀⠀⠀
⠀⠀⣿⣳⡿⠏⣠⣿⣟⣷⣻⣯⣟⣷⣿⣻⣽⣷⣻⢷⣯⣿⠀⠀⠀
⠀⠀⣿⣽⠃⣴⣿⣳⢿⣞⡿⣿⠆⠀⠀⢠⣿⣞⣯⣿⣳⡏⠀⠀⠀
⠀⠀⣿⠃⣼⣻⢾⣽⣯⣿⠟⠁⠀⣠⣄⣸⣿⢾⣽⣞⣯⠅⠀⠀⠀
⠀⠀⡇⣸⣷⣻⣯⣷⣻⣿⡀⣠⠞⠹⣿⣿⢯⣿⣞⣯⠏⢸⠀⠀⠀
⠀⠀⢁⣿⣽⣯⢿⣽⡟⢿⠗⠉⠀⢠⣿⣽⢾⣯⣟⡿⢀⣾⠀⠀⠀
⠀⠀⢸⣟⣾⡽⣯⣿⠀⠀⠀⣠⣶⣿⣻⢾⣟⣾⡽⢀⣾⣻⠀⠀⠀
⠀⠀⣿⣟⡷⣿⣻⣿⣤⣤⣤⣬⣿⣷⣻⣯⢿⠞⢠⣾⢯⣿⠀⠀⠀
⠀⠀⣿⣽⣻⢷⣟⣿⣻⣟⣿⣻⣟⡾⣷⡻⠋⣰⣿⢯⣿⣽⠀⠀⠀
⠀⠀⢻⣷⣻⢿⣾⣳⡿⣾⡽⣷⣻⡽⠛⣠⣾⢿⡽⠿⢾⣽⠀⠀⠀
⠀⠐⡌⢳⣿⣻⡾⣽⣻⢷⣟⠏⢃⣤⣾⢿⡽⡟⣁⣤⣾⣿⠀⠀⠀
⠀⠀⣿⢦⣈⣑⠛⠛⣋⣁⣤⡾⣿⡽⣾⣻⡏⠛⣡⣾⣟⣾⠀⠀⠀
⠃⠀⠙⢿⣯⣟⣿⣻⣯⣿⣽⣻⣷⣟⣯⣷⣷⣶⣿⣳⡯⠋⠀⠀⠀`;

var string = current.text.replace(/!reverse/gmi, "").split('').reverse().join('');
if (string == '') {
	new x_snc_slackerbot.Slacker().send_chat(current, uno, false);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, string, false);
}
