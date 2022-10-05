/*
activation_example:!breakpoint
regex:!breakpoint
flags:gmi
*/
var message = '<https://www.servicenow.com/community/developer-blog/podcast-playlist-break-point-with-chuck-tomasi/ba-p/2268227|Podcast Playlist - Break Point - with Chuck Tomasi>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);
