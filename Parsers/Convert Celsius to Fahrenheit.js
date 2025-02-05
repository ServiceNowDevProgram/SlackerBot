/*
activation_example:30c or 30 degrees celsius
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?(?:c(?:elsius)?|f(?:ahrenheit)?)\b
flags:gmi
*/

const formatNumber = num => Number(num).toFixed(2).replace(/\.00$/, '');
const conversions = [];

// convert C to F
const celsiusRegex = /(-?\d{1,3}(?:\.\d{1,2})?)°?\s?(?:degrees?)?\s?c(?:elsius)?\b/gi;
const celsiusToFahrenheit = c => ((c * 9 / 5) + 32).toFixed(2);
let cMatch;
while ((cMatch = celsiusRegex.exec(current.text)) !== null) {
    const celsius = parseFloat(cMatch);
    const fahrenheit = celsiusToFahrenheit(celsius);
    conversions.push(`${formatNumber(celsius)}°C is ${formatNumber(fahrenheit)} degrees in freedom units (Fahrenheit).`);
}

// convert F to C
const fahrenheitRegex = /(-?\d{1,3}(?:\.\d{1,2})?)°?\s?(?:degrees?)?\s?f(?:ahrenheit)?\b/gi;
const fahrenheitToCelsius = f => ((f - 32) * 5 / 9).toFixed(2);
let fMatch;
while ((fMatch = fahrenheitRegex.exec(current.text)) !== null) {
    const fahrenheit = parseFloat(fMatch);
    const celsius = fahrenheitToCelsius(fahrenheit);
    conversions.push(`${formatNumber(fahrenheit)}°F is ${formatNumber(celsius)} degrees in sane units (Celsius).`);
}

const conversionMessage = conversions.join('\n');

new x_snc_slackerbot.Slacker().send_chat(current, conversionMessage);
