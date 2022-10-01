/*
activation_example:happy pride
regex:(happy pride)|(!pride)|(pride month)
flags:gmi
*/

var pridemojis = [
	'pride_heart',
	'bi_pride',
	'pan_pride',
	'asexuality_pride',
	'demigirl_pride',
	'trans_pride',
	'nonbinary_pride',
	'agender_pride',
	'genderfluid_pride',
	'genderqueer_pride',
	'intersex_pride',	
];


for (var i = 0; i < pridemojis.length ; i++){
    x_snc_slackerbot.Slacker().send_reaction(current, pridemojis[i]);
}
