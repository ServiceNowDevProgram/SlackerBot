/*
emoji: saturday-chill
*/

new x_snc_slackerbot.Slacker().send_reaction(current, weeklyMoji());

function weeklyMoji() {
    var weekEmojis = {
        0: 'sunday-funday',     // Sunday
        1: 'monday-blues',      // Monday
        2: 'taco-tuesday',      // Tuesday
        3: 'wacky-wednesday',   // Wednesday
        4: 'thankful-thursday', // Thursday
        5: 'friday-vibes',      // Friday
        6: 'saturday-chill'     // Saturday
    };

    var day = new GlideDateTime().getDayOfWeekUTC(); // Get the current day of the week (0 = Sunday, 6 = Saturday)
    return weekEmojis[day];
}
//Added script for weekly emoji reactions
