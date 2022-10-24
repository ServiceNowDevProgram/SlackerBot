/*
activation_example:!iss
regex:!iss
flags:gmi
*/

var ISS = Class.create();
ISS.prototype = {
    initialize: function() {
    },
	
	get_coords: function(){
		var rm = new sn_ws.RESTMessageV2();
		rm.setHttpMethod('GET');
		rm.setEndpoint('http://api.open-notify.org/iss-now.json');
		//rm.setLogLevel('all');
		
		var response = rm.execute();
		var response_body = JSON.parse(response.getBody());
		return response_body;
	},
	
	get_location: function(iss_lat,iss_long){
		var rm = new sn_ws.RESTMessageV2();
		rm.setHttpMethod('GET');
		rm.setLogLevel('all');
		rm.setEndpoint('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + iss_lat + ',' + iss_long + '&key=' + gs.getProperty('x_snc_slackerbot.maps.token'));
		
		var response = rm.execute();
		var response_body = JSON.parse(response.getBody());
		return response_body;
	},
	
	get_image: function(iss_lat,iss_long){
		return 'https://maps.googleapis.com/maps/api/staticmap?center=' + iss_lat + ',' + iss_long + '&zoom=3&size=200x200&markers=color:blue|' + iss_lat + ',' + iss_long + '&key=' + gs.getProperty('x_snc_slackerbot.maps.token');
	},

    type: 'ISS'
};

var get_coords = new x_snc_slackerbot.ISS().get_coords();
var iss_lat = get_coords.iss_position.latitude;
var iss_long = get_coords.iss_position.longitude;

// 	Los Angeles: 34.0522,118.2437
//  	iss_lat = '34.0522';
//  	iss_long = '118.2437';

var get_location = new x_snc_slackerbot.ISS().get_location(iss_lat, iss_long);
gs.info('slacker get_location: ' + JSON.stringify(get_location));
var location = '';
if (get_location.status == 'ZERO_RESULTS') location = 'the ocean.';
else {
	// 		var area1 = get_location.results.address_components[6].long_name;
	// 		var area2 = get_location.results.address_components[7].long_name;
	// 		gs.info('slacker: ' + get_location.results.address_components);
	var area1 = ''; var area2 = '';
	for (var i in get_location.results[0].address_components){
		if (get_location.results[0].address_components[i].types[0] == 'administrative_area_level_1') area1 = get_location.results[0].address_components[i].long_name;
		if (get_location.results[0].address_components[i].types[0] == 'administrative_area_level_2') area2 = get_location.results[0].address_components[i].long_name;
		else if (get_location.results[0].address_components[i].types[0] == 'country') area2 = get_location.results[0].address_components[i].long_name;
	}
	if (!area1 && !area2) location = 'the ocean';
	else if (area1) location = area1 + ', ' + area2 + '.';
	else location = area2 + '.';
}

var get_image = new x_snc_slackerbot.ISS().get_image(iss_lat, iss_long);

//var area1 = 'test1';
//var area2 = 'test2';

// 	var send_chat = new SlackFall().send_chat(current.channel, 'The International Space Station is currently above latitude: ' + get_coords.iss_position.latitude + ', longitute: ' + get_coords.iss_position.longitude + '\nThose coordinates place the ISS over ' + location, false, '', current.thread_ts);
// 	send_attachment: function(channel, message, image, thread, pretext)
var send_chat = new x_snc_slackerbot.Slacker().send_attachment(current.channel, 'The International Space Station is currently above latitude: ' + iss_lat + ', longitude: ' + iss_long + '\nThose coordinates place the ISS over ' + location, get_image, current.thread_ts, true);
