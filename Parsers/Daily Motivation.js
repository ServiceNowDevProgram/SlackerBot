/*
activation_example:!motivate
regex:!motivate
flags:gmi
order:100
stop_processing:false
*/

var quotes = [ //Add more number of quotes based on need
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Success is not the key to happiness. Happiness is the key to success. – Albert Schweitzer",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt"
];

var quote = quotes[Math.floor(Math.random() * quotes.length)];
new x_snc_slackerbot.Slacker().send_chat(current.channel, `Motivation: "${quote}"`, false, '', current.thread_ts);
