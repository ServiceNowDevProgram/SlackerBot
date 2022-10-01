/*
activation_example:!jitsi
regex:^(!jitsi|!meet|!call)
flags:
*/

var meeting_room, regex, response;

regex = /^(!jitsi|!meet|!call)/;
meeting_room = current.text.replace( regex, '' ).trim();

try{
    if( !meeting_room ){
        // If the message did not include any text other than the Jits command, then append the user's name.
        meeting_room = current.user.name.replace(' ','_');
    }    
}
catch( errorMessage ){
    gs.error( "An error occured when SlackerBot tried to get the user's name.\nError: " + e.name + ": " + e.message );
    response = "An error occured when SlackerBot tried to get the user's name. Please notify the sndev admins.";
}

response = response || [
    'Click to join: https://meet.jit.si/sndevs/',
    meeting_room,
    ' Use Chrome, or Jitsi Meet App on IOS/Android - Room `sndevs/',
    meeting_room,
    '`'
].join( '' );

try{
    new x_snc_slackerbot.Slacker().send_chat( current, response, false );
}
catch( e ){
    gs.error( "An error occured when SlackerBot tried to send a response back to Slack.\nError: " + e.name + ": " + e.message );
}
