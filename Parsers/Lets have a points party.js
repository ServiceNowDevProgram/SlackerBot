/*
activation_example:!pointparty | !pointsparty | !pp
regex:!(points?party|pp)
flags:gmi
*/

( function( current ){
	// Given a Chat GlideRecord, if it's threaded, then gather all
  // Slack user IDs and post a point message for each.
  var grChat, message, recipients, thread_ts, user_id, user_sysid;
  var si = new Slacker();
  // ¯\_(ツ)_/¯ 
  thread_ts = current.getValue( 'thread_ts' );
  user_id = current.user.getRefRecord().getValue( 'user_id' );
  user_sysid = current.getValue( 'user' );
  recipients = [];
  
  if( !thread_ts ){
    message = 'You cannot throw a points party in public. Get a thread!';
    si.send_chat( current, message, false );
    return null;
  }

  grChat = new GlideRecord( 'x_snc_slackerbot_chat' );
  grChat.addQuery( 'thread_ts', thread_ts );
  grChat.addQuery( 'user', '!=', user_sysid );
  grChat.query();
  
  while( grChat.next() ){
    recipients.push( grChat.user.getRefRecord().getValue( 'user_id' ) );
  }
  
  recipients = recipients.filter( function( recipient, idx, arr ){
    return arr.indexOf( recipient ) == idx;
  } );
  
  message = ['<@' + user_id + '> is throwing a points party for :\n'];
  
  recipients.forEach( function( recipient ){
    message.push( '<@' + recipient + '> ++ \n' );
  } );
  
  si.send_chat( current, message.join(''), false );

} )( current );
