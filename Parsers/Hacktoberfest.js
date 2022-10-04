/*
activation_example:!hacktoberfest
regex:!hacktoberfest
flags:gmi
*/
var message = 'Hacktoberfest: a month-long celebration of open-source projects,  their maintainers, and the entire community of contributors.\n For more information, please see: https://hacktoberfest.com/, https://developer.servicenow.com/blog.do?p=/post/hacktoberfest-2022/, and join us at our channels: <#C01C0RWV32M|hacktoberfest>, <#CKJ2TE0AK|slacker-dev-public>'
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, current.thread_ts);