/*
activation_example:!hacktoberfest
regex:!hacktoberfest
flags:gmi
*/
var message = '*Hacktoberfest*: a month-long celebration of open-source projects, their maintainers, and the entire community of contributors.\n\n How to participate?\n - Register on the <https://hacktoberfest.com/|official Hacktoberfest website>\n - Make four contributions to open source before October 31, 2024\n\n Participants who complete Hacktoberfest will receive these prizes: Service Now Community Badge, Evolving Digital Badge, and  ServiceNow Merch!\n For more information, please see: https://hacktoberfest.com/, <https://www.servicenow.com/community/developer-advocate-blog/servicenow-hacktoberfest-2024/ba-p/3052690>, and join us at our channels: <#C01C0RWV32M|hacktoberfest>, <#CKJ2TE0AK|slacker-dev-public>';
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, true);
