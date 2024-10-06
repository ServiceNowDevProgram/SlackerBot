/*
activation_example:30c or 30 degrees celsius
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?c(?:elsius|elcius)?\b
flags:gmi
*/

var regextest = /(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?c(?:elsius|elcius)?\b/gmi;
var numbertest = /-?\d{1,}\.?\d{0,}/;
var conversions = [];

var match;
while ((match = regextest.exec(current.text)) !== null) {
    var numbermatch = numbertest.exec(match[0]);
    var celsius = parseFloat(numbermatch[0]);
    var fahrenheit = (celsius * 9/5) + 32;
    
    var originalNumber = celsius.toFixed(2).toString().slice(-3) == '.00' ? 
        celsius.toFixed(0) : celsius.toFixed(2);
    
    conversions.push(originalNumber + '°C is ' + fahrenheit.toFixed(2) + ' degrees in freedom units (Fahrenheit).');
  
    current.text = current.text.replace(match[0], fahrenheit.toFixed(2) + '°F');
}

var conversionMessage = conversions.join('\n');
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, conversionMessage);
