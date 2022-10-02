/*
activation_example:!roll 5d12
regex:^!roll
flags:i
*/

(function(){
  var avg, matches, message, pattern, sides, sum, total_dice, 
      rolls = [];

  pattern = /^\!roll (-?)(\d*)d(-?)(\d*)/i;
  matches = current.text.match( pattern );

  if( ! matches ){ 
    new Slacker().send_chat( current, ':upside_down_face: Say `number` `d` `number`!', false );
    return null;
  }
  
  if( matches[1] == '-' || matches[3] == '-' ){
    new Slacker().send_chat( current, 'Stop that', false );
    return null;
  }

  try{
    total_dice = parseInt( matches[2], 10 );
    sides = parseInt( matches[4], 10 );
  }
  catch( e ){
    new Slacker().send_chat( current, 'One of those is not a number!', false );
    return null;
  }
  
  if ( total_dice > 100 || sides > 1000000 ){
		new Slacker().send_chat( current, 'You rolled: a lot', false );
		return;
	}

  for( var i=1; i<= total_dice; i++ ){
    rolls.push( Math.floor( Math.random() * sides ) + 1 );
  }
  
  sum = rolls.reduce( function( total, roll ){
    total += roll;
    return total;
  }, 0 );

  avg = sum / total_dice;
  message = [
    'You rolled: ',
    rolls.join( ', ' ),
    '.\nAverage of ',
    avg,
    '.\nSum of ',
    sum
    ].join('');
  
  new Slacker().send_chat( current, message, false );
  
})();

