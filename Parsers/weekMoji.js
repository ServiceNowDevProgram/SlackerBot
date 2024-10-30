/*
emoji:calendar
*/

new x_snc_slackerbot.Slacker().send_reaction(current, weeklyMoji());

function weeklyMoji() {
    var weekEmojis = {
        0: 'person_in_lotus_position',     // Sunday - calm and relaxation
        1: 'coffee',      // Monday - getting over weekend with coffee
        2: 'chart_with_upwards_trend',      // Tuesday - Moving forward through week
        3: 'climbing',   // Wednesday - Work and only work
        4: 'rocket', // Thursday - Powering through tasks and finishing them
        5: 'beers',      // Friday - Chilling and enjoyment
        6: 'beach_with_umbrella'     // Saturday - Rest; friends and faily time
    };

    var day = new GlideDateTime().getDayOfWeekUTC(); // Get the current day of the week (0 = Sunday, 6 = Saturday)
    return weekEmojis[day];
}
//Added script for weekly emoji reactions
