/*
activation_example:Tips for this Slack
regex:!tips
flags:gmi
*/
var message = "1. Use Threads (when busy or when quiet)\n     • Start your own thread with :thread:\n     • Use #pastebin for images in thread\n2. Wrap your code in 1x and 3x back-tick syntax\n     • Surround text with ` = Red highlighted single-line\n     • Surround text with ``` = Grey highlighted multi-line\n3. Give points for helpful responses @name ++\n     • You can give points in a thread\n     • You can give multiple people points in a single comment\n     • Fine print: @points_thing bot needs to be present in the channel\n4. Don't ask if you can ask a question, just ask it.\n5. See if there is a #channel for your topic, experts like to hang in channels they are experts in\n6. If you have a code question, be prepared to share your code\n7. Notifications\n     • you can keywords to notify you in your slack preferences\n     • you can mute channels you want access to, but dont need immediate Notifications\n     • you can have separate desktop / mobile notifiations configs";
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);
