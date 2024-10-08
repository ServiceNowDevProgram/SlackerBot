/*
activation_example: !poll [question] with [option1], [option2], ...
regex: !poll (.+) with (.+)
flags: gmi
order: 102
stop_processing: true
active: true
*/

// In-memory storage for polls (you could use a database for persistence)
var polls = {};

// Command to create a poll
var matches = current.text.match(/!poll (.+) with (.+)/);
if (matches) {
    var question = matches[1];
    var options = matches[2].split(',').map(opt => opt.trim());

    // Create a unique ID for the poll
    var pollId = `poll_${Date.now()}`;

    // Store the poll details
    polls[pollId] = {
        question: question,
        options: options,
        votes: Array(options.length).fill(0) // Initialize votes to 0
    };

    // Display the poll
    var pollMessage = `Poll created: "${question}"\nOptions:\n`;
    options.forEach((option, index) => {
        pollMessage += `${index + 1}: ${option}\n`;
    });
    pollMessage += `Vote by using !vote [poll_id] [option_number]`;

    new x_snc_slackerbot.Slacker().send_chat(current, pollMessage, false);
} else if (current.text.match(/!vote (\S+) (\d+)/)) {
    // Command to vote on an existing poll
    var voteMatches = current.text.match(/!vote (\S+) (\d+)/);
    var pollId = voteMatches[1];
    var optionIndex = parseInt(voteMatches[2], 10) - 1;

    if (polls[pollId]) {
        if (optionIndex >= 0 && optionIndex < polls[pollId].options.length) {
            polls[pollId].votes[optionIndex]++; // Increment the vote count
            new x_snc_slackerbot.Slacker().send_chat(current, `Thanks for voting! Your vote has been counted for "${polls[pollId].options[optionIndex]}".`, false);
        } else {
            new x_snc_slackerbot.Slacker().send_chat(current, 'Invalid option number. Please try again.', true);
        }
    } else {
        new x_snc_slackerbot.Slacker().send_chat(current, 'Poll ID not found. Please check the ID and try again.', true);
    }
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, 'Please use the format: !poll [question] with [option1], [option2], ...', true);
}
