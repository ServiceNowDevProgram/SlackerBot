/*
activation_example:!lorem 10 words/paras/bytes
regex:!lorem
flags:gmi
*/

// Use the lipsum generator to generate Lorem Ipsum dummy paragraphs / words / bytes.	
// @param what in ['paras','words','bytes'], default: 'paras'
// @param amount of paras/words/bytes, default: 2 (for words minimum is 5, for bytes it is 27)
// @param start always start with 'Lorem Ipsum', default = true
// activation_example: !lorem 10 words||paras||bytes	

var wordCount = current.text.replace('!lorem','').trim().split(' ');

if (!wordCount[0] && !wordCount[1]) wordCount[0] = '1';

var textAmount = wordCount[0];
var textType = wordCount[1];

// Add limits to the amount of text that can be requested
var MAX_PARAS = 5;
var MAX_WORDS = 500;
var MAX_BYTES = 5000;

if ((!textType || textType === 'paras') && textAmount > MAX_PARAS) {
    textAmount = MAX_PARAS;
} else if (textType === 'words' && textAmount > MAX_WORDS) {
    textAmount = MAX_WORDS;
} else if (textType === 'bytes' && textAmount > MAX_BYTES) {
    textAmount = MAX_BYTES;
}

var rm = new sn_ws.RESTMessageV2();
rm.setHttpMethod('GET');
rm.setLogLevel('all');
rm.setEndpoint('https://www.lipsum.com/feed/json?start=yes&amount=' + textAmount + '&what=' +  textType);
var response = rm.execute();
var response_body = JSON.parse(response.getBody());
var loremText = response_body.feed.lipsum;

new x_snc_slackerbot.Slacker().send_chat(current, loremText, true);
