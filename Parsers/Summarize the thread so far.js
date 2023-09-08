/*
activation_example:!catchmeup or !summary
regex:!(catchmeup|summary|catchup)
flags:gmi
*/

( function( current ){
	var si = new Slacker();
	var thread_ts = current.getValue( 'thread_ts' );

	if( !thread_ts ){
		message = 'This command is only usable in a thread.';
		si.send_chat( current, message, false );
		return null;
	}

	function findWordAfterDashDash(str) {
		var match = str.match(/--\s*(\w+)/);
		return match ? " in the style of " + match[1] : "";
	}
	var style = findWordAfterDashDash(message);
	
	var chats = [];
	var chatGr = new GlideRecord('x_snc_pointsthing_chat');
	chatGr.addEncodedQuery('thread_ts=' + thread_ts + '^ORts=' + thread_ts + '^textNOT LIKE!catchmeup^textNOT LIKE!summary^textNOT LIKE!catchup');
	chatGr.orderBy('sys_created_on');
	chatGr.query();
	while (chatGr.next()){
		var chat = chatGr.getDisplayValue('user') + ': ' + chatGr.getValue('text');
		chats.push(chat);
	}

	var prompt = current.text.replace(/!chatgpt/gmi, "").trim().substring(0, 1000);
	var chatReq = new sn_ws.RESTMessageV2();
	chatReq.setEndpoint('https://api.openai.com/v1/chat/completions');
	chatReq.setHttpMethod("POST");
	chatReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("openai.key"));
	chatReq.setRequestHeader('Content-Type', "application/json");
	chatReq.setRequestHeader('User-Agent', "ServiceNow");
	chatReq.setRequestHeader("Accept", "*/*");
	var body = {
		"model": "gpt-3.5-turbo",
		"messages": [{"role": "user", "content": "summarize the following conversation" + style + ". You cannot ask for follow-up responses. Ignore the user named Slackbot.\n\n" + chats.join("\n")}],
		//  "max_tokens": 250
	};
	chatReq.setRequestBody(JSON.stringify(body));
	var chatResponse = chatReq.execute();
	gs.info(chatResponse.getBody());
	var chatResponseBody = JSON.parse(chatResponse.getBody());

	var show_tokens = false;
	var token_cost = show_tokens ? "> tokens: " + chatResponseBody.usage.total_tokens + " ($" + (parseInt(chatResponseBody.usage.total_tokens) * 0.000002).toFixed(6) + ")\n" : "";

	new x_snc_slackerbot.Slacker().send_chat(current, "> This thread so far:\n" + token_cost + "\n" + chatResponseBody.choices[0].message.content, false);
} )( current );
