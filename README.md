# SlackerBot

This bot is what controls the @Slacker bot on the [sndevs.com](https://sndevs.com/) slack workspace.

🔔🔔🔔<br>
***CONTRIBUTORS must follow all guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)*** or run the risk of having your Pull Requests labeled as spam.<br>
🔔🔔🔔

## Two ways to contribute

[Easy](#easy-method-adding-new-parser) or [Hard](#regular-method-adding-new-functionality-types)

### Easy method (Adding new parser)

Can be done without pulling this app into a ServiceNow instance

1. Fork this repo
2. Create a new branch (name it according to what functionality you are adding)
3. Create a new .js file in the [Parsers](Parsers) folder (see [CONTRIBUTING.md](CONTRIBUTING.md) for requirements)
4. Submit a pull request to the ServiceNowDevProgram/SlackerBot `main` branch

If approved, your new parser automatically goes live for the bot's immediate use!

### Regular method (Adding new functionality types)

1. Fork this repo
2. Go to your ServiceNow instance
3. Go to `System Applications` => `Studio`
4. Once Studio loads, select `Import From Source Control`
5. Use your forked repo to [Import your application](https://developer.servicenow.com/dev.do#!/learn/learning-plans/quebec/new_to_servicenow/app_store_learnv2_devenvironment_quebec_importing_an_application_from_source_control)
5. Make updates to the application (see [CONTRIBUTING.md](CONTRIBUTING.md) for additional details)
6. In Studio, commit your changes to source control
7. Submit a pull request to the ServiceNowDevProgram/SlackerBot `main` branch

An accepted Pull Request and merge does not necessarily mean the functionality will go live immediately, as an admin for the host instance will need to pull the application into ServiceNow.
