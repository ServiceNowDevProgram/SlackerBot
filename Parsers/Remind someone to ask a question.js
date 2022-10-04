/*
emoji:trebek
*/

new x_snc_slackerbot.Slacker().send_chat(current, 'http://www.quickmeme.com/img/b0/b0bf18d80b3fc08e45b6d3421377591d1077a3c983f75b10fa6c94934002eb09.jpg?' + new GlideDateTime().getNumericValue(), true)
//a time signature is added to the URL so that Slack interprets each picture as a different picture (repeated pictures don't unfurl)
