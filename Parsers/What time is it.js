/*
activation_example:!time Australia/Brisbane
regex:^!time\s[^\s]+|^!astrid
flags:gmi
*/

var term = /^(?:!time )([^\s]+)/gmi.exec(current.text);
var astrid = /!astrid/.test(current.text);
var tz = "";
var text = "";
var tza = getTimeZoneArray();
var endText = "";

if (astrid) {
    tz = "Australia/Sydney";
    endText = "Astrid time!";
}
else
    tz = term && term[1] ? term[1] : '';


if (!tz || !tza || tza.indexOf(tz.toLowerCase()) == -1) {
    // timezone not found
    text = "That doesn't look like a valid timezone. Try one of these:\n- " + tza.join('\n- ');
    new x_snc_slackerbot.Slacker().send_chat(current, text, true);
}
else {
  var uri = "https://worldtimeapi.org/api/timezone/"
  var rm = new sn_ws.RESTMessageV2();
  rm.setEndpoint(uri + tz);
  rm.setHttpMethod('get');
  response = rm.execute();
  rb = JSON.parse(response.getBody());
  var timeString = rb.datetime.split('T')[1].split('.')[0];
  var gd = new GlideDate();
  gd.setValue(rb.datetime.replace('T',' '));
  dateString = gd.getByFormat('EEEE, MMMM dd, yyyy');
  endText = !endText ? rb.timezone : endText;
  text = 'It is currently ' + timeString + ' on ' + dateString + ' in ' + endText;
  new x_snc_slackerbot.Slacker().send_chat(current, text, false);
}

function getTimeZoneArray(){
    var uri = "https://worldtimeapi.org/api/timezone/";
    var rm = new sn_ws.RESTMessageV2();
    rm.setEndpoint(uri);
    rm.setHttpMethod('get');
    response = rm.execute();
    return JSON.parse(response.getBody()).map(function(e){return e.toLowerCase();});
}
