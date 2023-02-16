/*
activation_example:!devlink utah
regex:(!devlink)|(!shortlink) 
flags:gmi
*/

(function(){
    
  var term = current.text.replace('!devlink', '').trim();
  var strMessage = '';
  if(term) strMessage = 'Here is the short link to '+term+ '`https://devlink.sn/'+term+'`, Have a good day!';
  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, strMessage, false);
  
})();



