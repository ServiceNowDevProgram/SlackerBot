/*
emoji:welcome
*/

var message = {
	"type": "home",
	"blocks": [{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Hello and welcome to SNDevs slack!"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Here are some tips to get you started*"
			}
		},
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Asking Good questions"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "- Use Threads! #general gets busy so make sure to keep conversation about your question in the original thread. \n- Write a title that summarizes the specific problem. \n- Pretend you're talking to a busy colleague.\n -Spelling, grammar, and punctuation are important! \n- Bad: GlideRecord isn't working \n- Good: Why does str == 'value' evaluate to false when str is set to 'value' in my script? \n- Proof-read before posting! \n- Post the question and respond to feedback"
			}
		},
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Posting Code"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "- Introduce the problem before you post any code. \n- Help others reproduce the problem. Don't just copy in your entire script. \n- Do not post images of code, data, error messages (just copy the text).\n -When posting code wrap it in 1x and 3x back-tick [`] syntax, or use the code editor \n- `your text` = Red highlighted single-line \n ```your text``` = Grey highlighted multi-line \n- Or use the </> code button on the text editor in slack."
			}
		},
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Give Points to say thank you!"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "If someone successfully helped you (or ever just help you get closer to the answer) tag them with a ++ in the thread. eg. <@' + current.user.user_id + '> ++ will grant that user some community points to show how helpful they were."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Looking for more helpful tips? These tips are mostly from https://stackoverflow.com/help/how-to-ask"
			}
		}
	]
};

//This should find any other payloads where there is already a :welcome: reaction in the thread to prevent the message from firing more than once
var previousMessage = new global.GlideQuery('x_snc_slackerbot_payload')
	.where('payload', 'CONTAINS', '"type": "reaction_added"')
	.where('payload', 'CONTAINS', '"reaction": "welcome"')
	.where('payload', 'CONTAINS', '"is_bot": true')
	.where('payload', 'CONTAINS', '"thread_ts": ' + current.thread_ts)
	.selectOne()
	.isPresent();

if (!previousMessage)
	new x_snc_slackerbot.Slacker().send_chat(current, message, true);
