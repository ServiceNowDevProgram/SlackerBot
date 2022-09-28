/*
activation_example:!xkcd wisdom of the ancients
regex:!xkcd
flags:
*/

var search = gs.urlEncode(current.text.replace(/!xkcd/,'').trim());

var rm = new sn_ws.RESTMessageV2();
rm.setHttpMethod('GET');
rm.setEndpoint('https://www.explainxkcd.com/wiki/index.php?&title=Special%3ASearch&go=Go&fulltext=1&search=' + search );
rm.setRequestHeader('User-Agent', 'servicenow');
var response = rm.execute();
var body = response.getBody();
var result = body.match(/(?:<a href="\/wiki\/index.php\/)[0-9]+/gm)[0].replace(/<a href="\/wiki\/index.php\//g,''); 

if (parseInt(result)){
    var rm2 = new sn_ws.RESTMessageV2();
    rm2.setHttpMethod('GET');
    rm2.setEndpoint('https://xkcd.com/' + result + '/info.0.json');
    rm2.setRequestHeader('User-Agent', 'servicenow');
    var response2 = rm2.execute();
    var body2 = JSON.parse(response2.getBody());
    var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, body2.safe_title + '\n' + body2.img + '\nAlt: ' + body2.alt, false);
} else {
    var send_chat2 = new x_snc_slackerbot.Slacker().send_chat(current, 'No relevant XKCD found for `' + search +'`', false);
}