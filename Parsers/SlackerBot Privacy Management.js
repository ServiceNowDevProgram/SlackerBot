/*
activation_example:!privacy
regex:^(!privacy|!1984)
flags:gi
*/

var Privacy = Class.create();
Privacy.prototype = {
    initialize: function(grChat) {
        this._init(grChat);
		this.privacyNotice = "*SlackerBot Privacy Notice*\nThis privacy notice relates to the information being processed when interacting with SlackerBot. You can also review the Slack general privacy at https://slack.com/trust/privacy/privacy-policy\n\n*SlackerBot* currently collects and processes the following information for every message you post to this channel, including replies to threads and reactions:\n:point_right: Slack Team ID\n:point_right: Slack Channel ID\n:point_right: Slack User ID\n:point_right: Slack User Name\n:point_right: Message timestamp\n:point_right: Message text \n:point_right: Reaction(s)\n\n*How we get the personal information and why we have it*\nMost of the personal information we process is provided to us directly by you for one of the following reasons:\n:point_right: You posted a message or replied to a message within any channel where SlackerBot is installed\n\n*We use the information that you have given us in order to*\n:point_right: Parse the message and respond according to the SlackerBot desired process (known as Parsers). Use `!help` for more information on Parsers\n\n*We may share the information we collect with ServiceNow*\n\n*Under the UK & EU General Data Protection Regulation (UK/EU GDPR), the lawful bases we rely on for processing this information are:*\n :point_right:  We need it to perform a public task.\n\n*How we store your personal information*\n:point_right: Your information is securely stored on ServiceNow in US Data Centres.\n:point_right: We keep each chat record for 7 days. We will then dispose your information automatically.\n\n*Your data protection rights*\nUnder data protection law, you have rights including:\n:point_right: Your right of access - You have the right to ask us for copies of your personal information.\n:point_right: Your right to rectification - You have the right to ask us to rectify personal information you think is inaccurate. You also have the right to ask us to complete information you think is incomplete.\n:point_right: Your right to erasure - You have the right to ask us to erase your personal information in certain circumstances.\n:point_right: Your right to restriction of processing - You have the right to ask us to restrict the processing of your personal information in certain circumstances.\n:point_right: Your right to object to processing - You have the the right to object to the processing of your personal information in certain circumstances.\n:point_right: Your right to data portability - You have the right to ask that we transfer the personal information you gave us to another organisation, or to you, in certain circumstances.\n:point_right: You are not required to pay any charge for exercising your rights. If you make a request, we have one month to respond to you.\n:point_right: Please contact us if you wish to make a request.";
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
        var Slacker = new x_snc_slackerbot.Slacker();
		Slacker.send_chat(this.grChat, ':eye: 1984 : SlackerBot Privacy Report incoming...', true);
        var numCount = this._getCount();
        Slacker.send_chat(this.grChat, 'Total chat files: ' + numCount, true);
        var strDateMin = this._getDateMin();
        Slacker.send_chat(this.grChat, ':rotating_light: First flagged up on the radar: ' + strDateMin, true);
        var strCountWords = this._getCountWords();
        Slacker.send_chat(this.grChat, 'Top 3 Words in your vocab: ' + strCountWords, true);	
		
		// Sign Out
		Slacker.send_chat(this.grChat, ':eye: 1984 : SlackerBot - Remember I am always watching...', true);
    },
    _getNotice: function() {
        var Slacker = new x_snc_slackerbot.Slacker();
		var strPrivacyNotice = this.privacyNotice;
		Slacker.send_chat(this.grChat, strPrivacyNotice, true);
    },	
	// 

    _parse: function() {
        try {
			return this._getNotice();
        } catch (e) {
            gs.error("An error occured when SlackerBot tried to send a response back to Slack.\nError: " + e.name + ": " + e.message);
        }
    },


    type: 'Privacy'
};

new x_snc_slackerbot.Privacy(current).parse() || '';
