/*
activation_example:@Chuck.Tomasi
regex:<@U43AA4W64>
flags:g
*/
new x_snc_slackerbot.Slacker().send_reaction(current, chuckMuji());


function chuckMuji(){
    var chucks = ['chuck-le','chuck-point','thinking-chuck','upsidedown-chuck','thinking-chuck-cartoon','bowtie']

    return chucks[parseInt(Math.random() * chucks.length)];
    
}
