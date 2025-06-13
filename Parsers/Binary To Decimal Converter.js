/*
activation_example:!converttoDecimal <binary_code>
regex:!bin2dec
flags:i
*/

// get the user input in format !bin2dec binary_code for example - !bin2dec 00110101 11111111
var input = current.text.trim();

// Extract the Binary expression from the input

var binaryCheckregx = /^[01\s]+$/; // Regular expression to check if input contains only binary characters and spaces
var commandRegex = /^!bin2dec ([01\s]+)$/; // Extract the binary expression, including spaces between bytes.
var match = input.match(commandRegex); // Updated commandRegex to include spaces between binary code
var expression = match ? match[1] : "";



function evaluateBinaryExpression(binary_code) {
    // Remove whitespace
    binary_code = binary_code.replace(/\s+/g, '');
    // execute the api to get the equivalent decimal value of binary
    var converter = new sn_ws.RESTMessageV2();
    var apiurl = 'https://networkcalc.com/api/binary/' + binary_code;
    converter.setEndpoint(apiurl); // set endpoint url
    converter.setHttpMethod('GET'); // GET method  
    var response = converter.execute();
    var result = JSON.parse(response.getBody()); // parse the response object
    return result;
}

try {
    // check the valid binary code in if statement
    if (binaryCheckregx.test(expression)) {
        var result = evaluateBinaryExpression(expression); // call to evaluateBinaryExpression

        var DecimalresultSlackMessage = "Decimal Value: " + result.converted;
        new x_snc_slackerbot.Slacker().send_chat(current, DecimalresultSlackMessage , false); // display the output to user


    } else {
        new x_snc_slackerbot.Slacker().send_chat(current, "Oops! I couldn't understand that. Please provide a valid Binary code.", false);

    }
} catch (error) {

    new x_snc_slackerbot.Slacker().send_chat(current, "Oops! Facing Issue while converting Binary to Decimal with error" + error, false); //handling exception in try block
}
 



