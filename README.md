# SlackerBot

This bot is what controls the @Slacker bot on the [sndevs.com](https://sndevs.com/) slack workspace.

🔔🔔🔔<br>
***CONTRIBUTORS must follow all guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)*** or run the risk of having your Pull Requests labeled as spam.<br>
🔔🔔🔔

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

## Installing this bot on your own Slack server

### Create Slack App, Install into Slack

#### Via a Manifest

* Create a new app, select "From an app manifest"
* Select the Slack Workspace into which you want to install this app
* Copy and paste the manifest from either [App Manifest.json](https://github.com/ServiceNowDevProgram/SlackerBot/blob/main/Slack%20App%20Manifest/appmanifest.json) or [App Manifest.yaml](https://github.com/ServiceNowDevProgram/SlackerBot/blob/main/Slack%20App%20Manifest/appmanifest.yaml)
* Create the app
* Navigate to `Settings` > `Install App`
* Click the `Install to Workspace` button
* Verify the `view` and `do` permissions
* Click the `Allow` button
* Copy the `Bot User OAuth Token` for the ServiceNow system property configuration later

#### Manually

* Create a new app, select "From scratch"
* Select the Slack Workspace into which you want to install this app
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
  * REMINDER: When you commit your changes, always delete the value of this property before you commit. If you forget to do this, Slack will automatically disable your token when it does a scan of GitHub and sees that you accidentally placed your private token online. If this happens, go into your Slack app and issue a new token.

### Testing

* Invite your bot to a Slack channel
* Create a parser on the `x_snc_slackerbot_parser` table
* Activate the parser in the Slack channel

### Troubleshooting

* Check the Payload `x_snc_slackerbot_payload` table to make sure SN is receiving Slack messages
* Check 'Outbound HTTP Requests' to make sure the bot is replying to the channel

## Auto populate your Parsers table

To fill your Parsers `x_snc_slackerbot_parser` table with all the parsers that exist on this repo:

* Go to the Parsers table list (type `x_snc_slackerbot_parser.list` in your filter navigator and press enter)
* Click on the "Sync Parsers" Banner UI Action

This syncs your table to *this* repo, if you rather sync it to another repo, change the value of your `x_snc_slackerbot.Parsers_Sync_Repo` system property.

## Setting up the GitHub to ServiceNow integration

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
* Trigger the parser on a slack channel that your bot is in
