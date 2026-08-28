// Parser Name: Docs
// Listens for: !docs <search term>
// What it does: Returns a link to ServiceNow documentation using the current URL format
 
var text = current.text + '';
var docsMatch = text.match(/!docs\s+(.*)/i);
 
if (docsMatch) {
    var searchTerm = docsMatch[1].trim();
    var encodedTerm = encodeURIComponent(searchTerm);
    var docsUrl = 'https://www.servicenow.com/docs/csh?version=latest&topicname=' + encodedTerm;
    var searchUrl = 'https://www.servicenow.com/docs/?q=' + encodedTerm;
 
    new x_snc_slackerbot.Slacker().send_chat(current,
        '*ServiceNow Docs: ' + searchTerm + '*\n' +
        ':book: Search results: ' + searchUrl + '\n' +
        ':link: Direct topic link: ' + docsUrl
    );
}
 
