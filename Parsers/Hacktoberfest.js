/*
activation_example:!hacktoberfest
regex:!hacktoberfest
flags:gmi
*/
var message = '*Hacktoberfest*: a month-long celebration of open-source projects,  their maintainers, and the entire community of contributors.\n\n How to participate?\n - Register on the <https://hacktoberfest.com/|official hacktoberfest website>\n - Make four contributions to open source before October 31\n\n Participants who complete Hacktoberfest will receive these prizes: a tree planted in their name, the Hacktoberfest 2023 holopin, and a mystery reward!\n For more information, please see: https://hacktoberfest.com/, <https://developer.servicenow.com/blog.do?p=/post/hacktoberfest-2023/|Blog on Hacktoberfest>, and join us at our channels: <#C01C0RWV32M|hacktoberfest>, <#CKJ2TE0AK|slacker-dev-public>'
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, true);
