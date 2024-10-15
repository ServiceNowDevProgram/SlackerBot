/*
activation_example:!hellofrom Miami, FL
regex:(!hellofrom)
flags:gmi
*/

var rawInput = current.text;
// Check if the user is requesting help
if (rawInput.trim().toLowerCase() === "!hellofrom -help") {
    provideHelpText();
} else {
    processHelloFromCommand(rawInput);
}

function provideHelpText() {
    var helpText = "SNDevs Slacker Hello From\n" +
        "A command to get the current date and time for a specified location.\n\n" +
        "Usage: `!hellofrom [location]`\n" +
        "Examples:\n" +
        "  `!hellofrom New York, NY`\n" +
        "  `!hellofrom Paris, France`\n" +
        "  `!hellofrom Tokyo`\n\n" +
        "Notes:\n" +
        "• You can specify a city by itself, or include a state or country for more precision.\n" +
        "• The command will return the current date and time for the specified location.";
    
    new x_snc_slackerbot.Slacker().send_chat(current, helpText, true);
}

function processHelloFromCommand(input) {
    var location = processLocationString(input);
    // You will need to create a global system property called 'timezone.token' and obtain an API key from https://ipgeolocation.io/ to use this parser.
    var apiKey = gs.getProperty("timezone.token");

    // Build the full endpoint
    var baseUrl = 'https://api.ipgeolocation.io/timezone';
    var searchUrl = baseUrl + '?location=' + location + '&apiKey=' + apiKey;

    // Make the API request
    var chatReq = new sn_ws.RESTMessageV2();
    chatReq.setEndpoint(searchUrl);
    chatReq.setHttpMethod("GET");
    var chatResponse = chatReq.execute();
    var chatResponseBody = JSON.parse(chatResponse.getBody());
    var dateTimeTxt = chatResponseBody.date_time_txt;

    var response = "Hello from " + location + ". Our current date and time is " + dateTimeTxt;

    new x_snc_slackerbot.Slacker().send_chat(current, response, true);
}

function processLocationString(input) {
    // Remove "!hellofrom" and trim
    var cleaned = input.replace(/^!hellofrom\s*/, '').trim();
    
    // Limit to first location (up to first comma if present)
    var limited = cleaned.split(',')[0].trim();
    
    return limited;
}
