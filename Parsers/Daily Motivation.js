/*
activation_example:!motivate
regex:!motivate
flags:gmi
order:100
stop_processing:false
*/

try {
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint('https://api.quotable.io/random'); // Replace with your preferred API URL
    request.setHttpMethod('GET');
    
    var response = request.execute();
    var responseBody = response.getBody();
    var responseData = JSON.parse(responseBody);
    
    var quote = `"${responseData.content}" – ${responseData.author}`;
} catch (error) {
    // Fallback to a static quote in case of an error
    var quotes = [
        "The only way to do great work is to love what you do. – Steve Jobs",
        "Success is not the key to happiness. Happiness is the key to success. – Albert Schweitzer",
        "Believe you can and you're halfway there. – Theodore Roosevelt",
        "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
        "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
        "Act as if what you do makes a difference. It does. – William James",
        "Success is not how high you have climbed, but how you make a positive difference to the world. – Roy T. Bennett",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
        "It always seems impossible until it's done. – Nelson Mandela",
        "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
        "You do not find the happy life. You make it. – Camilla Eyring Kimball",
        "Success is getting what you want, happiness is wanting what you get. – W.P. Kinsella",
        "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
        "If you want to walk fast, walk alone. But if you want to walk far, walk together. – Ratan Tata"
    ];
    quote = quotes[Math.floor(Math.random() * quotes.length)];
}

new x_snc_slackerbot.Slacker().send_chat(current.channel, `Motivation: "${quote}"`, false, '', current.thread_ts);
