/*
activation_example:!1984
regex:^(!1984|!privacy)
flags:gi
*/

var Privacy = Class.create();
Privacy.prototype = {
    initialize: function(grChat) {
        this._init(grChat);
    },
    parse: function() {
        return this._parse();
    },

    _init: function(grChat) {
        this.grChat = grChat;
        var regex = /^(!1984|!privacy)/;
        this.objChat = {
            'channel': grChat.getValue('channel') || '',
            'text': grChat.getValue('text').replace(regex, '').trim() || '',
            'thread_ts': grChat.getValue('thread_ts') || '',
            'ts': grChat.getValue('ts') || '',
            'user': grChat.getValue('user') || '',
        };
        this.grUser = grChat.user.getRefRecord();
    },

    _getCount: function() {
        var gaChat = new GlideAggregate('x_snc_slackerbot_chat');
        gaChat.addQuery('user', this.grUser.getUniqueValue());
        gaChat.addAggregate('COUNT');
        gaChat.query();
        gaChat.next();
        var numCount = gaChat.getAggregate('COUNT') || 0;
        return numCount;
    },
    _getCountWords: function() {
		var strResult = '';
        var grChat = new GlideRecord('x_snc_slackerbot_chat');
        grChat.addQuery('user', this.grUser.getUniqueValue());
        grChat.query();
        while(grChat.next()) {
			strResult = strResult.concat(' ', grChat.getValue('text'));
		}
		var arrWords = strResult.split(' ');
		var objWords = {};
		for (var iWord = 0; iWord < arrWords.length; iWord++ ) {
			var strWord = arrWords[iWord];
			objWords[strWord] = objWords[strWord] || 0;
			objWords[strWord]++;
		}
		arrWords = Object.keys(objWords);
		var strResult1 = '', strResult2 = '', strResult3 = '';
		var numScore1 = 0, numScore2 = 0, numScore3 = 0;
		var numScore = 0;
		for (iWord = 0; iWord < arrWords.length; iWord++ ) {
			strWord = arrWords[iWord] || '';
			numScore = objWords[strWord] || 0;
			if (numScore > numScore3 && numScore < numScore2) {
				numScore3 = numScore;
				strResult3 = strWord;
			}
			if (numScore > numScore2 && numScore < numScore1) {
				numScore2 = numScore;
				strResult2 = strWord;
			}
			if (numScore > numScore1) {
				numScore1 = numScore;
				strResult1 = strWord;
			}			
		}
		strResult = ':first_place_medal: ' + strResult1 + ' (' + numScore1 + '), :second_place_medal: ' + strResult2 + ' (' + numScore2 + '), :third_place_medal: ' + strResult3 + ' (' + numScore3 + ')';
		return strResult;
    },
    _getDateMin: function() {
        var gaChat = new GlideAggregate('x_snc_slackerbot_chat');
        gaChat.addQuery('user', this.grUser.getUniqueValue());
        gaChat.addAggregate('MIN', 'sys_created_on');
        gaChat.query();
        gaChat.next();
        var strDate = gaChat.getAggregate('MIN', 'sys_created_on') || '<N/A>';
        return strDate;
    },

    _getLog: function() {
		var message = [];
        var Slacker = new x_snc_slackerbot.Slacker();
		message.push(':eye: 1984 : SlackerBot Privacy Report incoming...');
        var numCount = this._getCount();
        message.push('Total chat files: ' + numCount);
        var strDateMin = this._getDateMin();
        message.push(':rotating_light: First flagged up on the radar: ' + strDateMin);
        var strCountWords = this._getCountWords();
        message.push('Top 3 Words in your vocab: ' + strCountWords);	
		Slacker.send_chat(this.grChat, message.join("\n"), true);
		
		// Sign Out
		// Slacker.send_chat(this.grChat, ':eye: 1984 : SlackerBot - Remember I am always watching...', true);
    },

    _parse: function() {
        try {
            /*
			var strMessage = this.objChat.text; // utterance
            this.arrArguments = strMessage.split(' ');
            var strTypeObject = this.arrArguments[0] || '';
            switch (strTypeObject) {
                case 'log':
                    return this._getLog();
                default:
                return 'Thanks for using 1984! :thumbsup:\nUse: `!1984 log` to return a summary of your personal data that has been collected, processed and stored SlackerBot.';
            }
			*/
			return this._getLog();
        } catch (e) {
            gs.error("An error occured when SlackerBot tried to send a response back to Slack.\nError: " + e.name + ": " + e.message);
        }
    },


    type: 'Privacy'
};

new x_snc_slackerbot.Privacy(current).parse() || '';
