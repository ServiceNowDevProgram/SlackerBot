/*
activation_example:!pointsparty
regex:^!pointsparty
flags:i
*/

(function( grChat ){
    var channel, messages, participant_slack_ids, text, thread_ts, user;

    gs.info( 'Slacker: Starting the PointsParty parser.' );

    if( !grChat.thread_ts ){ // Do not throw party unless in a thread
        return null;
    }

    user = grChat.getValue( 'user' );
    channel = grChat.getValue( 'channel' );
    thread_ts = grChat.getValue( 'thread_ts' );
    text = grChat.getValue( 'text' );
    messages = [];

    gs.info( 'Slacker: Gather thread participants.' );
    
    participant_slack_ids = new global.GlideQuery( 'x_snc_slackerbot_chat' )
        .where( 'channel', channel )
        .where( 'thead_ts', thread_ts )
        .where( 'user', '!=', user )
        .select( 'user' )
        .reduce( function( arr, rec ){
            arr.push( rec.user );
            return arr;
        }, [] )
        .filter( function( rec, idx, arr ){
            return arr.indexOf( rec ) == idx;
        } );

    gs.info( 'Slacker: Participant IDs: ' + JSON.stringify( participant_slack_ids ) );
    

    participant_slack_ids.forEach( function( slack_id ){
        updateUserTable( slack_id );
        updatePointsTable( user, slack_id, grChat.getUniqueValue(), text );
        var rankAndPoints = calculateRankAndPoints( slack_id );
        messages.push( getMessage( slack_id, rankAndPoints[1], rankAndPoints[0] ) );
    } );

    gs.info( 'Slacker: Messages: ' + JSON.stringify( messages ) );
    
    new Slacker().send_chat( grChat, messages.join('\n'), false );


    function updateUserTable( user ){
        gs.info( 'Slacker: Starting to update the User table.' );
    
        var grUser = new GlideRecord( 'x_snc_slackerbot_user' );
        grUser.addQuery( 'user_id', user );
        grUser.query();

        if( grUser.next() ){
            grUser.setValue( 'points', parseInt( grUser.getValue( 'points' ) ) + 1 );
            grUser.update();
        }
        else{
            grUser.initialize();
            grUser.setValue( 'user_id', user );
            grUser.setValue( 'points', 1 );
            grUser.insert();
        }
    }

    function updatePointsTable( giver, target, source_event, text ){
        gs.info( 'Slacker: Starting to update the Points table.' );
    
        var grPointRecord = new GlideRecord( 'x_snc_slack_points_point' );
        grPointRecord.initialize();
        grPointRecord.setValue( 'giver', giver );
        grPointRecord.setValue( 'target', target );
        grPointRecord.setValue( 'source_event', source_event );
        grPointRecord.setValue( 'text', text );
        grPointRecord.insert();
    }

    function calculateRankAndPoints( user ){
        gs.info( 'Slacker: Starting to calculate rank and total points.' );
    
        var last90days, points, rank, userPoints, users;
        
        users = [];
        last90days = 'sys_created_onONLast 90 days@javascript:gs.beginningOfLast90Days()@javascript:gs.endOfLast90Days()';
        points = new global.GlideQuery.parse( 'x_snc_slack_points_point', last90days )
        .aggregate( 'count' )
        .groupBy( 'target' )
        .orderByDesc( 'count' )
        .select()
        .reduce( function( arr, rec ){
            users.push( rec.group.target );
            arr.push( rec.count );
            return arr;
        }, [] );

        rank = users.indexOf( user ) + 1;
        userPoints = points[ rank - 1 ];

        return [ rank, userPoints ];
    }

    function getMessage( user, points, rank ){
        gs.info( 'Slacker: Starting to get the message.' );
    
        var randomMessage = new x_snc_slack_points.RandomMessage();
        return randomMessage.getMessage( user, userPoints, userPoints, rank );
    }


})( current );