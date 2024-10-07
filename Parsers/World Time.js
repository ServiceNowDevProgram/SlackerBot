/*
activation_example:!time Tokyo
regex:!time\s+(.+)
flags:gi
order:400
stop_processing:false
*/

var regex = /!time\s+(.+)/gi;
var match = regex.exec(current.text);
if (match && match[1]) {
    var city = match[1].trim().replace(/\s+/g, '_'); // Replace spaces with underscores for URL formatting
    var apiUrl = 'http://worldtimeapi.org/api/timezone/';

    // Attempt to find the appropriate timezone for the city
    var timezone = getTimezoneForCity(city); // This function would need to be implemented

    if (timezone) {
        apiUrl += timezone;

        // Make an API call to the world time service
        var response = new sn_ws.RESTMessageV2();
        response.setHttpMethod('GET');
        response.setEndpoint(apiUrl);
        response.setRequestHeader('Accept', 'application/json');
        
        try {
            var httpResponse = response.execute();
            var httpResponseStatus = httpResponse.getStatusCode();
            
            if (httpResponseStatus === 200) {
                var timeData = JSON.parse(httpResponse.getBody());
                var datetime = new Date(timeData.datetime);
                var responseMessage = 'The current time in ' + city.replace(/_/g, ' ') + ' is ' + datetime.toLocaleTimeString() + '.';
                new x_snc_slackerbot.Slacker().send_chat(current, responseMessage, false);
            } else {
                new x_snc_slackerbot.Slacker().send_chat(current, 'Sorry, I could not fetch the time for ' + city.replace(/_/g, ' ') + '.', false);
            }
        } catch (error) {
            new x_snc_slackerbot.Slacker().send_chat(current, 'There was an error fetching the time information. Please try again later.', false);
        }
    } else {
        new x_snc_slackerbot.Slacker().send_chat(current, 'I couldn't find the timezone for ' + city.replace(/_/g, ' ') + '. Please try another city.', false);
    }
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please specify a city to get the current time for, like `!time Tokyo`.', false);
}

// Placeholder function for mapping city names to timezones. This would need to be more comprehensive or use an API.
function getTimezoneForCity(city) {
    var cityToTimezoneMap = {
        'tokyo': 'Asia/Tokyo',
        'new_york': 'America/New_York',
        'london': 'Europe/London',
        // Add more city to timezone mappings as needed
    };
    
    return cityToTimezoneMap[city.toLowerCase()] || null;
}
