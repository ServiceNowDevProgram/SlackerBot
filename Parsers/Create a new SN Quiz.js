(function(current) {
    var slacker = new x_snc_slackerbot.Slacker();

    // Capture the text and extract the quiz topic using regex
    var text = current.text;
    var match = text.match(/!quiz\s+(.+)/i);

    if (!match) {
        slacker.send_chat(current, "Please provide a valid quiz topic, e.g., !quiz ITSM.", false);
        return;
    }

    var quizTopic = match[1].trim();
    slacker.send_chat(current, "Generating a quiz question on the topic: " + quizTopic, false);

    var apiKey = gs.getProperty("openai.key");

    // Set up the REST message to call the OpenAI API
    var restMessage = new sn_ws.RESTMessageV2();
    restMessage.setEndpoint('https://api.openai.com/v1/chat/completions');
    restMessage.setHttpMethod('POST');

    // Set the necessary headers for the API request
    restMessage.setRequestHeader('Authorization', 'Bearer ' + apiKey);
    restMessage.setRequestHeader('Content-Type', 'application/json');

    // Define the request body to generate the quiz
    var requestBody = {
        "model": "gpt-4",
        "messages": [{
                "role": "system",
                "content": "You are an assistant that creates structured multiple-choice quiz questions about ServiceNow topics. Return the question and answers in JSON format."
            },
            {
                "role": "user",
                "content": "Please generate one multiple-choice quiz question on the topic of " + quizTopic + ". Return the result in the following JSON format:\n{\n  \"question\": \"<question text>\",\n  \"answers\": [\"option 1\", \"option 2\", \"option 3\", \"option 4\"],\n  \"correct\": \"<correct answer>\",\n  \"explanation\": \"<why this option is correct>\"\n}"
            }
        ],
        "max_tokens": 200
    };

    // Send the request to the OpenAI API
    restMessage.setRequestBody(JSON.stringify(requestBody));
    var response = restMessage.execute();
    var responseBody = response.getBody();
    var jsonResponse = JSON.parse(responseBody);

    // Extract quiz question and answers
    var quizData = jsonResponse.choices[0].message.content;
    var quizQuestion = JSON.parse(quizData);

    // Find the index of the correct answer by comparing the text of the correct answer
    var correctOptionIndex = "";
    quizQuestion.answers.forEach(function(answer, index) {
        if (answer === quizQuestion.correct) {
            correctOptionIndex = "option_" + (index + 1);  // e.g., "option_1"
        }
    });

    // Prepare Slack Block Kit for the quiz question and answers
    var blocks = [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Question:* " + quizQuestion.question
            }
        },
        {
            "type": "actions",
            "elements": quizQuestion.answers.map(function(answer, index) {
                return {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": answer
                    },
                    "value": "option_" + (index + 1) + "|" + correctOptionIndex, // Correct option index, not the text
                    "action_id": "quiz_answer_" + (index + 1)
                };
            })
        }
    ];

    // Send the question and options to Slack
    slacker.send_chat(current, {
        "blocks": blocks
    }, false);

})(current);
