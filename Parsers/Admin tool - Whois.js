/*
activation_example:!whois @EarlDuque
regex:!whois
flags:gmi
*/

if (current.channel == "GD51HTR46" || current.channel == "G9LAJG7G8" || current.channel == "G7M4AP6U8") { //admin channels on sndevs
	// Update desired keys if you want to change returned fields from payload
	const desiredKeys = ['user.real_name', 'user.profile.pronouns', 'user.profile.email', 'user.tz_label', 'user.updated'];
	const slacker = new x_snc_slackerbot.Slacker();
	let userId = current.text;
	userId = userId.replace('!whois <@', '');
	userId = gs.urlEncode(userId.replace('>', '').trim());

	const rm = new sn_ws.RESTMessageV2();
	rm.setHttpMethod('GET');
	rm.setLogLevel('all');
	rm.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	rm.setRequestHeader('authorization', `Bearer ${gs.urlEncode(gs.getProperty('x_snc_slackerbot.SlackerBot.token'))}`);
	rm.setEndpoint(`https://slack.com/api/users.info?user=${userId}`);
	const response = rm.execute();
	const responseBody = JSON.parse(response.getBody());

	if (!responseBody.ok) {
		slacker.send_chat(current, 'i dunno', false);
	} else {
		const messageArray = [];
		let messageBody = '';

		for (let key of desiredKeys) {
			let path = key.split('.');
			let obj = {};
			switch (path.length) {
				case 1:
					obj[path[0]] = responseBody[path[0]] ?? '{Not set}';
					break;
				case 2:
					obj[path[1]] = responseBody[path[0]][path[1]] ?? '{Not set}';
					break;
				case 3:
					obj[path[2]] = responseBody[path[0]][path[1]][path[2]] ?? '{Not set}';
					break;
				default:
					gs.warn(`Whois parser encountered unexpected path length for a key. Key is ${key}`);
			}

			// Handle conversions
			if (path[1] == 'updated') {
				let time = new GlideDateTime();
				time.setValue(responseBody[path[0]][path[1]] * 1000);
				obj[path[1]] = `${time.getDisplayValue()} (${gs.getSession().getTimeZoneName()})`;
			}
			messageArray.push(obj);
		}

		// Get verify data
		const grUser = new GlideRecord('x_snc_slackerbot_user');
		if (grUser.get('user_id', userId)) {
			messageArray.push({
				'Identity verified': grUser.getValue('verified') == 1 ? 'Yes' : 'No'
			});
			if (!gs.nil(grUser.getValue('admin_info'))) {
				messageArray.push({
					'Admin information': grUser.getValue('admin_info')
				});
			}
			if (!gs.nil(grUser.getValue('user_info'))) {
				messageArray.push({
					'User-visible information': grUser.getValue('user_info')
				});
			}
		}

		messageBody = messageArray.map(obj => `${Object.keys(obj)[0]}: ${Object.values(obj)[0]}`).join('\n');
		
		slacker.send_chat(current, '```' + messageBody + '```', false);
	}
}
