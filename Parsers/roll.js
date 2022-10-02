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
  
  if ( total_dice >100 || sides >1000000 ){
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



/* Old Code
(function executeRule(current, previous /*null when async* /) {

	var sentence = current.text.substr(5).trim();
	if (sentence == '') {
		var send_confusion = new SlackFall().send_chat(current.channel, ':upside_down_face: Say `number` `d` `number`!', false, '', current.thread_ts);
		return;
	}
	var numbers = sentence.split('d');
	for(var k=0; k<numbers.length; k++) { numbers[k] = parseInt(numbers[k], 10); } 
// 	var what = new SlackFall().send_chat(current.channel, isNaN(numbers[0]) + ' ' + isNaN(numbers[1]),false); return;
	if (isNaN(numbers[0]) || isNaN(numbers[1])) {
		var send_more_confusion = new SlackFall().send_chat(current.channel, 'One of those is not a number!', false, '', current.thread_ts);
		return;
	}
	if (numbers[0]>100 || numbers[1]>1000000){
		var send_ridiculous = new SlackFall().send_chat(current.channel, 'You rolled: a lot', false, '', current.thread_ts);
		return;
	}
	if (numbers[0]<1 || numbers[1]<1){
		var send_err = new SlackFall().send_chat(current.channel, 'Stop that', false, '', current.thread_ts);
		return;
	}
	var total_dice = numbers[0];
	var sides = numbers[1];
	var message = 'You rolled: ';
	var current_roll = 0;
	var all_rolls = [];
	for (var i = 1; i <= total_dice; i++){
		current_roll = Math.floor(Math.random() * sides) + 1;
		all_rolls.push(current_roll);
	}
	var sum = 0;
	for( var j = 0; j < all_rolls.length; j++ ){
		sum += parseInt( all_rolls[j], 10 ); //don't forget to add the base
	}

	var avg = sum/all_rolls.length;
	message += all_rolls.join(', ')+'. `Average of ' + avg + '` `Sum of ' + sum + '`';

	var send_lmgtfy = new SlackFall().send_chat(current.channel, message, false, '', current.thread_ts);

})(current, previous);
*/
