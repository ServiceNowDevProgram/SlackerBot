/*
activation_example:!gulash
regex:^(!gulash|!gu)
flags:gi
*/
var strResponse = new x_snc_slackerbot.Gulash(current).parse() || '';
try{
    new x_snc_slackerbot.Slacker().send_chat( current, strResponse, true );
}
catch( e ){
    gs.error( "An error occured when SlackerBot tried to send a response back to Slack.\nError: " + e.name + ": " + e.message );
}
