/*
activation_example:!snutils
regex:^!snutils
flags:i
*/

(function(){
  
  var strMessage = 'Check out `https://www.arnoudkooi.com/` for more information.'
  
  new Slacker().send_chat( current, strMessage, true );
  
})();
