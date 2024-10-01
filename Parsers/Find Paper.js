/*
activation_example:!findpaper paper details
regex:!findpaper
flags:
*/

// Extracting the search query
var searchQuery = current.text.replace(/!findpaper/gmi, "").trim().substring(0, 1000);

// Searching for a research paper
var researchPaperRequest = new sn_ws.RESTMessageV2();
researchPaperRequest.setEndpoint('https://api.semanticscholar.org/graph/v1/paper/search?query=' + encodeURIComponent(searchQuery) + '&limit=1');
researchPaperRequest.setHttpMethod("GET");
researchPaperRequest.setRequestHeader("Accept", "application/json");

// Executing the API call
try {
    var response = researchPaperRequest.execute();
    var responseBody = response.getBody();
    var responseJson = JSON.parse(responseBody);
    
    // Extracting details of the first paper found
    if (responseJson && responseJson.data && responseJson.data.length > 0) {
        var paper = responseJson.data[0];
        var title = paper.title || "Title not available";
        var authors = paper.authors.map(author => author.name).join(", ") || "Authors not available";
        var year = paper.year || "Year not available";
        var url = paper.url || "URL not available";

        // Creating the message to send
        var message = `Here's a research paper I found:\n\nTitle: ${title}\nAuthors: ${authors}\nYear: ${year}\nURL: ${url}`;

        // Sending the response message
        new x_snc_slackerbot.Slacker().send_chat(current, message, false);
    } else {
        // No paper found for the given search query
        new x_snc_slackerbot.Slacker().send_chat(current, "Sorry, I couldn't find any research papers for your query.", false);
    }
} catch (e) {
    // Handling errors
    new x_snc_slackerbot.Slacker().send_chat(current, "An error occurred while trying to find a research paper.", false);
}
