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
	if (parser.getValue('description').indexOf('Admin tool') == -1 || 
		(parser.getValue('description').indexOf('Admin tool') > -1 && (current.channel == "GD51HTR46" || current.channel == "G9LAJG7G8" || current.channel == "G7M4AP6U8"))) {
		helps.push('`' + (parser.getValue('activation_example') ? parser.getValue('activation_example') : '+:' + parser.getValue('emoji') + ':') + '` ' + parser.getValue('description'));
	}
}
new Slacker().send_chat(current, helps.join('\n'), true);
