/*
activation_example:30f or 30 degrees Fahrenheit
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?f(?:ahrenheit)?\b
flags:gmi
*/

var regextest = /(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?f(?:ahrenheit)?\b/gmi;
var match = regextest.exec(current.text);
var numbertest = /-?\d{1,}\.?\d{0,}/;
var numbermatch = numbertest.exec(match[0]);
var ftoc = (parseFloat(numbermatch[0]) - 32) * 5/9;
var originalnumber = parseFloat(numbermatch[0]).toFixed(2).toString().slice(-3) == '.00' ? parseFloat(numbermatch[0]).toFixed(2).toString().slice(0, -3) : parseFloat(numbermatch[0]).toFixed(2);
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, originalnumber + 'C is ' + ftoc.toFixed(2) + ' degrees in sane units (Celsius).');
