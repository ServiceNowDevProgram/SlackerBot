/*
activation_example:!hacktoberfest
regex:!hacktoberfest
flags:gmi
*/
var message = '*Hacktoberfest*: a month-long celebration of open-source projects,  their maintainers, and the entire community of contributors.\n\n How to participate?\n - Register on the <https://hacktoberfest.com/|official hacktoberfest website>\n - Make four contributions to open source before October 31\n\n Participants who complete Hacktoberfest can elect to receive one of two prizes: a tree planted in their name, or the Hacktoberfest 2022 t-shirt!\n For more information, please see: https://hacktoberfest.com/, <https://developer.servicenow.com/blog.do?p=/post/hacktoberfest-2022/|Blog on Hacktoberfest>, and join us at our channels: <#C01C0RWV32M|hacktoberfest>, <#CKJ2TE0AK|slacker-dev-public>'
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, true);