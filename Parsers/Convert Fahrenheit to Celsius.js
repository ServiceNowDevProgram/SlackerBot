/*
activation_example:30f or 30 degrees Fahrenheit
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?f(?:ahrenheit)?\b
flags:gmi
*/

var regextest = /(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?f(?:ahrenheit)?\b/gmi;
var numbertest = /-?\d{1,}\.?\d{0,}/;
var conversions = [];

var match;
while ((match = regextest.exec(current.text)) !== null) {
    var numbermatch = numbertest.exec(match[0]);
    var fahrenheit = parseFloat(numbermatch[0]);
    var celsius = (fahrenheit - 32) * 5/9;
    
    var originalNumber = fahrenheit.toFixed(2).toString().slice(-3) == '.00' ? 
        fahrenheit.toFixed(0) : fahrenheit.toFixed(2);
    
    conversions.push(originalNumber + '°F is ' + celsius.toFixed(2) + ' degrees in sane units (Celsius).');
    current.text = current.text.replace(match[0], celsius.toFixed(2) + '°C');
}
var conversionMessage = conversions.join('\n');
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, conversionMessage);
