/*
activation_example:!calculate <expression>
regex:!calculate (.+)
flags:gmi
*/

var input = current.text.trim();

// Extract the mathematical expression from the input
var match = input.match(/!calculate (.+)/);
var expression = match ? match[1] : "";

function evaluateExpression(expr) {
    // Remove whitespace
    expr = expr.replace(/\s+/g, '');

    // Basic validation to allow only numbers and operators
    if (!/^[\d+\-*/().]+$/.test(expr)) {
        throw new Error("Invalid expression");
    }

    // Use Function constructor to evaluate the expression safely
    return new Function('return ' + expr)();
}

try {
    var result = evaluateExpression(expression);

    // Round the result to 2 decimal places
    var roundedResult = result.toFixed(2);

    // Send the calculated result back to the user
    new x_snc_slackerbot.Slacker().send_chat(current, `The result is: ${roundedResult}`, false);
  
} catch (error) {
    // Handle errors if the expression is invalid
    new x_snc_slackerbot.Slacker().send_chat(current, "Oops! I couldn't understand that. Please provide a valid mathematical expression.", false);
}
