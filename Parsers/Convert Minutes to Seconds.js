/*
activation_example:1 minute or 5 minutes or 1min
regex:(?:^|\s)(=?-?\d{1,5}\.?\d{0,8})\s?m(inute|inutes|in)\b
flags:gmi
*/

var regextest = /(?:^|\s)(=?-?\d{1,5}\.?\d{0,8})\s?m(inute|inutes|in)\b/gmi;
var match = regextest.exec(current.text);
var numbertest = /-?\d{1,}\.?\d{0,}/;
var numbermatch = numbertest.exec(match[0]);
var minutetoseconds = (parseFloat(numbermatch[0]) * 60);
var originalnumber = parseFloat(numbermatch[0]).toFixed(2).toString().slice(-3) == '.00' ? parseFloat(numbermatch[0]).toFixed(2).toString().slice(0, -3) : parseFloat(numbermatch[0]).toFixed(2);
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, originalnumber + ' minute(s) is ' + minutetoseconds.toFixed(2) + ' seconds.');
