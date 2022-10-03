/*
emoji:pride_heart
*/

var heartemojis = [
	'heart',
	'orange_heart',
	'yellow_heart',
	'green_heart',
	'blue_heart',
	'purple_heart',
	'black_heart',
	'brown_heart',
];


for (var i = 0; i < heartemojis.length ; i++){
    new x_snc_slackerbot.Slacker().send_reaction(current, heartemojis[i]);
}
