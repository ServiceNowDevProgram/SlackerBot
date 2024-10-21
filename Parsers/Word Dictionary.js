/*
activation_example:!dictionary type a word
regex:!dictionary
flags:gmi
order:200
stop_processing:false
*/

var word = current.text.replace(/!dictionary/gmi, "").trim();
if (word == '') {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please type a word', false);
} else {
    var regex = /[0-9!@#$%^&*(),.?":{}|<>]/;
    if (regex.test(word)) {
        new x_snc_slackerbot.Slacker().send_chat(current, 'Please type a word with only characters', false);
    } else {
        var wordsArray = word.split(" ");
        var firstWord = wordsArray[0];
		
        var dictionary = new sn_ws.RESTMessageV2();
        dictionary.setEndpoint('https://api.dictionaryapi.dev/api/v2/entries/en/' + firstWord);
        dictionary.setHttpMethod("GET");
        dictionary.setRequestHeader("Accept", "application/json");
        var response = dictionary.execute();
        var responseBody = response.getBody();
        var statuscode = response.getStatusCode();
        var responseJson = JSON.parse(responseBody);
        var sendsentence = "";
        if (statuscode == 200) {
            var meaning = responseJson[0].meanings[0].definitions[0].definition;
            sendsentence = firstWord + ': ' + meaning;
        } else {
            sendsentence = "Sorry pal, we couldn't find definitions for the word you were looking for.";
        }
        new x_snc_slackerbot.Slacker().send_chat(current, sendsentence, false);
    }
}
