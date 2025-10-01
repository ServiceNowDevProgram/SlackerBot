/*
activation_example:!catchmeup or !summary
regex:!(catchmeup|summary|catchup)
flags:gmi
*/

(function(current) {
    function findWordAfterDashDash(str) {
        let match = str.match(/--\s*(.+)/);
        return match ? ` in the style of ${match[1]}` : '';
    }

    const si = new x_snc_slackerbot.Slacker();
    const thread_ts = current.getValue('thread_ts');
    const style = findWordAfterDashDash(current.text);
    const chats = [];
    const userPronouns = [];
    const users = [];
    let nda = false;
    let encodedQuery = ''; 
    if (thread_ts) {
       encodedQuery = `thread_ts=${thread_ts}^ORts=${thread_ts}^textNOT LIKE!catchmeup^textNOT LIKE!summary^textNOT LIKE!catchup`;
    } else {
       encodedQuery = `channel=${current.getValue('channel')}^sys_created_onRELATIVEGT@minute@ago@60^thread_ts=NULL^textNOT LIKE!catchmeup^textNOT LIKE!summary^textNOT LIKE!catchup`;
    }


    const chatGr = new GlideRecord('x_snc_slackerbot_chat');
    chatGr.addEncodedQuery(encodedQuery);
    chatGr.orderBy('sys_created_on');
    chatGr.query();

    while (chatGr.next()) {
        const chat = `${chatGr.getDisplayValue('user')}: ${chatGr.getValue('text')}`;
        if (chat.indexOf('!nda') > -1 || chat.indexOf('!confidential') > -1) {
            nda = true;
            break;
        }
        chats.push(chat);
    }
    
    if (nda) {
        if (thread_ts) {
            si.send_chat(current, 'This thread has been marked confidential and cannot be summarized.', false);
        } else {
            si.send_chat(current, 'This recent conversation has been marked confidential and cannot be summarized.', false);
        }
        return;
    }

    const userGa = new GlideAggregate('x_snc_slackerbot_chat');
    userGa.addEncodedQuery(encodedQuery);
    userGa.addAggregate('GROUP_CONCAT_DISTINCT','user.user_id');
    userGa.query();

    while(userGa.next()){
        const userId = userGa.getAggregate('GROUP_CONCAT_DISTINCT','user.user_id');

        const rm = new sn_ws.RESTMessageV2();
        rm.setHttpMethod('GET');
        rm.setLogLevel('all');
        rm.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        rm.setRequestHeader('authorization', `Bearer ${gs.urlEncode(gs.getProperty('x_snc_slackerbot.SlackerBot.token'))}`);
        rm.setEndpoint(`https://slack.com/api/users.info?user=${userId}`);
        const response = rm.execute();
        const responseBody = JSON.parse(response.getBody());
        const pronouns = responseBody.user.profile.pronouns ?? 'they/them';
        const name = responseBody.user.real_name ?? 'Unknown';
        userPronouns.push(`${name}: ${pronouns}`);
        users.push(name);
    }

    const chatReq = new sn_ws.RESTMessageV2();
    chatReq.setEndpoint('https://api.openai.com/v1/chat/completions');
    chatReq.setHttpMethod('POST');
    chatReq.setRequestHeader('Authorization', `Bearer ${gs.getProperty('openai.key')}`);
    chatReq.setRequestHeader('Content-Type', 'application/json');
    chatReq.setRequestHeader('User-Agent', 'ServiceNow');
    chatReq.setRequestHeader('Accept', '*/*');
    const body = {
        'model': 'gpt-4o',
        'messages': [{
                'role': 'system',
                'content': `
                    You are a Slack bot that enhances the formatting of messages to make them more engaging and visually appealing.
                    Utilize Slack's markdown language mrkdwn for various formatting elements.
                    Follow these instructions:
                    1. Enclose important words or phrases with *asterisks* for bold emphasis.
                    2. Enclose code and numbers and percentages using backticks, like \`this\`.
                    3. Use emojis when necessary to add expressiveness.
                    4. Organize text with numbered or bullet lists, using '-' for bullet points.
                    5. Combine bold and lists as needed: *Bold text*: normal text.
                    6. Italicize words like _this_.
                    7. Use blockquotes with '>' for quotes.
                    8. For URLs, use <http://example.com|Clickable link>.
                    9. Keep user (@user) and channel (#channel) tags unchanged.
                    Keep close to the original message tone and formatting.
                    
                    Use the below mapping between user name and pronouns to ensure you use the correct pronoun:
                    ${userPronouns.join('\n')}`
            },
            {
                'role': 'user',
                'content': `summarize the following conversation${style}. You cannot ask for follow-up responses. Ignore the user named Slackbot.\n\n${chats.join('\n')}`
            }
        ],
        // 'max_tokens': 250
    };
    chatReq.setRequestBody(JSON.stringify(body));
    const chatResponse = chatReq.execute();
    gs.info(chatResponse.getBody());
    const chatResponseBody = JSON.parse(chatResponse.getBody());

    const show_tokens = false;
    const token_cost = show_tokens ? `> tokens: ${chatResponseBody.usage.total_tokens} ($${(parseInt(chatResponseBody.usage.total_tokens) * 0.000002).toFixed(6)})\n` : '';

    const intro = thread_ts ? '> This thread so far:\n' : '> Last 60 minutes summarized:\n';
    si.send_chat(current, `${intro}\nInvolved users:\n${users.join('\n')}\n${token_cost}\n${chatResponseBody.choices[0].message.content}`, false);
})(current);
