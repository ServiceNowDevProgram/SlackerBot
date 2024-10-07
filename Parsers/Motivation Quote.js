/*
activation_example: !quote
regex: !quote
flags: gmi
order: 100
stop_processing: true
*/

const quotes = [
    "Believe in yourself and all that you are.",
    "The only way to do great work is to love what you do.",
    "Success is not the key to happiness. Happiness is the key to success."
];

if (current.text === '!quote') {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    new x_snc_slackerbot.Slacker().send_chat(current, randomQuote, false);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !quote to get a motivational quote.', true);
}
