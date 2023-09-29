![SlackerBot Banner](https://github.com/ServiceNowDevProgram/SlackerBot/assets/31702109/adee2bb5-bc84-4e19-8b5d-8b427573e4c3)

This bot is what controls the @Slacker bot on the [sndevs.com](https://sndevs.com/) workspace.

🔔🔔🔔<br>
***CONTRIBUTORS must follow all guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)*** or run the risk of having your Pull Requests labeled as spam.<br>
🔔🔔🔔

## Contents

- [Ways to contribute](#two-ways-to-contribute)
- [Installing this bot on your slack server](#installing-this-bot-on-your-own-slack-server)
- [GitHub to ServiceNow Integrations](#github-to-servicenow-integrations)
- [Notes for setting this app up in Studio](#notes-for-setting-this-app-up-in-studio)
- [Available APIs/variables in parsers](#available-apisvariables-in-parsers)

## Ideas

See the Issues tab for parser ideas. Make sure to leave a comment on an issue if you're working on it.

## Two ways to contribute

[Easy](#easy-method-adding-new-parser) or [Hard](#hard-method-adding-new-functionality-types)

### **Easy method (Adding new parser)**

Can be done without pulling this app into a ServiceNow instance.<br>
This is the preferred method for adding simple call & response parsers (see [Bowtie when chuck is mentioned](https://github.com/ServiceNowDevProgram/SlackerBot/blob/main/Parsers/Bowtie%20when%20chuck%20is%20mentioned.js), or [Clap Back](https://github.com/ServiceNowDevProgram/SlackerBot/blob/main/Parsers/Clap%20back.js) for examples)

1. Fork this repo
2. Create a new branch (name it according to what functionality you are adding)
3. Create a new .js file in the [Parsers](Parsers) folder (see [CONTRIBUTING.md](CONTRIBUTING.md) for requirements)
4. Submit a pull request to the ServiceNowDevProgram/SlackerBot `main` branch

If approved, your new parser automatically goes live for the bot's immediate use!

<br>

### **Hard method (Adding new functionality types)**

This method requires more setup, but is the preferred method for more complex parsers and functionalities, as it provides a method to robustly test before submitting a pull request.

1. Fork this repo
2. Go to your ServiceNow instance
3. Go to `System Applications` => `Studio`
4. Once Studio loads, select `Import From Source Control`
5. Use your forked repo to [Import your application](https://developer.servicenow.com/dev.do#!/learn/learning-plans/quebec/new_to_servicenow/app_store_learnv2_devenvironment_quebec_importing_an_application_from_source_control)
6. Optional: See below on how to get this bot working on your own slack server
7. Make updates to the application (see [CONTRIBUTING.md](CONTRIBUTING.md) for additional details)
8. In Studio, commit your changes to source control
9. Submit a pull request to the ServiceNowDevProgram/SlackerBot `main` branch

An accepted Pull Request and merge does not necessarily mean the functionality will go live immediately, as an admin for the host instance will need to pull the application into ServiceNow.

## Installing this bot on your own workspace

### Create App and Install it

#### Via a Manifest

* Create a new app, select "From an app manifest"
* Select the workspace into which you want to install this app
* Copy and paste the manifest from either [appmanifest.json](Slack%20App%20Manifest/appmanifest.json) or [appmanifest.yaml](Slack%20App%20Manifest/appmanifest.yaml)
* Create the app
* Navigate to `Features` > `Event Subscriptions`
* Populate the `Request URL` with: https://YOURDEVINSTANCE.service-now.com/api/x_snc_slackerbot/slackerbot_event_handler
> `When you tab out of the field, make sure the URL is "Verified" before you proceed.`
* Navigate to `Settings` > `Install App`
* Click the `Install to Workspace` button
* Verify the `view` and `do` permissions
* Click the `Allow` button
* Copy the `Bot User OAuth Token` for the ServiceNow system property configuration later

#### Manually

* Create a new app, select "From scratch"
* Select the workspace into which you want to install this app
* Navigate to `Features` > `Event Subscriptions`
* Turn on `Enable Events`
* Populate the `Request URL` with: https://YOURDEVINSTANCE.service-now.com/api/x_snc_slackerbot/slackerbot_event_handler
> `When you tab out of the field, make sure the URL is "Verified" before you proceed.`
* Expand the `Subscribe to bot events` section
* Click the `Add bot User Event` button
* Search for and select `message.channels`
* Search for and select `message.groups`
* Click the `Save Changes` button
* Navigate to `Features` > `OAuth & Permissions`
* Scroll down to `Bot Token Scopes`
* Click the `Add an OAuth Scope` button
* Search for and select `chat:write`
* Navigate to `Settings` > `Install App`
* Click the `Install to Workspace` button
* Verify the `view` and `do` permissions
* Click the `Allow` button
* Copy the `Bot User OAuth Token` for the ServiceNow system property configuration later

### Connect them together

* Place token into the ServiceNow system property 'x_snc_slackerbot.SlackerBot.token' 
  * REMINDER: When you commit your changes, always delete the value of this property before you commit. If you forget to do this, the token will automatically be disabled GitHub sees that you accidentally placed your private token online. If this happens, go into your app and issue a new token.

### Testing

* Invite your bot to a channel
* Create a parser on the `x_snc_slackerbot_parser` table
* Trigger the parser in the channel

### Troubleshooting

* Check the Payload `x_snc_slackerbot_payload` table to make sure SN is receiving messages
* Check 'Outbound HTTP Requests' to make sure the bot is replying to the channel

## GitHub to ServiceNow Integrations

### Auto populate your Parsers table

To fill your Parsers `x_snc_slackerbot_parser` table with all the parsers that exist on this repo:

* Go to the Parsers table list (type `x_snc_slackerbot_parser.list` in your filter navigator and press enter)
* Click on the "Sync Parsers" Banner UI Action

This syncs your table to *this* repo, if you rather sync it to another repo, change the value of your `x_snc_slackerbot.Parsers_Sync_Repo` system property.

### Setting up the GitHub to ServiceNow integration

The Parsers folder on [ServiceNowDevProgram/SlackerBot](https://github.com/ServiceNowDevProgram/SlackerBot/) is set up to send changes to the ServiceNow instance that @Slacker is hosted on (automatically, on every commit). To do this for your own fork and ServiceNow instance:

* In your forked repository, click on the Actions tab
* Click on "I understand" to activate workflows
* Go to the Settings tab
* Under `Secrets` and `Actions` add the following repository secrets:
  * `SN_INSTANCE_NAME` your ServiceNow instance name
  * `ADMIN_USERNAME` the username of an admin account on your ServiceNow instance
  * `ADMIN_PASSWORD` the password of the above account
  
### Testing

* Create a new file in the Parsers folder and name it `something.js`
* Follow the template in the [CONTRIBUTING.md](CONTRIBUTING.md) document
* Commit the file
* Check your ServiceNow instance on the Parsers `x_snc_slackerbot_parser` table and verify the file was uploaded
* Trigger the parser on a channel that your bot is in

## Notes for setting this app up in ServiceNow Studio

***Never commit your tokens to GitHub***

System Properties

- `x_snc_slackerbot.SlackerBot.token` is your bot's user token. Required to send messages back to your workspace
- `x_snc_slackerbot.SlackerBot.supertoken` is any admin token for your server. Used for deleting messages (see in-app SRAPI).
- `x_snc_slackerbot.maps.token` is your Google Maps token (if you wish to use the !iss parser)

Scripted Rest APIs (SRAPIs)

- `SlackerBot Event Handler` is used to validate to the Events handler and to convert incoming chats to the x_snc_slackerbot_payload table
- `SlackerBotGitHub` is used to automate the creation of parsers from ServiceNowDevProgram/SlackerBot/Parsers

## Available APIs/variables in parsers

- `current.text` the entire text of the chat that is being parsed
- `current.ts` the timestamp of the chat
- `current.thread_ts` if the chat was in a thread, the original message's timestamp
- `current.channel` the channel's unique ID that the chat was sent in
- `current.user.user_id` the chat's sender's unique ID
- `current.user.name` the chat's sender's display name
- `new x_snc_slackerbot.Slacker().send_chat(`**param 1**, **param 2**, **param 3**`)` How to send chats back to your workspace after parsing.
  - `param 1` Required reference object. The gliderecord that contains the channel and timestamps. *Should almost always be* `current`
  	- If you do not have a gliderecord, this can be faked by providing a JSON object. The only key that is required is a channel, eg. `{"channel":"ABC123"}`
  - `param 2` Required `string` or `object`
  	- Required `string`. The chat message to be sent as plaintext. Can be an expression, eg. `originalNumber + ' is the result.`
  	- Required `object`. The chat content to be sent, as per the Block Kit API format. Object requires `text` and `blocks` properties. See [Block Kit API Reference](https://api.slack.com/reference/block-kit/blocks)
  		- Example Object:
```json
{
	"text": "",
	"blocks": [
		{ "type": "header", "text": { "type": "plain_text", "text": "Exemplar" } }
	]
}
```

  - `param 3` Optional boolean. If set to true, will always push chat to the thread instead of to the main channel chat. Useful if param 2 is expected to be long and you don't want to flood chat. Defaults to false if not provided.
- `new x_snc_slackerbot.Slacker().send_reaction(`**param 1**, **param 2**`)` How to send reactions back to a specific chat after parsing.
  - `param 1` Required reference object. The gliderecord that contains the channel and timestamps. *Should almost always be* `current`
  	- If you do not have a gliderecord, this can be faked by providing a JSON object. Both the channel and ts keys are required. `{"channel":"ABC123","ts":"0123456789"}`
  - `param 2` Required string. The name of the emoji to send. Do not include surrounding `:`. Eg. `joy` and *not* `:joy:`
