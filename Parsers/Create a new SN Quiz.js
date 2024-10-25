/*
activation_example:!quiz itsm
regex:!quiz\s+(.+)
flags:gmi
*/

(function(current) {
    var slacker = new x_snc_slackerbot.Slacker();

    // Capture the text and extract the quiz topic using regex
    var text = current.text;
    var match = text.match(/!quiz\s+(.+)/i);

    if (!match) {
        slacker.send_chat(current, "Please provide a valid ServiceNow quiz topic, e.g., !quiz ITSM.", false);
        return;
    }

    var quizTopic = match[1].trim();
    var originalUserId = current.user.user_id;

    try {
        // Openai Integration - Generate Quiz
        var apiKey = gs.getProperty("openai.key");

        var restMessage = new sn_ws.RESTMessageV2();
        restMessage.setEndpoint('https://api.openai.com/v1/chat/completions');
        restMessage.setHttpMethod('POST');
        restMessage.setRequestHeader('Authorization', 'Bearer ' + apiKey);
        restMessage.setRequestHeader('Content-Type', 'application/json');

        var requestBody = {
            "model": "gpt-4o",
            "messages": [{
                    "role": "system",
                    "content": "You are an assistant that creates structured multiple-choice quiz questions about ServiceNow topics. Return the question and answers in JSON format."
                },
                {
                    "role": "user",
                    "content": "Please generate one multiple-choice quiz question on the topic of " + quizTopic + ". The answers should not include any prefixes like 'A)', '1.', etc. Just provide the plain answer text. Return the result in the following JSON format:\n{\n  \"question\": \"<question text>\",\n  \"answers\": [\"option 1\", \"option 2\", \"option 3\", \"option 4\"],\n  \"correct\": \"<correct answer>\",\n  \"explanation\": \"<why this option is correct>\"\n}"
                }
            ],
            "max_tokens": 200
        };


        restMessage.setRequestBody(JSON.stringify(requestBody));
        var response = restMessage.execute();

        if (response.getStatusCode() !== 200) {
            throw new Error('Received non-200 response from OpenAI: ' + response.getStatusCode());
        }

        var responseBody = response.getBody();
        var jsonResponse = JSON.parse(responseBody);

        if (!jsonResponse.choices || !jsonResponse.choices[0].message || !jsonResponse.choices[0].message.content) {
            throw new Error('Unexpected response format from OpenAI');
        }

        var quizData = jsonResponse.choices[0].message.content;
        var quizQuestion = JSON.parse(quizData);

        // Find the correct answer
        var correctOptionIndex = "";
        quizQuestion.answers.forEach(function(answer, index) {
            if (answer === quizQuestion.correct) {
                correctOptionIndex = "option_" + (index + 1);
            }
        });

        // Prepare Slack Block Kit for the quiz question and answers
        var optionLetters = ['A', 'B', 'C', 'D'];
        var blocks = [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Hello, " + current.user.name + "! Test your ServiceNow skills and have fun! \n\n" +
                        "*Question:* " + quizQuestion.question + "\n\n" +
                        optionLetters[0] + ") " + quizQuestion.answers[0] + "\n" +
                        optionLetters[1] + ") " + quizQuestion.answers[1] + "\n" +
                        optionLetters[2] + ") " + quizQuestion.answers[2] + "\n" +
                        optionLetters[3] + ") " + quizQuestion.answers[3] + "\n\n" +
                        "_*Note:* Only the person who initiated the quiz can answer._"
                }
            },
            {
                "type": "actions",
                "elements": quizQuestion.answers.map(function(answer, index) {
                    return {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": optionLetters[index]
                        },

                        "value": "option_" + (index + 1) + "|" + correctOptionIndex + "|" + originalUserId + "|" + quizQuestion.explanation,
                        "action_id": "quiz_answer_" + (index + 1)
                    };
                })
            }
        ];

        // Send Slack message - Quiz
        slacker.send_chat(current, {
            "blocks": blocks
        }, false);

    } catch (error) {
        gs.error('[SLACKER - QUIZ] Error generating quiz: ' + error.message);
        slacker.send_chat(current, "Sorry, there was an issue generating the quiz. Please try again later.", false);
    }

})(current);
