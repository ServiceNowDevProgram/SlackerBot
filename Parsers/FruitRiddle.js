/*
activation_example:!fruit riddle start
regex:^fruit riddle.*$
flags:gmi
*/


/**
 * Main variable: current, which is a record from the x_snc_slackerbot_chat table
 * Important attributes:
 *  - Text (text)
 *  - User (user)
 *  - Channel (channel)
 *  - Channel (thread_ts)
 */

var FruitRiddle = Class.create();
FruitRiddle.prototype = {

    initialize: function(currentChatContext) {

		// Available commands
		this.CMD_START = "start";
		this.CMD_EXIT = "exit";
		this.CMD_SOLUTION = "solution";

		this.user = currentChatContext.getDisplayValue("user");
		this.channel = currentChatContext.getValue("channel");
		this.text = currentChatContext.getValue("text");
		this.threadTs = currentChatContext.getValue("thread_ts");
		this.isThread = !gs.nil(this.threadTs); // The current message is in thread or not

		this.fruits = ["apple", "banana", "orange", "mango", "strawberry", "blueberry", "raspberry", "pineapple", "watermelon", "papaya", "kiwi", "peach", "pear", "grape", "cherry", "pomegranate", "lemon", "lime", "coconut", "avocado", "fig", "plum", "nectarine", "apricot", "dragonfruit", "grapefruit", "persimmon", "guava", "jackfruit", "lychee"];
    },

	parse: function() {

		// Need to check the text at first
		// Only the following commands are allowed
		var textRegex = /^(!fruit riddle|!fruit riddle start|!fruit riddle exit|!fruit riddle solution [a-zA-Z]*|!fruit riddle [a-zA-Z]{4})$/g;

		if (this.text.match(textRegex)) {

			if (this.text == "!fruit riddle" && !this.isThread) {
				return {
						thread: this.isThread,
						message: `This is a simple game, where I think of a fruit, and you have to guess it. You can start the game with the command: 

						!fruit riddle start
						
To submit a guess, use the following command: 

						!fruit riddle abcd

If you know the answer, type: 

						!fruit riddle fruit

If you want to give up, use the message: 

						!fruit riddle exit

Have fun :smile:`
					};
			}
			else if (this.text == "!fruit riddle" && this.isThread) {
				return {
						thread: this.isThread,
						message: "Please use one of the input commands, such as solve, exit or guess letter"
					};
			}

			// Need to get the 3rd word from the command
			var command = this.text.split(" ")[2];

			if (this.isThread) {
				// The message is in a thread
				if (command === this.CMD_START) {
					return {
						thread: true,
						message: "The fruit riddle start command cannot be used in thread."
					};
				}
				else if (command === this.CMD_EXIT) {
					return {
						thread: true,
						message: `😮 
${this.user}!! So you give up...I wouldn't have thought that about you.`
					};
				}
				else if (command === this.CMD_SOLUTION) {

					var solution = this.text.split(" ")[3];
					var selectedFruit = this._getRandomFruit();

					if (solution === selectedFruit) {
						return {
							thread: true,
							message: "Exactly! Congratulations! 🥳"
						};
					} 

					return {
						thread: true,
						message: "Well, you missed it. Try again."
					};
				}
				else {
					// The letters

					var letters = command.split('');
					var result = this._revealLetters(this._getRandomFruit(), letters);

					return {
						thread: true,
						message: `Here we go:  ${result}`
					};
				}
			}
			else {
				// The messasge is not part of a thread
				if (command === this.CMD_START) {
					return {
						thread: true,
						message: `Hey *${this.user}!* Do you want to play? 

I think of a fruit, and you have to guess what it is. You can provide four letters at a time in the following format: 
!fruit riddle abcd

If you know the answer, use this command: 
!fruit riddle solution orange

If you give up, type: 
!fruit riddle exit
						
Let's start! 💪`
					};
				}
				else if (command === this.CMD_EXIT || command === this.CMD_SOLUTION) {
					return {
						thread: false,
						message: `The ${command} command cannot be used outside of the thread.`
					};
				}
				else {
					// The letters
					return {
						thread: false,
						message: "This game cannot be plaed outside of the thread."
					};
				}
			}
		}

		return {
			thread: this.isThread,
			message: "I can't interpret this command."
		};
	},

	/**
	 * This function is responsible for get a random fruit from the array. The random number is based on the thread time.
	 * @return - one element from the fruit array
	 */
	_getRandomFruit: function() {
		var _threadTs = (this.threadTs + "").split(".")[1];
		var randomNumber = _threadTs % 30;
		return this.fruits[randomNumber];
	},

	/**
	 * This function is responsible to check if the given letters are part of the fruit or not
	 * @param {string} fruit - The current fruit
	 * @param {string} letters - The four letters which were added by the uyer
	 * @return - If there are letters witch match it will be given back in correct position. Other ones will be masked with the '_' character. 
	 */
	_revealLetters: function(fruit, letters) {
		return fruit.split('').map(char => {
			// Check if the character is in the letters array
			return letters.includes(char) ? char : '_';
		}).join('');
	},

	type: 'FruitRiddle'
};

var gameResultObj = new x_snc_slackerbot.FruitRiddle(current).parse();
try {
    new x_snc_slackerbot.Slacker().send_chat(current, gameResultObj.message, gameResultObj.thread);
}
catch( e ) {
    gs.error( "An error occured when SlackerBot tried to send a response back to Slack.\nError: " + e.name + ": " + e.message );
}
