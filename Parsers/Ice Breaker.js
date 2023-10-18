/*
activation_example:!ice breaker, !icebreaker
regex:!(ice breaker|icebreaker)
flag:gmi
*/

var ice_breakers = [
    {
        prompt: "How many siblings do you have?"
    }, {
        prompt: "What's your favorite movie?"
    }, {
        prompt: "What do you do for fun?"
    }, {
        prompt: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?"
    }, {
        prompt: "What's your name, and is there a story behind it?"
    }, {
        prompt: "Where are you from originally?"
    }, {
        prompt: "Do you have any siblings, and if so, where are you in the birth order?"
    }, {
        prompt: "What's your favorite way to spend the weekend?"
    }, {
        prompt: "Do you have any pets? Tell me about them."
    }, {
        prompt: "If you could travel anywhere in the world, where would you go?"
    }, {
        prompt: "What's your favorite book or movie, and why?"
    }, {
        prompt: "What's the most interesting thing you've done recently?"
    }, {
        prompt: "If you could have any job in the world for one week, what would it be?"
    }, {
        prompt: "What are your hobbies or favorite pastimes?"
    }, {
        prompt: "Are there any special talents or skills you have?"
    }, {
        prompt: "If you could learn any new skill, what would it be?"
    }, {
        prompt: "What's your favorite cuisine or type of food?"
    }, {
        prompt: "Do you prefer beach vacations or exploring new cities?"
    }, {
        prompt: "If you could travel to any historical era, when and where would you go?"
    }, {
        prompt: "What's on your travel bucket list?"
    }, {
        prompt: "If you could have a conversation with any historical figure, who would it be?"
    }, {
        prompt: "What's the best piece of advice you've ever received?"
    }, {
        prompt: "How would you define success?"
    }, {
        prompt: "If you could have any superpower, what would it be?"
    }, {
        prompt: "If you were a character in a book or movie, who would you be?"
    }, {
        prompt: "If you could create a new holiday, what would it be about?"
    }, 
];

var random = Math.floor(Math.random() * ice_breakers.length);

//Send the ice breaker prompt to Slack
new x_snc_slackerbot.Slacker().send_chat(current, ice_breakers[random].prompt, false);

//This should add the cold_face emoji and spell out ice breaker with the laser letters
new x_snc_slackerbot.Slacker().send_reaction(current, 'cold_face');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-i');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-c');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-e');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-b');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-r');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-e');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-a');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-k');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-e');
new x_snc_slackerbot.Slacker().send_reaction(current, 'laser-r');
