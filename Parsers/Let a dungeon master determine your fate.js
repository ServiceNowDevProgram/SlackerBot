/*
activation_example:!d20 I try to jump over a 10 foot gap
regex:!d20
flags:gmi
*/

(function(current) {

    var prompt = current.text.replace(/!d20/gmi, "").trim().substring(0, 1000);
    var chatReq = new sn_ws.RESTMessageV2();
    chatReq.setEndpoint('https://api.openai.com/v1/chat/completions');
    chatReq.setHttpMethod("POST");
    chatReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("openai.key"));
    chatReq.setRequestHeader('Content-Type', "application/json");
    chatReq.setRequestHeader('User-Agent', "ServiceNow");
    chatReq.setRequestHeader("Accept", "*/*");
    var body = {
        "model": "gpt-4o",
        "messages": [{
                "role": "system",
                "content": `
                    You are a Slack bot that enhances the formatting of messages to make them more engaging and visually appealing.
                    Utilize Slack's markdown language mrkdwn for various formatting elements.
                    Follow these instructions:
                    1. Enclose important words or phrases with *asterisks* for bold emphasis.
                    2. Enclose code and numbers and percentages using backticks, like \`this\`.
                    3. Use emojis when necessary to add expressiveness.
                    4. Organize text with numbered or bullet lists, using "-" for bullet points.
                    5. Combine bold and lists as needed: *Bold text*: normal text.
                    6. Italicize words like _this_.
                    7. Use blockquotes with ">" for quotes.
                    8. For URLs, use <http://example.com|Clickable link>.
                    9. Keep user (@user) and channel (#channel) tags unchanged.
                    Keep close to the original message tone and formatting.`
            },
            {
                "role": "user",
                "content": "You are a dungeon master and a player is about to roll a D20 to determine the outcome of an action they are pursuing. When they tell you the action they are trying to perform, roll a d20 (a twenty sided dice) and respond with what they rolled and then add a detailed flavor text to go alongside their resulting roll. If they roll a critical failure (a 1) or a critical success (a 20), the flavor text should be incredibly exaggerated to emphasize the extreme luck. Try to make non-critical rolls still interesting but reflective of the number rolled still. Here is what your player is trying to do, in their words: " + prompt
            }
        ],
    };
    chatReq.setRequestBody(JSON.stringify(body));
    var chatResponse = chatReq.execute();
    gs.info(chatResponse.getBody());
    var chatResponseBody = JSON.parse(chatResponse.getBody());

    var intro = "> " + prompt + "\n";
    new x_snc_slackerbot.Slacker().send_chat(current, intro + "\n" + chatResponseBody.choices[0].message.content, false);
})(current);
