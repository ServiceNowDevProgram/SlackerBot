/*
activation_example:!issue Slacker Moldy donut, !issue -help
regex:^!issue\u0020?
flags:i
*/

// Prepare variables
var clientId = gs.getProperty('slackerbot.issueapp.id','invalid_id');
var providerId = gs.getProperty('slackerbot.issueapp.provider','invalid_id');
var installId = gs.getProperty('slackerbot.issueapp.install_id','invalid_id');
var repositoryOwner = gs.getProperty('slackerbot.issueapp.owner','ServiceNowDevProgram');
var supportedRepos = getSupportedRepos();
var message = '';
var selectedRepository = '';
var body, blockMsg;
var titleLength = 60; // Lets be brief since we'll reflect the description in the body too
var slacker = new x_snc_slackerbot.Slacker();

// Get message
var issueCall = current.text.replace(/^!issue\u0020?/i,'').trim();
var callArr = issueCall.split(' ');

// Validate message
if(callArr.length == 0){
    message = '!issue must be called with the name of a repo, followed by the issue description. For example: `!issue Slacker My donut has no hole`\n\nThe full list of repos and accepted triggers can be found by sending !issue -help';
}

if(callArr.length == 1){
    if(callArr[0] == '-help'){
        message = 'SNDevs Slacker Issue Reporter\nA parser for creating issues against supported repositories\n\nUsage: `!issue repo-name description`\nExample: `!issue syntax_macros Capture syntax for calculating distance with GlideGeoPoint`\n\nSupported Repositories:';
        for(var repo in supportedRepos){
            message += '\n\t`' + repo + '` - Accepted triggers:\n\t\t`' + supportedRepos[repo].join('`, `') + '`';
        }
    } else {
        message = '!issue must be called with the name of a repo, followed by the issue description. For example: `!issue Slacker My donut has no hole`\n\nThe full list of repos and accepted triggers can be found by sending !issue -help';
    }
}

if(callArr.length >= 2){
    var repoPar = callArr[0].toLowerCase();
    for(var repo in supportedRepos){
        if(supportedRepos[repo].indexOf(repoPar) > -1){
            selectedRepository = repo;
            callArr.shift();
        }
    }
}

// Validate if we should progress
if(message.length > 0 || selectedRepository.length == 0 || clientId == 'invalid_id' || providerId == 'invalid_id' || installId == 'invalid_id'){
	if(selectedRepository.length == 0 && callArr.length > 1 && callArr[0] != '-help'){
		message = 'The provided repository is not supported by the SNDevs Slacker Issue Reporter at this time. New repos can be added by submitting a pull request.';
	} else if(message.length == 0 && (clientId == 'invalid_id' || providerId == 'invalid_id' || installId == 'invalid_id')){
		message = 'A required property has not been configured. Please advise users in <#CKJ2TE0AK> so this can be addressed.';
	}
	slacker.send_chat(current, message, false);
} else {
    body = {};
    body.title = callArr.join(' ').substring(0,titleLength);
    body.body = callArr.join(' ');

    var token = getJWT(clientId, providerId);
    var accessToken = getAccessToken(installId, token);

    if(!accessToken){
        message = 'An issue occurred while generating the access token for GitHub. Please advise users in <#CKJ2TE0AK> so they can investigate.';
        slacker.send_chat(current, message, false);
    } else {
        var output = createIssue(repositoryOwner, selectedRepository, body, accessToken);
        if(!output){
            message = 'An issue occured while creating an issue over the API. Please wait a few seconds and try again. If the issue persists, please advise users in <#CKJ2TE0AK> so they can investigate.';
            slacker.send_chat(current, message, false);
        }  else {
            blockMsg = buildBlockMessage(output.number, output.html_url);
            slacker.send_chat(current, message, false);
        }
    }
}

/**
 * Get list of supported repos
 * @returns {Object.<string,string[]>} Object of repos as keys and accepted triggers as array values
 */
