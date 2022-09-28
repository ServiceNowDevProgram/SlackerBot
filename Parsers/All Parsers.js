/*
activation_example:!help
regex:!help
flags:gmi
*/
var parser = new GlideRecord('x_snc_slackerbot_parser');
parser.orderBy('activation_example');
parser.query();
var helps = [];
while(parser.next()){
	helps.push('`' + parser.getValue('activation_example') + '` ' + parser.getValue('description'));
}
new Slacker().send_chat(current, helps.join('\n'), true);
