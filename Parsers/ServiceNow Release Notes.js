/*
activation_example:!release vancouver, !release latest flow, !release xanadu workspace
regex:!release
flags:gmi
*/

(function(current) {
    var input = current.text.replace(/!release/gmi, "").trim();
    var slacker = new x_snc_slackerbot.Slacker();
    
    // Parse input to determine version and optional topic
    var parts = input.toLowerCase().split(/\s+/);
    var version = parts[0] || 'latest';
    var topic = parts.slice(1).join(' ');
    
    // ServiceNow release version mapping
    var releaseMap = {
        'latest': 'xanadu',
        'xanadu': 'xanadu',
        'washington': 'washington',
        'vancouver': 'vancouver',
        'utah': 'utah',
        'tokyo': 'tokyo',
        'sandiego': 'sandiego',
        'rome': 'rome',
        'quebec': 'quebec'
    };
    
    var releaseName = releaseMap[version] || version;
    
    // If no input provided, show help
    if (!input) {
        var helpMessage = '*ServiceNow Release Notes Helper* :books:\n\n' +
            '*Usage:*\n' +
            '• `!release <version>` - Get release notes for a specific version\n' +
            '• `!release latest` - Get latest release information\n' +
            '• `!release latest <topic>` - Search for a topic in latest release\n' +
            '• `!release <version> <topic>` - Search for a topic in specific version\n\n' +
            '*Supported Versions:*\n' +
            '`xanadu`, `washington`, `vancouver`, `utah`, `tokyo`, `sandiego`, `rome`, `quebec`\n\n' +
            '*Examples:*\n' +
            '• `!release vancouver` - Vancouver release notes\n' +
            '• `!release latest flow` - Search for "flow" in latest release\n' +
            '• `!release utah workspace` - Search for "workspace" in Utah release';
        
        slacker.send_chat(current, helpMessage, false);
        return;
    }
    
    // Build the base URL for ServiceNow docs
    var baseUrl = 'https://docs.servicenow.com';
    var releaseNotesUrl = baseUrl + '/bundle/' + releaseName + '-release-notes/page/release-notes.html';
    
    // If topic is provided, use AI to search and summarize
    if (topic) {
        searchReleaseNotes(releaseName, topic, slacker, current);
    } else {
        // Just provide the release notes link and highlights
        getReleaseHighlights(releaseName, releaseNotesUrl, slacker, current);
    }
    
    /**
     * Get release highlights for a specific version
     */
    function getReleaseHighlights(release, url, slacker, current) {
        // Fetch the release notes page
        var rm = new sn_ws.RESTMessageV2();
        rm.setHttpMethod('GET');
        rm.setEndpoint(url);
        
        try {
            var response = rm.execute();
            var statusCode = response.getStatusCode();
            
            if (statusCode === 200) {
                var body = response.getBody();
                
                // Use AI to extract key highlights
                var chatReq = new sn_ws.RESTMessageV2();
                chatReq.setEndpoint('https://api.openai.com/v1/chat/completions');
                chatReq.setHttpMethod("POST");
                chatReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("openai.key"));
                chatReq.setRequestHeader('Content-Type', "application/json");
                
                var aiBody = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a ServiceNow expert. Extract the top 5-7 key highlights from release notes. Format using Slack markdown with *bold* for feature names and bullet points. Keep it concise and developer-focused."
                        },
                        {
                            "role": "user",
                            "content": "Extract key highlights from this HTML (focus on new features, improvements, and breaking changes):\n\n" + body.substring(0, 15000)
                        }
                    ],
                    "max_tokens": 500
                };
                
                chatReq.setRequestBody(JSON.stringify(aiBody));
                var chatResponse = chatReq.execute();
                var chatBody = JSON.parse(chatResponse.getBody());
                var highlights = chatBody.choices[0].message.content;
                
                var message = '*ServiceNow ' + release.charAt(0).toUpperCase() + release.slice(1) + ' Release Notes* :rocket:\n\n' +
                    highlights + '\n\n' +
                    ':link: <' + url + '|View Full Release Notes>';
                
                slacker.send_chat(current, message, false);
            } else {
                // Fallback to direct link
                var fallbackMsg = '*ServiceNow ' + release.charAt(0).toUpperCase() + release.slice(1) + ' Release Notes* :books:\n\n' +
                    ':link: <' + url + '|View Release Notes>\n\n' +
                    '_Tip: Add a topic to search, e.g., `!release ' + release + ' flow`_';
                
                slacker.send_chat(current, fallbackMsg, false);
            }
        } catch (e) {
            gs.error('Release Notes Parser Error: ' + e.message);
            var errorMsg = '*ServiceNow ' + release.charAt(0).toUpperCase() + release.slice(1) + ' Release Notes* :books:\n\n' +
                ':link: <' + url + '|View Release Notes>\n\n' +
                '_Tip: Add a topic to search, e.g., `!release ' + release + ' flow`_';
            
            slacker.send_chat(current, errorMsg, false);
        }
    }
    
    /**
     * Search for a specific topic in release notes
     */
    function searchReleaseNotes(release, topic, slacker, current) {
        var searchUrl = 'https://www.servicenow.com/docs/bundle/' + release + '-release-notes/page/release-notes.html';
        
        // Fetch the release notes page
        var rm = new sn_ws.RESTMessageV2();
        rm.setHttpMethod('GET');
        rm.setEndpoint(searchUrl);
        
        try {
            var response = rm.execute();
            var statusCode = response.getStatusCode();
            
            if (statusCode === 200) {
                var body = response.getBody();
                
                // Use AI to search for the topic
                var chatReq = new sn_ws.RESTMessageV2();
                chatReq.setEndpoint('https://api.openai.com/v1/chat/completions');
                chatReq.setHttpMethod("POST");
                chatReq.setRequestHeader("Authorization", "Bearer " + gs.getProperty("openai.key"));
                chatReq.setRequestHeader('Content-Type', "application/json");
                
                var aiBody = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a ServiceNow expert. Search the release notes for information about the requested topic. Provide a concise summary with key points using Slack markdown (*bold*, bullet points). If the topic is not found, say so clearly."
                        },
                        {
                            "role": "user",
                            "content": "Search for information about '" + topic + "' in these release notes:\n\n" + body.substring(0, 15000)
                        }
                    ],
                    "max_tokens": 600
                };
                
                chatReq.setRequestBody(JSON.stringify(aiBody));
                var chatResponse = chatReq.execute();
                var chatBody = JSON.parse(chatResponse.getBody());
                var searchResults = chatBody.choices[0].message.content;
                
                var message = '*ServiceNow ' + release.charAt(0).toUpperCase() + release.slice(1) + ' - "' + topic + '"* :mag:\n\n' +
                    searchResults + '\n\n' +
                    ':link: <' + searchUrl + '|View Full Release Notes>';
                
                slacker.send_chat(current, message, false);
            } else {
                // Fallback to search link
                var encodedTopic = encodeURIComponent(topic);
                var fallbackUrl = 'https://www.servicenow.com/docs/search?q=' + encodedTopic + '&facetreset=yes&filter=bundle:' + release + '-release-notes';
                
                var fallbackMsg = '*Searching for "' + topic + '" in ' + release.charAt(0).toUpperCase() + release.slice(1) + '* :mag:\n\n' +
                    'I couldn\'t fetch the release notes directly, but here\'s a search link:\n' +
                    ':link: <' + fallbackUrl + '|Search Results for "' + topic + '">';
                
                slacker.send_chat(current, fallbackMsg, false);
            }
        } catch (e) {
            gs.error('Release Notes Search Error: ' + e.message);
            
            // Fallback to search link
            var encodedTopic = encodeURIComponent(topic);
            var fallbackUrl = 'https://www.servicenow.com/docs/search?q=' + encodedTopic + '&facetreset=yes&filter=bundle:' + release + '-release-notes';
            
            var errorMsg = '*Searching for "' + topic + '" in ' + release.charAt(0).toUpperCase() + release.slice(1) + '* :mag:\n\n' +
                ':link: <' + fallbackUrl + '|Search Results for "' + topic + '">';
            
            slacker.send_chat(current, errorMsg, false);
        }
    }
    
})(current);