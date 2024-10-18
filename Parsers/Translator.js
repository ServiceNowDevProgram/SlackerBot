/*
activation_example:!translate Hello world to Spanish
regex:!translate\s+(.+?)\s+(?:to|into|in)\s+(\w+)$
flags:gi
*/

var regex = /!translate\s+(.+?)\s+(?:to|into|in)\s+(\w+)$/gi;
var match = regex.exec(current.text);

if (match && match[1] && match[2]) {
    var phrase = match[1].trim();
    var language = match[2].trim().toLowerCase();
    
    var languageMap = {
        'afrikaans': 'af',
        'arabic': 'ar',
        'chinese': 'zh',
        'dutch': 'nl',
        'french': 'fr',
        'german': 'de',
        'hindi': 'hi',
        'italian': 'it',
        'japanese': 'jpn',
        'korean': 'ko',
        'malay': 'my',
        'pakistani': 'ur',
        'portuguese': 'pt',
        'spanish': 'es',
        'turkish': 'tr'
    };

    var targetLanguageCode = languageMap[language];
    
    if (!targetLanguageCode) {
        new x_snc_slackerbot.Slacker().send_chat(current, 'Sorry, I do not support the language "' + language + '".', false);
        return;
    }

    var apiUrl = 'https://api.mymemory.translated.net/get';
    var requestBody = {
        'q': phrase,
        'langpair': 'en|' + targetLanguageCode
    };

    var restMessage = new sn_ws.RESTMessageV2();
    restMessage.setHttpMethod('GET');
    restMessage.setEndpoint(apiUrl + '?q=' + encodeURIComponent(phrase) + '&langpair=en|' + targetLanguageCode);
    
    try {
        var httpResponse = restMessage.execute();
        var httpResponseStatus = httpResponse.getStatusCode();

        if (httpResponseStatus === 200) {
            var translationData = JSON.parse(httpResponse.getBody());
            var translatedText = translationData.responseData.translatedText;
            var responseMessage = phrase + 'translated into ' + language + ' is:\n\n ' + translatedText;
            new x_snc_slackerbot.Slacker().send_chat(current, responseMessage, false);
        } else {
            new x_snc_slackerbot.Slacker().send_chat(current, 'Sorry, I could not translate the phrase "' + phrase + '" to ' + language + '.', false);
        }
    } catch (error) {
        new x_snc_slackerbot.Slacker().send_chat(current, 'There was an error with the translation service. Please try again later.', false);
    }
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format `!translate [phrase] to/into/in [language]` to translate text.', false);
}

