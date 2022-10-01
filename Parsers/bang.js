/*
activation_example:!trout Helming
regex:!bang
flags:gm
*/

var term = current.text.replace('!bang', '').trim();
var msg = '';
if(term) msg = 'Hey ' + term + ', you\'ve had a bang-up past couple of months. Hope people start respecting you and your hard work.';
else msg = ':upside_down_face: !bang *someone*';

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);