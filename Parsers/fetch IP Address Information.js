/*
activation_example:!ipinfo
regex:^!ipinfo
flags:i
*/

var input = current.text.trim(); // getting the user input

// regular expression to check the correct IP Address
var regexp = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;

// regular expression to fetch the IP Address from information added by user
var extractedip = input.match(/\b(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b/g);


var ipaddress = extractedip ? extractedip : " "; // set the value of ipaddress with the ipaddress given by user or remain empty



// fetch the IP Address Information like(city,region,country,loc,org,postal,timezone) from API and return result
function fetchinfo(ipaddress) {
    var url = "https://ipinfo.io/" + ipaddress + "/json";
    var r = new sn_ws.RESTMessageV2();
    r.setEndpoint(url);
    r.setHttpMethod('GET');
    var ipinfo = r.execute();
    var result = JSON.parse(ipinfo.getBody());
    return result;
}

try {
    if (regexp.test(ipaddress)) {
        var ipdata = fetchinfo(ipaddress); // calling the fetchinfo function
        var ipInformationSlackMessage = "*IP Information:*\n" +
            "• *IP*: " + ipdata.ip + "\n" +
            "• *City*: " + ipdata.city + "\n" +
            "• *Region*: " + ipdata.region + "\n" +
            "• *Country*: " + ipdata.country + "\n" +
            "• *Location*: " + ipdata.loc + "\n" +
            "• *Organization*: " + ipdata.org + "\n" +
            "• *Postal Code*: " + ipdata.postal + "\n" +
            "• *Timezone*: " + ipdata.timezone;  //formatting for slack mark down 
        new x_snc_slackerbot.Slacker().send_chat(current,  ipInformationSlackMessage , false); // display the output to user

    } else {
        new x_snc_slackerbot.Slacker().send_chat(current, "Oops! I couldn't understand that. Please provide a valid IP Address.", false); // Message to show when IP is invalid
    }


} catch (error) {
    new x_snc_slackerbot.Slacker().send_chat(current, "Oops! Facing Issue while fetching information about IP Address.", false); //handling exception in try block
}
