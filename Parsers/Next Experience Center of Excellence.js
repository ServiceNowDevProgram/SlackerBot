/*
activation_example:!nextcoe
regex:(!nextcoe)|(!nextexperience) 
flags:gmi
*/

(function(){

  var strMessage = 'Click `https://nxtxp.link/coe` to navigate to Next Experience Center of Excellence.'
  var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, strMessage, false);
  
})();
