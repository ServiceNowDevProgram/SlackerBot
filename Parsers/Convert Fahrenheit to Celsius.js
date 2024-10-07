/*
activation_example:30f or 30 degrees Fahrenheit
regex:(?:^|\s)(-?\d{1,3}\.?\d{0,2})°?\s?(?:degrees)?\s?f(?:ahrenheit)?\b
flags:gmi
*/

const regexTest = /(-?\d{1,3}(?:\.\d{1,2})?)°?\s?(?:degrees?)?\s?f(?:ahrenheit)?\b/gi;
const fahrenheitToCelsius = f => ((f - 32) * 5 / 9).toFixed(2);
const formatNumber = num => Number(num).toFixed(2).replace(/\.00$/, '');
const conversions = [];

current.text = current.text.replace(regexTest, (match, f) => {
  const celsius = fahrenheitToCelsius(f);
  const formattedF = formatNumber(f);
  conversions.push(`${formattedF}°F is ${celsius} degrees in sane units (Celsius).`);
  return `${celsius}°C`;
});

const conversionMessage = conversions.join('\n');

new x_snc_slackerbot.Slacker().send_chat(current, conversionMessage);
