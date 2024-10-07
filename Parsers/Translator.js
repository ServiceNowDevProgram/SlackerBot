/*
activation_example:!translate Hello world to Spanish
regex:!translate\s+(.+)\s+to\s+(\w+)
flags:gi
order:500
stop_processing:false
*/

var regex = /!translate\s+(.+)\s+to\s+(\w+)/gi;
var match = regex.exec(current.text);
if (match && match[1] && match[2]) {
    var phrase = match[1].trim();
    var language = match[2].trim().toLowerCase();
    var languageMap = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
        'italian': 'it',
        // Add more languages as needed
    };

    var targetLanguageCode = languageMap[language];
    if (!targetLanguageCode) {
        new x_snc_slackerbot.Slacker().send_chat(current, 'Sorry, I do not support the language "' + language + '".', false);
        return;
    }

    var apiUrl = 'https://libretranslate.de/translate';
    var requestBody = {
        'q': phrase,
        'source': 'en',
        'target': targetLanguageCode,
        'format': 'text'
    };

    // Make an API call to the translation service
    var restMessage = new sn_ws.RESTMessageV2();
    restMessage.setHttpMethod('POST');
    restMessage.setEndpoint(apiUrl);
    restMessage.setRequestHeader('Content-Type', 'application/json');
    restMessage.setRequestHeader('Accept', 'application/json');
    restMessage.setRequestBody(JSON.stringify(requestBody));
    
    try {
        var httpResponse = restMessage.execute();
        var httpResponseStatus = httpResponse.getStatusCode();
        
        if (httpResponseStatus === 200) {
            var translationData = JSON.parse(httpResponse.getBody());
            var translatedText = translationData.translatedText;
            var responseMessage = 'The translation of "' + phrase + '" to ' + language + ' is: ' + translatedText;
            new x_snc_slackerbot.Slacker().send_chat(current, responseMessage, false);
        } else {
            new x_snc_slackerbot.Slacker().send_chat(current, 'Sorry, I could not translate the phrase "' + phrase + '" to ' + language + '.', false);
        }
    } catch (error) {
        new x_snc_slackerbot.Slacker().send_chat(current, 'There was an error with the translation service. Please try again later.', false);
    }
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format `!translate [phrase] to [language]` to translate text.', false);
}
