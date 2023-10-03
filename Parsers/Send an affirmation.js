/*
activation_example:!affirm
regex:!affirm, !affirm @user
flags:g
*/


var rm = new sn_ws.RESTMessageV2();
rm.setHttpMethod('GET');
rm.setEndpoint('https://www.affirmations.dev/');
rm.setRequestHeader('User-Agent', 'servicenow');
var response = rm.execute();
var body = response.getBody();
var payload = JSON.parse(body);
var msg = payload.affirmation;

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);