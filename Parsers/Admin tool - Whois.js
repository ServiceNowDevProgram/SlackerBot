/*
activation_example:!whois @EarlDuque
regex:!whois
flags:gmi
*/

var allowed_channels = gs.getProperty('slacker.admin_channels');

if ( allowed_channels.indexOf(current.getValue('channel')) > -1 ) { //admin channels on sndevs
	var rm = new sn_ws.RESTMessageV2();
	rm.setHttpMethod('GET');
	rm.setLogLevel('all');
	rm.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	rm.setRequestHeader('authorization', 'Bearer ' + gs.urlEncode(gs.getProperty('x_snc_slackerbot.SlackerBot.token')));
	var bodyString = '';
	//   bodyString += 'token=' + gs.urlEncode(gs.getProperty('x_snc_slackerbot.SlackerBot.token'));
	var user_id = current.getValue('text').replace('!whois', '').replace('<@', '').replace('>', '').trim();
	bodyString += 'user=' + gs.urlEncode(user_id);
	rm.setEndpoint('https://slack.com/api/users.info' + '?' + bodyString);
	var response = rm.execute();
	var response_body = JSON.parse(response.getBody());

	var message_body = '';
	for (var key in response_body.user) {
		if (key == 'profile') {
			message_body += 'profile: \n';
			for (var prof_key in response_body.user.profile) {
				if (prof_key.indexOf('image_') != -1) continue;
				message_body += '  ' + prof_key + ': ' + response_body.user.profile[prof_key] + '\n';
			}
		} else message_body += key + ': ' + response_body.user[key] + '\n';
	}

	if (response_body.user.name) {
		var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, '```' + message_body + '```', true);
	} else {
		var send_chat2 = new x_snc_slackerbot.Slacker().send_chat(current, 'i dunno', true);
	}
}
