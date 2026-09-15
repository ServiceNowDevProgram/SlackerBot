/*
activation_example:!units 10 ft to m
regex:!units\b
flags:gmi
order:200
stop_processing:false
*/

var USAGE = 'Usage: `!units 10 ft to m`. Supports mm, cm, m, km, in, ft, yd, mi.';
var input = current.text.replace(/!units\b/gmi, '').trim();

if (input == '') {
    new x_snc_slackerbot.Slacker().send_chat(current, USAGE, true);
} else {
    var match = input.match(/^(-?\d+\.?\d*)\s*([a-z]+)\s+to\s+([a-z]+)$/i);
    if (!match) {
        new x_snc_slackerbot.Slacker().send_chat(current, USAGE, true);
    } else {
        var amount = parseFloat(match[1]);
        var fromUnit = match[2].toLowerCase();
        var toUnit = match[3].toLowerCase();
        var fromMeters = unitToMeters(fromUnit);
        var toMeters = unitToMeters(toUnit);

        if (isNaN(amount) || fromMeters === null || toMeters === null) {
            new x_snc_slackerbot.Slacker().send_chat(current, ':exclamation: Unknown unit. ' + USAGE, true);
        } else {
            var converted = amount * (fromMeters / toMeters);
            new x_snc_slackerbot.Slacker().send_chat(current, amount + ' ' + fromUnit + ' is ' + formatNumber(converted) + ' ' + toUnit + '.', false);
        }
    }
}

function unitToMeters(unit) {
    var units = {
        mm: 0.001,
        millimeter: 0.001,
        millimeters: 0.001,
        millimetre: 0.001,
        millimetres: 0.001,
        cm: 0.01,
        centimeter: 0.01,
        centimeters: 0.01,
        centimetre: 0.01,
        centimetres: 0.01,
        m: 1,
        meter: 1,
        meters: 1,
        metre: 1,
        metres: 1,
        km: 1000,
        kilometer: 1000,
        kilometers: 1000,
        kilometre: 1000,
        kilometres: 1000,
        in: 0.0254,
        inch: 0.0254,
        inches: 0.0254,
        ft: 0.3048,
        foot: 0.3048,
        feet: 0.3048,
        yd: 0.9144,
        yard: 0.9144,
        yards: 0.9144,
        mi: 1609.344,
        mile: 1609.344,
        miles: 1609.344
    };

    if (units.hasOwnProperty(unit)) {
        return units[unit];
    }
    return null;
}

function formatNumber(num) {
    return String(Number(num.toFixed(4)));
}
