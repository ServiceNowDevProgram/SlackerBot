new x_snc_slackerbot.Slacker().send_reaction(current, weeklyMotivation());

function weeklyMotivation() {
    var weekmotivations = {
        0: 'Make each day your masterpiece',     // Sunday 
        1: 'We will fail when we fail to try',      // Monday 
        2: 'Don’t count the days, make the days count',      // Tuesday 
        3: 'The plan is to fan this spark into a flame.',   // Wednesday 
        4: 'Boss up and change your life / You can have it all, no sacrifice', // Thursday 
        5: 'Light tomorrow with today.',      // Friday
        6: 'Try not. Do, or do not. There is no try.'     // Saturday 
    };

    var day = new GlideDateTime().getDayOfWeekUTC(); // Get the current day of the week (0 = Sunday, 6 = Saturday)
    return weekmotivations [day];
}
