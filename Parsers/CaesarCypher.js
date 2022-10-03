/*
activation_example:!caesar your sentence
regex:!caesar
flags:g
*/

var where = 0;

//Determine if the input was '!caesar'
where = current.text.indexOf('!caesar') + 8;

//Capture the term, and determine message
var term = current.text.substring(where).trim();
var msg = (term ? caesarString(term.toLowerCase()) : ':upside_down_face: !caesar *something*');

//Send the Slack message
var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);

function caesarString(aString) {
    var last = aString.length;
    var result = new Array(aString.length);
    for (var i = 0; i <= last; i++) {
        var c = aString.charCodeAt(i);
        if (c >= 97 && c <= 122) {
            c += 13; // ROT13 is used for Caesar cypher (shift)
            if (c > 122) {
                c -= 26;
            }
        }
        result[i] = String.fromCharCode(c);
    }
    return result.join('');
}
