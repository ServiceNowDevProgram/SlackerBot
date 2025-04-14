/*
activation_example:!chatgpt hello there
regex:!(chatgpt|gpt)
flags:gmi
*/
var prompt = current.text.replace(/!chatgpt/gmi, "").trim().substring(0, 1000);
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint('https://api.openai.com/v1/chat/completions');
chatReq.setHttpMethod("POST");
chatReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("openai.key"));
chatReq.setRequestHeader('Content-Type', "application/json");
chatReq.setRequestHeader('User-Agent', "ServiceNow");
chatReq.setRequestHeader("Accept", "*/*");

var body = {
  "model": "gpt-4.1-mini",
  "messages": [
    {
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
        Keep close to the original message tone and formatting.
      `
    },
    {
      "role": "user",
      "content": prompt + ". You cannot ask for follow-up responses, your response will be the end of this conversation."
    }
  ]
  //  "max_tokens": 250
};

chatReq.setRequestBody(JSON.stringify(body));
var chatResponse = chatReq.execute();
gs.info(chatResponse.getBody());
var chatResponseBody = JSON.parse(chatResponse.getBody());
var chatResponseContent = chatResponseBody.choices[0].message.content;

var show_tokens = false;
var token_cost = show_tokens ? "> tokens: " + chatResponseBody.usage.total_tokens + " ($" + (parseInt(chatResponseBody.usage.total_tokens) * 0.000002).toFixed(6) + ")\n" : "";

new x_snc_slackerbot.Slacker().send_chat(current, "> " + prompt.replace(/\n/gmi, ". ") + "\n" + token_cost + "\n" + chatResponseContent, chatResponseContent.length > 500 ? true : false);
