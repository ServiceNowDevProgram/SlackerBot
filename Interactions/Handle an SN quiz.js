/*
action_id_regex:quiz_answer_
parsers:Create a new SN Quiz
*/

(function (current) {
    var slackerProvider = new x_snc_slackerbot.Slacker();
    var interactionPayload = JSON.parse(current.getValue('payload'));

    // Get selected option, correct option, the user ID that initiated the quiz, and explanation
    var action = interactionPayload.actions[0];
    var selectedOption = action.value;
    var parts = selectedOption.split("|");
    var userSelection = parts[0];
    var correctOption = parts[1];
    var originalUserId = parts[2];
    var explanation = parts[3];

    // Verify if the interacting user is the same as the original user
    if (interactionPayload.user.id !== originalUserId) return;

    // Apply styles to each button based on whether it was selected and whether it's correct
    var blocks = interactionPayload.message.blocks;
    var correctIndex = parseInt(correctOption.split('_')[1]) - 1;

    blocks[1].elements.forEach(function (button, index) {
        if (userSelection === correctOption) {
            button.style = (index === correctIndex) ? "primary" : "danger";
        } else {
            if (button.value === selectedOption) {
                button.style = "danger";
            }
        }
    });

    var updateMessagePayload = {
        "channel": interactionPayload.channel.id,
        "ts": interactionPayload.message.ts,
        "blocks": blocks,
        "text": "UpdatingQuiz"
    };

    var responseMessageUpdated = slackerProvider.update_chat(updateMessagePayload);

    // Validate User Answer and send appropriate feedback
    var current = {
        "text": interactionPayload.message.blocks[0].text.text,
        "ts": interactionPayload.message.ts,
        "thread_ts": interactionPayload.container.message_ts,
        "channel": interactionPayload.channel.id,
        "user": {
            "user_id": interactionPayload.user.id,
            "name": interactionPayload.user.name
        }
    };

    var questionText = interactionPayload.message.blocks[0].text.text;
    var textLines = questionText.split("\n");
    var correctAnswerText = textLines[correctIndex + 4].trim();
    var correctAnswer = correctAnswerText.replace(/^[A-D]\)\s*/, '');

    if (userSelection === correctOption) {
        var correctMessage = "Well done! The correct answer is:\n*" + correctAnswer + "*\n\n" + explanation;
        slackerProvider.send_chat(current, correctMessage, false);
    } else {
        var incorrectMessage = "Oops, not quite! Try Again.";
        slackerProvider.send_chat(current, incorrectMessage, false);
    }
})(current);
