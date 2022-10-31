/*
activation_example:!developermvp
regex:^!developermvp
flags:gmi
*/

(function(){
  
  var strMessage = 'Navigate to `https://developer.servicenow.com/blog.do?p=/tags/mvp/` to checkout highlighted developer MVP content & more information.'
  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, strMessage, false);
  
})();
