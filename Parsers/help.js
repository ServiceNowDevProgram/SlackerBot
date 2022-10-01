/*
activation_example:!help
regex:^!help
flags:i
*/

// var message = new global.GlideQuery( 'x_snc_slackerbot_parser' )
// .where( 'active', true )
// .orderBy( 'activation_example' )
// .select( 'activation_example', 'description' )
// .reduce( function( arr, rec ){
//     arr.push( '`' + rec.activation_example + '` ' + rec.description );
//     return arr;
// }, [] );

var message = [
    '`!bang @person` Supportive text for an overworked employee.',
    '`!clap some sentence` Caps lock and clap backs.',
    '`!docs string` Searchs the ServiceNow docs for the string provided.',
    '`!emoji string` translate a message to emojis',
    '`!flip string` Or !invert, flips the string upside down.',
    '`!giphy string` Regular old giphy search but works in threads.',
    '`!google string` Provides a link to a google search for the provided string.',
    '`!insult` *Deactivated and moved to SlackBot instead*. Says an SN-related insult.',
    '`!iss` Let\'s you know where the International Space Station is right now.',
    '`!job` Creates a random LinkedIn message that an SN Dev is likely to receive from a recruiter.',
    '`!joke` Tells you a joke, obvi.',
    '`!lmgtfy string` A more sassy version of !google.',
    '`!madlib` Provides instructions on how to create a SN-related madlib.',
    '`!parrot wave` Adds excitement to your message.',
    '`!report string` Reports on how often the provided string has appeared in the last 7 days on this workspace.',
    '`!roll 3d6` Rolls three six-sided dice (or any other combination you give).',
    '`!test` Creates a randomly generated SN-related testing script.',
    '`!tips` A summary of tips from the SN Devs pro-tips website',
    '`!trout @person` or `!slap @person` IRC-like slap to whoever you @.',
    //'`!youtube string` Links the first found video on youtube according to your search string',
    '`!zalgo string` or !curse will eff yo text up',
    '`Say 30F or 30C` and it will convert the temperature to the other unit',
    '`!help` ¯\\_(ツ)_/¯'
];

if (current.channel == 'G9LAJG7G8' || current.channel == 'GD51HTR46') {
    message.push('');
    message.push('The following are #poof only commands:');
    message.push('`!whois @username` Gathers slack information on the user');
    message.push('`!send !channel !message` forces this bot to send that message to that channel');
    message.push('`!ajb` all the ajb spam lol');
}

new Slacker().send_chat( current, message.join('\n'), false );

