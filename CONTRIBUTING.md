# Contributing

We appreciate your interest in contributing to the project! Please adhere to the following guidelines to ensure a smooth contribution process.

## General Requirements

- **API Usage**: Follow the guidelines outlined in the [README](README.md#available-apisvariables-in-parsers) regarding available APIs and variables in parsers.
- **Descriptive Pull Requests**: Ensure your pull request descriptions are explicit and clearly articulate the changes made.
  - Pull requests that deviate from the scope outlined in the description may be rejected.
- **Automated Folders**: Do not make updates directly to the automatically generated ServiceNow folders. Any changes to these files should be made directly in the application after importing it into a ServiceNow instance.
- **Parser Guidelines**: Additions or updates to parsers must conform to the [required parser template](#required-parser-template) outlined below.
- **Quality Control**: Low-effort or spam pull requests will be marked as spam.
- **File Naming Conventions**: Avoid using special characters that are not allowed in standard file systems (e.g., do not include `!` in filenames).
- **Activation Phrase**: Parsers should not be inadvertently triggered in a spammy manner. For example, using common words as activation phrases may lead to rejection. Instead, use a `!` notation as an activation character (e.g., `!question` instead of just `question`).
- **Modular Functionality**: We aim to keep SlackerBot's functionality as streamlined as possible. Do not include script includes pertaining to individual parsers within the app. Any such functionality should reside entirely within the parser file, allowing users to choose which parsers to activate without unnecessary script includes. The only script includes that should be added to the app are those providing direct functionality to the bot (e.g., parsing emojis, sending ephemeral messages, or handling block messages).

## Required Parser Template

### For Chat Parsers

Example: Run a script when a user says ____

**Note**: Lines containing key-value pairs should have no leading spaces before the value. For example, `regex:!test` is correct, while `regex: !test` is incorrect and may cause errors.

- Line 1 must always be `/*`
- Line 2 must always be `activation_example:` followed by a short description of how this parser would be activated.
- Line 3 must always be `regex:` followed by a regex expression that validates when the parser should run. Do not include the opening and closing `/`.
- Line 4 must always be `flags:` followed by the regex flags needed for Line 3. If no flags are required, leave the line as `flags:`.
- *Optional*: `order:` that specifies the order in which the parser should run (lower orders run first; null or empty orders run last).
- *Optional*: `stop_processing:` if set to `true`, will prevent any subsequent parsers from executing after this one.
- The file header must always end with `*/`.
- The remaining content of the file should be valid JavaScript (ES5) that implements the desired parsing logic.

**Example of an Acceptable Chat Parser File (from [Clap back.js](Parsers/Clap%20back.js))**:

```javascript
/*
activation_example:!clap your sentence
regex:!clap
flags:gmi
order:200
stop_processing:false
*/

var sentence = current.text.replace(/!clap/gmi, "").trim().toUpperCase();
if (sentence == '') {
    new x_snc_slackerbot.Slacker().send_chat(current, ':upside_down_face: gimme something to clap!', true);
} else {
    new x_snc_slackerbot.Slacker().send_chat(current, sentence.split(' ').join(' :clap: '), false);
}
```

### For Reaction-Added Parsers

Example: Run a script when a user adds a specific emoji as a reaction.

- Line 1 must always be `/*`
- Line 2 must always be `emoji:` followed by a comma-separated list of emojis that will activate this parser.
- Line 3 must always be `*/`
- The remaining content of the file should be valid JavaScript (ES5) that implements the desired parsing logic.

**Example of an Acceptable Reaction Parser File (from [Parrot wave starter.js](Parsers/Parrot%20wave%20starter.js))**:

```javascript
/*
emoji:parrotwave1
*/

for (var i = 2; i <= 7; i++) {
    new x_snc_slackerbot.Slacker().send_reaction(current, 'parrotwave' + i);
}
```
