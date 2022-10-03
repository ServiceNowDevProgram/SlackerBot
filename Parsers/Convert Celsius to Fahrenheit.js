/*
activation_example:30c or 30 degrees celsius
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?c(?:elsius|elcius)?\b
flags:gmi
*/

var regextest = /(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?c(?:elsius|elcius)?\b/gmi;
var match = regextest.exec(current.text);
var numbertest = /-?\d{1,}\.?\d{0,}/;
var numbermatch = numbertest.exec(match[0]);
var ctof = (parseFloat(numbermatch[0]) * 9/5) + 32;
var originalnumber = parseFloat(numbermatch[0]).toFixed(2).toString().slice(-3) == '.00' ? parseFloat(numbermatch[0]).toFixed(2).toString().slice(0, -3) : parseFloat(numbermatch[0]).toFixed(2);
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, originalnumber + 'C is ' + ctof.toFixed(2) + ' degrees in freedom units (Fahrenheit).');
