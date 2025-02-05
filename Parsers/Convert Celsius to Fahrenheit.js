/*
activation_example:30c or 30 degrees celsius
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?c(?:elsius|elcius)?\b
flags:gmi
*/

const regexTest = /(-?\d{1,3}(?:\.\d{1,2})?)°?\s?(?:degrees?)?\s?c(?:elsius)?\b/gi;
const celsiusToFahrenheit = c => ((c * 9 / 5) + 32).toFixed(2);
const formatNumber = num => Number(num).toFixed(2).replace(/\.00$/, '');
const conversions = [];,

let match;
while ((match = regexTest.exec(current.text)) !== null) {
    const celsius = parseFloat(match);
    const fahrenheit = celsiusToFahrenheit(celsius);
    conversions.push(`${formatNumber(celsius)}°C is ${formatNumber(fahrenheit)} degrees in sane units (Fahrenheit).`);
}

const conversionMessage = conversions.join('\n');

new x_snc_slackerbot.Slacker().send_chat(current, conversionMessage);
