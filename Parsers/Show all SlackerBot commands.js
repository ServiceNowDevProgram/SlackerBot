/*
activation_example:!help
regex:!help
flags:gmi
*/

// var parser = new GlideRecord('x_snc_slackerbot_parser');
// parser.orderBy('activation_example');
// parser.query();
// var helps = [];
// while(parser.next()){
// 	if (parser.getValue('description').indexOf('Admin tool') == -1 || 
// 		(parser.getValue('description').indexOf('Admin tool') > -1 && (current.channel == "GD51HTR46" || current.channel == "G9LAJG7G8" || current.channel == "G7M4AP6U8"))) {
// 		helps.push('`' + (parser.getValue('activation_example') ? parser.getValue('activation_example') : 'React with ' + parser.getValue('emoji')) + '` ' + parser.getValue('description'));
// 	}
// }
// new Slacker().send_chat(current, helps.join('\n'), true);

var message = new global.GlideQuery( 'x_snc_slackerbot_parser' )
.where( 'active', true )
.orderBy( 'activation_example' )
.select( 'activation_example', 'description' )
.reduce( function( arr, rec ){
    arr.push( '`' + rec.activation_example + '` ' + rec.description );
    return arr;
}, [] );

if (current.channel == 'G9LAJG7G8' || current.channel == 'GD51HTR46') {
    message.push('');
    message.push('The following are #poof only commands:');
    message.push('`!whois @username` Gathers slack information on the user');
    message.push('`!send !channel !message` forces this bot to send that message to that channel');
    message.push('`!ajb` all the ajb spam lol');
}

new Slacker().send_chat( current, message.join('\n'), false );
