/*
activation_example:So extra, I'm extra, or E X T R A
regex:(i'?m extra|so extra|e x t r a)
flags:gmi
order:200
stop_processing:false
*/

var reactjis = ['alphabet-white-e', 'alphabet-white-x', 'alphabet-white-t', 'alphabet-white-r', 'alphabet-white-a', 'action-right'];

// send this right away
new x_snc_slackerbot.Slacker().send_reaction(current, 'action-left');
// use setTimeout to try and keep them in the right order
reactjis.forEach(function(item, index){
    setTimeout(function(){ 
        new x_snc_slackerbot.Slacker().send_reaction(current, item);
    }, (((index + 1) * 1000) + 1));
});
