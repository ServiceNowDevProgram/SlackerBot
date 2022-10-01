/*
activation_example:!zalgo string
regex:(!zalgo|!curse)
flags:gm
*/

var zalgoFlag = (current.text.indexOf('!zalgo') > -1);

//Determine substring
var where = (current.text.indexOf((zalgoFlag ? '!zalgo' : '!curse') + 7));

//Get the term
var term = current.text.substring(where).trim();

//The long string for when users don't specify a term
var badInputStr = 'yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding. yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding. yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding. yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding. yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding. yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding. yoU HaVe MIsused tHe ZalGo CompilER and noW i, tHe BeaST of SErvICENoW HaS BeEN SumMoneD TO Do your bIdding.\n\njust kidding, you need to include something after !zalgo or !curse for it to work';

var msg = (term ? zalgo_textarea(term) : badInputStr);

var sendIt = new x_snc_slackerbot.Slacker().send_chat(current, msg, false);

var zalgo_mid = [
    '\u0315', /*     ̕     */		'\u031b', /*     ̛     */		'\u0340', /*     ̀     */		'\u0341', /*     ́     */
    '\u0358', /*     ͘     */		'\u0321', /*     ̡     */		'\u0322', /*     ̢     */		'\u0327', /*     ̧     */
    '\u0328', /*     ̨     */		'\u0334', /*     ̴     */		'\u0335', /*     ̵     */		'\u0336', /*     ̶     */
    '\u034f', /*     ͏     */		'\u035c', /*     ͜     */		'\u035d', /*     ͝     */		'\u035e', /*     ͞     */
    '\u035f', /*     ͟     */		'\u0360', /*     ͠     */		'\u0362', /*     ͢     */		'\u0338', /*     ̸     */
    '\u0337', /*     ̷     */		'\u0361' /*     ͡     */	
];

function flipString(aString) {
    var last = aString.length - 1;

    var result = new Array(aString.length);
    for (var i = last; i >= 0; --i) {
        var c = aString.charAt(i);
        var r = flipTable[c];
        result[last - i] = r != undefined ? r : c;
    }
    return result.join('');

}

// rand funcs
//---------------------------------------------------

//gets an int between 0 and max
function rand(max)
{
    return Math.floor(Math.random() * max);
}

//gets a random char from a zalgo char table
function rand_zalgo(array)
{
    var ind = Math.floor(Math.random() * array.length);
    return array[ind];
}

//lookup char to know if its a zalgo char or not
function is_zalgo_char(c)
{
    var i;
    for(i=0; i<zalgo_mid.length; i++)
        if(c == zalgo_mid[i])
            return true;
    return false;
}

// main shit
//---------------------------------------------------
function zalgo_textarea(text)
{
    var return_this = '';
    var txt = text;
    var newtxt = '';

    for(var i=0; i<txt.length; i++)
    {
        if(is_zalgo_char(txt.substr(i, 1)))
            continue;

        //add the normal character
        newtxt += txt.substr(i, 1);

        var num_mid = rand(2);

        for(var j=0; j<num_mid; j++){
            newtxt += rand_zalgo(zalgo_mid);
        }
    }
    return newtxt;
}