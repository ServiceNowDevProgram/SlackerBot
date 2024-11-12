/*
activation_example:!maintainers
regex:!hackmaintainers|!hacktobermaintainers|!maintainershacktoberfest|!maintainers
flags:gmi
*/

(function(){
  
  var strMessage = 'Navigate to `https://github.com/ServiceNowDevProgram/Hacktoberfest?tab=readme-ov-file#reviewers` to checkout the Hacktoberfest crew who are maintaining the hacktoberfest projects '
  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, strMessage, false);
  
})();
