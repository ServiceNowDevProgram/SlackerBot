/*
activation_example:1km or 1 kilometre
regex:(?:^|\s)(=?-?\d{1,5}\.?\d{0,8})\s?k(m?|ilometer|ilometers|ilometre|ilometres)\b/gmi
flags:gmi
*/

var regextest = (?:^|\s)(=?-?\d{1,5}\.?\d{0,8})\s?k(m?|ilometer|ilometers|ilometre|ilometres)\b/gmi;
var match = regextest.exec(current.text);
var numbertest = /-?\d{1,}\.?\d{0,}/;
var numbermatch = numbertest.exec(match[0]);
var kmtomiles = (parseFloat(numbermatch[0]) * 0.621371);
var originalnumber = parseFloat(numbermatch[0]).toFixed(2).toString().slice(-3) == '.00' ? parseFloat(numbermatch[0]).toFixed(2).toString().slice(0, -3) : parseFloat(numbermatch[0]).toFixed(2);
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, originalnumber + ' km is ' + kmtomiles.toFixed(2) + ' miles (in freedom units).');
