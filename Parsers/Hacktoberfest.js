/*
activation_example:!hacktoberfest
regex:!hacktoberfest
flags:gmi
*/

new x_snc_slackerbot.Slacker().send_chat(
  current,
  "Hacktoberfest: a month-long celebration of open-source projects,  their maintainers, and the entire community of contributors.\n For more information, please see: https://hacktoberfest.com/, https://developer.servicenow.com/blog.do?p=/post/hacktoberfest-2022/, and check out our channels: #hacktoberfest, #slacker-dev-public",
  current.thread_ts
);
