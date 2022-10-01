/*
activation_example:!help
regex:^!help
flags:i
*/

var message = new global.GlideQuery( 'x_snc_slackerbot_parser' )
.where( 'active', true )
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

