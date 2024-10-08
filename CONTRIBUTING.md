# Contributing

## General requirements

- API usage should follow the information found in the [readme](README.md#available-apisvariables-in-parsers)
- Pull request descriptions must be explicit and descriptive to what is being changed.
  - Changes that are not within the scope of the description will result in the entire PR being rejected
- No updates should be made directly to the automatically generated ServiceNow folders. Updates to these files should directly to the app after being imported into a ServiceNow instance.
- Parser additions/updates must follow the [Parser template](#required-parser-template) below.
- Low effort/spam Pull Requests will be marked as spam accordingly.
- Filenames should not have special characters that are not allowed on normal file systems (eg. do not put ! in the file name).
- Parsers should not be spammy or activated unintentionally by a user in a way that would be deemed spammy. For example, a parser that is activated by a common word would likely be rejected. Instead, use a `!` notation as this is widely accepted as an activation character (eg. `!question` instead of just `question` as an activation phrase)
- We want the SlackerBot to be as close to base functionality as possible. The app (in ServiceNow) should not be updated with script includes that pertain to individual parsers, and such functionality should be entirely within a parser file so that users can choose which parsers they want to use without having extra script includes included. The only script includes that should be added to the app is if it's adding direct functionality to the bot itself (eg. the ability for the bot to parse emojis, or to send ephemeral messages, or accept blocks messages, etc.).

## Required Parser Template

### For chat parsers

Eg. Run a script when a user says ____

**Notice that lines that have key:value pairs have no leading spaces before the value**. Eg. `regex:!test` is correct, while `regex: !test` is very incorrect and could cause errors

- Line 1 must always be `/*`
- Line 2 must always be `activation_example:` followed by a short description of how this parser would be activate
- Line 3 must always be `regex:` followed by a regex expression that validates if the parser should run. Do not include the opening and closing `/`
- Line 4 must always be `flags:` followed by the regex flags needed for line 3. If no flags are needed then leave the line as `flags:`
- *Optional*: `order:` that the parser should run (lower orders run first, null/empty orders run last).
- *Optional*: `stop_processing:` if set to `true`, will stop the parser from running any other parsers after this one.
- The file header must always end with `*/`
- The rest of the file should be the JavaScript (ES5) that does your desired parsing.

Example acceptable chat parser file (From [Clap back.js](Parsers/Clap%20back.js)):

```js
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

### For reaction-added parsers

Eg. Run a script when a user adds a specific emoji as a reaction

- Line 1 must always be /*
- Line 2 must always be `emoji:` followed by a comma separated list of emojis that will activate this parser
- Line 3 must always be */
- The rest of the file should be the JavaScript (ES5) that does your desired parsing.

Example acceptable react parser file (From [Parrot wave starter.js](Parsers/Parrot%20wave%20starter.js)

```js
/*
emoji:parrotwave1
*/

for (var i = 2; i <= 7; i++){
  new x_snc_slackerbot.Slacker().send_reaction(current, 'parrotwave' + i);
}
```
