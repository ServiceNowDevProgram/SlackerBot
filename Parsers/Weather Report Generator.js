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
    var weatherBody = response.getBody();

    var locrm = new sn_ws.RESTMessageV2();
    locrm.setHttpMethod('GET');
    locrm.setLogLevel('all');
    locrm.setEndpoint('https://wttr.in/' + wordCount[0]);
    var locResponse = locrm.execute();
    var locBody = locResponse.getBody();
    var matches = locBody.match(/Location: ([^[]+)\s/);

    if (matches[1]) weatherBody = weatherBody.replace(/[^:]+/, matches[1]);

    new x_snc_slackerbot.Slacker().send_chat(current, weatherBody);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please Provide Location Ex: "!weather london"');
}
