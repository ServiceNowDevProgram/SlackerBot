# Contributing

## General requirements

- Pull request descriptions must be explicit and descriptive to what is being changed.
  - Changes that are not within the scope of the description will result in the entire PR being rejected
- No updates should be made directly to the automatically generated ServiceNow folders. Updates to these files should be done via the [Regular method](#regular-method-adding-new-functionality-types) described below.
- Parser additions/updates must follow the [Parser template](#required-parser-template) below.
- Low effort/spam Pull Requests will be marked as spam accordingly.

## Two ways to contribute

[Easy](#easy-method-adding-new-parser) or [Hard](#regular-method-adding-new-functionality-types)

### Easy method (Adding new parser)

Can be done without pulling this app into a ServiceNow instance

1. Fork this repo
2. Create a new branch (name it according to what functionality you are adding)
3. Create a new .js file in the [Parsers](Parsers) folder
4. Submit a pull request to the ServiceNowDevProgram/SlackerBot `main` branch

If approved, your new parser automatically goes live for the bot's immediate use!

#### Available APIs/variables in parsers

- `current.text` the entire text of the chat that is being parsed
- `current.ts` the timestamp of the chat
- `current.thread_ts` if the chat was in a thread, the original message's timestamp
- `current.channel` the channel's unique Slack ID that the chat was sent in
- `current.user.user_id` the chat's sender's unique Slack ID
- `current.user.name` the chat's sender's display name
- `new x_snc_slackerbot.Slacker().send_chat(`**param 1**, **param 2**, **param 3**`)` How to send chats back to Slack after parsing.
  - `param 1` Required reference object. The gliderecord that contains the channel and timestamps. *Should almost always be* `current`
  - `param 2` Required string. The chat message to be sent. Can be an expression, eg. `originalNumber + ' is the result.`
  - `param 3` Optional boolean. If set to true, will always push chat to the thread instead of to the main channel chat. Useful if param 2 is expected to be long and you don't want to flood chat.

#### Required Parser Template

- Line 1 must always be `/*`
- Line 2 must always be `activation_example:` followed by a short description of how this parser would be activate
- Line 3 must always be `regex:` followed by a regex expression that validates if the parser should run. Do not include the opening and closing `/`
- Line 4 must always be `flags:` followed by the regex flags needed for line 3. If no flags are needed then leave the line as `flags:`
- Line 5 must always be `*/`
- The rest of the file should be the JavaScript (ES5) that does your desired parsing.

Example acceptable file (From [Clap back.js](Parsers/Clap%20back.js)):

```js
/*
activation_example:!clap your sentence
regex:!clap
flags:gmi
*/
var sentence = current.text.replace(/!clap/gmi, "").trim().toUpperCase();
if (sentence == '') {
	var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current, ':upside_down_face: gimme something to clap!', true);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, sentence.split(' ').join(' :clap: '), false);
}
```

### Regular method (Adding new functionality types)

1. Fork this repo
2. Go to your ServiceNow instance
3. Go to `System Applications` => `Studio`
4. Once Studio loads, select `Import From Source Control`
5. Use your forked repo to [Import your application](https://developer.servicenow.com/dev.do#!/learn/learning-plans/quebec/new_to_servicenow/app_store_learnv2_devenvironment_quebec_importing_an_application_from_source_control)
5. Make updates to the application
6. In Studio, commit your changes to source control
7. Submit a pull request to the ServiceNowDevProgram/SlackerBot `main` branch

An accepted Pull Request and merge does not necessarily mean the functionality will go live immediately, as an admin for the host instance will need to pull the application into ServiceNow.

#### Notes for setting this app up in Studio

System Properties

- `x_snc_slackerbot.SlackerBot.token` is your Slack bot's user token. Required to send messages back to your Slack server
- `x_snc_slackerbot.SlackerBot.supertoken` is any admin token for your Slack server. Used for deleting messages (see in-app SRAPI).
- `x_snc_slackerbot.maps.token` is your Google Maps token (if you wish to use the !iss parser)

Scripted Rest APIs (SRAPIs)

- `SlackerBot Event Handler` is used to validate to the Slack Events handler and to convert incoming chats to the x_snc_slackerbot_payload table
- `SlackerBotGitHub` is used to automate the creation of parsers from ServiceNowDevProgram/SlackerBot/Parsers
