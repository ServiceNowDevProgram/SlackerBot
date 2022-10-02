/*
activation_example:!usage
regex:^(!usage|!report)
flags:i
*/

var count, message, query, report_on, regex;

regex = /^(!usage|!report) (.*)/i;
report_on = current.text.match( regex ) ? current.text.match( regex )[2] : null;

if ( !report_on ) {
    message = ':upside_down_face: !usage *something*';
    new x_snc_slackerbot.Slacker().send_chat( current, message, false );
}
else{
    query = [
            'textLIKE' + report_on,
            '^sys_created_onONLast 7 days@javascript:gs.beginningOfLast7Days()@javascript:gs.endOfLast7Days()'
        ].join( '' );

    count = new global.GlideQuery.parse( 'x_snc_slackerbot_chat', query ).count();

    message = [
            'The message `',
            report_on,
            '` has appeared ',
            count,
            ' times in the channels I\'ve been watching in the last seven days.'
        ].join( '' );

    new x_snc_slackerbot.Slacker().send_chat( current, message, false );
}

