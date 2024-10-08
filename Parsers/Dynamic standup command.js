/*
activation_example: !standup
regex: !standup
flags: gmi
order: 107
stop_processing: true
active: true
*/

var standupResponses = {}; // Store responses by user

if (current.text.match(/!standup/)) {
    // Prompt the user for their standup response
    new x_snc_slackerbot.Slacker().send_chat(current, 'What are you working on today? Please reply with your update.', false);
} else if (current.reply_to) {
    // Check if this is a reply to the prompt
    var userId = current.user; // Get the user ID
    var response = current.text; // Get the user’s response
    standupResponses[userId] = response; // Store the response
    
    new x_snc_slackerbot.Slacker().send_chat(current, `Thank you! Your standup response has been recorded: "${response}"`, false);
}
