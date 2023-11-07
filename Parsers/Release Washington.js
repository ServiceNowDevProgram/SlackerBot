/*
activation_example:washington
regex:(^|[^:\/\w])washington(?![\/\w])
flags:gmi
order:200
stop_processing:false
*/

var release = 'washington'; //to make the rest of this code re-usable across release reacts just making this a variable

//check to see if we have sent this react to this specific user in this channel in the last 12 hours
var count = new GlideAggregate('x_snc_slackerbot_chat');
count.addQuery('sys_created_on', '>', gs.hoursAgoStart(12));
count.addQuery('text', 'CONTAINS', release);
count.addQuery('channel', current.channel);
count.addQuery('user', current.user);
count.query();

if (count.getRowCount() < 2) {
  new x_snc_slackerbot.Slacker().send_reaction(current, release);
}
