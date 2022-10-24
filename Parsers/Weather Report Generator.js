/*
activation_example:!weather london
regex:!weather
flags:gmi
*/
var wordCount = current.text.replace('!weather', '').trim().split(' ');

if (wordCount[0] != '') {

    var rm = new sn_ws.RESTMessageV2();
    rm.setHttpMethod('GET');
    rm.setLogLevel('all');
    rm.setEndpoint('https://wttr.in/' + wordCount[0] + '?format=4');
    var response = rm.execute();
    new x_snc_slackerbot.Slacker().send_chat(current, response.getBody());
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please Provide Location Ex: "!weather london"');
}