function getSupportedRepos() {
    // Make triggers lowercase so that we can do case-insensitive matching
    var repoMap = {
        'code-snippets':                    ['code-snippets','snippets'],
        'SlackerBot':                       ['slackerbot','slacker','slackbot'],
        'UI-Builder-Conference-Notes-App':  ['ui-builder-conference-notes-app','conference-notes','notes-app'],
        'Points-Thing':                     ['points-thing','pt','points'],
        'Plants':                           ['plants'],
        'example-instancescan-checks':      ['example-instancescan-checks','checks','instancescan'],
        'syntax_macros':                    ['syntax_macros','macros'],
        'ServiceNow-GenAi-Prompt-Library':  ['serviceNow-genai-prompt-library','genai','prompts','prompt','library','prompt-library'],
        'Hacktoberfest':                    ['hacktoberfest']
    }
    
    return repoMap;
}

/**
 * Generate JSON Web Token (JWT) for GitHub
 * @param client {string} GitHub App Client ID
 * @param provider {string} Sys_ID of JWT Provider
 * @returns {string} Signed JWT
 */
function getJWT(client, provider){
    var jwtAPI = new sn_auth.GlideJWTAPI();
    var header = JSON.stringify({typ: 'JWT', alg: 'RSA256'});
    var exp = new GlideDateTime();
    exp.addSeconds(600);
    var now = new GlideDateTime();
    now.addSeconds(-60);
    var payloadObj = {
        iat: Math.floor(now.getNumericValue() / 1000),
        iss: client,
        exp: Math.floor(exp.getNumericValue() / 1000)
    };
    var payload = JSON.stringify(payloadObj);

    var jwt = jwtAPI.generateJWT(provider, header, payload);
    return jwt;
}

/**
 * Get Installation Access Token to act on behalf of App within installed scope
 * @param install {string} Installation ID for Organisation/User
 * @param jwt {string} Signed JWT
 * @returns {string|false} Installation Access Token
 */
function getAccessToken(install,jwt){
    var tokenRequest = new sn_ws.RESTMessageV2();
    tokenRequest.setEndpoint('https://api.github.com/app/installations/' + install + '/access_tokens');
    tokenRequest.setHttpMethod('POST');
    tokenRequest.setRequestHeader('Accept','application/vnd.github+json');
    tokenRequest.setRequestHeader('Authorization','Bearer ' + jwt);
    
    var tokenResp = tokenRequest.execute();
    if(tokenResp.getStatusCode() == 201){
        return (JSON.parse(tokenResp.getBody())).token;
    }
    return false;
}

/**
 * Create an issue in GitHub
 * @param owner {string} Name of repo owner
 * @param repo {string} Name of repo
 * @param body {Object.<string,string>} Issue payload
 * @param token {string} Installation access token
 * @returns Created issue payload
 */
function createIssue(owner, repo, body, token){
    var issueRequest = new sn_ws.RESTMessageV2();
    issueRequest.setEndpoint('https://api.github.com/repos/' + owner + '/' + repo + '/issues');
    issueRequest.setHttpMethod('POST');
    issueRequest.setRequestHeader('Accept','application/vnd.github+json');
    issueRequest.setRequestHeader('Authorization','Bearer ' + token);
    issueRequest.setRequestBody(JSON.stringify(body));
    
    var issueResp = issueRequest.execute();
    if(issueResp.getStatusCode() == 201){
        return JSON.parse(issueResp.getBody());
    }
    return false;
}

/**
 * Build a block message for created issues
 * @param number {integer} Issue number
 * @param url {string} Issue URL
 * @returns Slack Block message
 */
function buildBlockMessage(number, url){
    var blocks = {
        'blocks': [
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': '*Issue #' + number + ' created* :tada:'
                }
            },
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': 'Click this button to view your issue'
                },
                'accessory': {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'Open GitHub',
                        'emoji': true
                    },
                    'style': 'primary',
                    'url': url
                }
            }
        ]
    };
    blocks.text = 'Issue #' + number + ' created!';
    return blocks;
}
