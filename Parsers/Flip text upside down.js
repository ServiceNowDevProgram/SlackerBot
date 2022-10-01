/*
activation_example:!flip string
regex:(!flip|!invert)
flags:g
*/

var flipTable = {
    'a' : '\u0250',
    'b' : 'q',
    'c' : '\u0254', //open o -- from pne
    'd' : 'p',
    'e' : '\u01DD',
    'f' : '\u025F', //from pne
    'g' : '\u0183',
    'h' : '\u0265',
    'i' : '\u0131', //from pne
    'j' : '\u027E',
    'k' : '\u029E',
    //l : '\u0283',
    'm' : '\u026F',
    'n' : 'u',
    'p' : 'd',
    'q' : 'b',
    'r' : '\u0279',
    't' : '\u0287',
    'u' : 'n',
    'v' : '\u028C',
    'w' : '\u028D',
    'y' : '\u028E',
    '.' : '\u02D9',
    '[' : ']',
    '(' : ')',
    '{' : '}',
    '?' : '\u00BF', //from pne
    '!' : '\u00A1',
    "\'" : ',',
    '<' : '>',
    '_' : '\u203E',
    ';' : '\u061B',
    '\u203F' : '\u2040',
    '\u2045' : '\u2046',
    '\u2234' : '\u2235',
    '\r' : '\n' 
};

var where = 0;

//Boolean for whether or not we're flippin, bois
var flipFlag = (current.text.indexOf('!flip') > -1);

//Determine if the input was '!flip' or '!invert'
where = (flipFlag ? current.text.indexOf('!flip') + 6 : current.text.indexOf('!invert') + 8);

//Capture the term, and determine message
var term = current.text.substring(where).trim();
var msg = (term ? flipString(term.toLowerCase()) : ':upside_down_face: !flip or !invert *something*');

//Send the Slack message
var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);

function flipString(aString) {
    var last = aString.length - 1;

    var result = new Array(aString.length);
    for (var i = last; i >= 0; --i) {
        var c = aString.charAt(i);
        //If the character is in the table, flip it, otherwise, use the original
        var r = flipTable[c] ? flipTable[c] : c;
        result[last - i] = r != undefined ? r : c;
    }
    return result.join('');

}