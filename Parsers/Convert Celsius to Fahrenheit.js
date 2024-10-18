/*
activation_example:30c or 30 degrees celsius
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?c(?:elsius|elcius)?\b
flags:gmi
*/

const regexTest = /(-?\d{1,3}(?:\.\d{1,2})?)°?\s?(?:degrees?)?\s?c(?:elsius)?\b/gi;
const celsiusToFahrenheit = c => ((c * 9 / 5) + 32).toFixed(2);
const formatNumber = num => Number(num).toFixed(2).replace(/\.00$/, '');
const conversions = [];

current.text = current.text.replace(regexTest, (match, c) => {
  const fahrenheit = celsiusToFahrenheit(c);
  const formattedC = formatNumber(c);
  conversions.push(`${formattedC}°C is ${fahrenheit} degrees in freedom units (Fahrenheit).`);
  return `${fahrenheit}°F`;
});

const conversionMessage = conversions.join('\n');

new x_snc_slackerbot.Slacker().send_chat(current, conversionMessage);
