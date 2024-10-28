/*
activation_example:!appupdate
regex:^!newline\b
flags:gmi
*/

const eric_script = `
/*----------------------------------------------------*/
/*                                                    */
/*  Have a bunch of apps that need to be updated?     */
/*  Run this and follow the directions in the output  */
/*  It will build a payload and use the CI/CD API to  */
/*  run a batch install of all of the needed updates. */
/*                                                    */
/*----------------------------------------------------*/

//Want Demo Data with the app?
var loadDemoData = true;
var updateCheck = false; //this can take some time to run and adds a LOT of stuff to the lod making the important bit harder to find

if (updateCheck)
    new sn_appclient.UpdateChecker().checkAvailableUpdates();

var prevName;
var appsArray = [];
var grSSA = new GlideRecord('sys_store_app');
grSSA.addEncodedQuery('install_dateISNOTEMPTY^hide_on_ui=false^vendor=ServiceNow^ORvendorISEMPTY');
grSSA.orderBy('name');
grSSA.orderBy('version');
grSSA.query();
while (grSSA.next()) {
    var curName = grSSA.getValue('name');
    var latestVersion = updateAvailable(grSSA);
    if (curName == prevName) {
        continue;
    }
    if (latestVersion) {
        prevName = curName;
        var appObject = {
            displayName: curName,
            id: grSSA.getUniqueValue(),
            load_demo_data: loadDemoData,
            type: "application",
            requested_version: grSSA.getValue('latest_version')
        };
        appsArray.push(appObject);
    }
}
function updateAvailable(grSSA) {
    var installedVersion = grSSA.getValue('version');
    var latestVersion = grSSA.getValue('latest_version');
    var installedArray = installedVersion.split('.');
    var latestArray = latestVersion.split('.');
    var len = Math.max(installedArray.length, latestArray.length);
    for (var i = 0; i < len; i++) {
        var installed = installedArray[i] ? parseInt(installedArray[i]) : 0;
        var latest = latestArray[i] ? parseInt(latestArray[i]) : 0;
        if (installed < latest) {
            return true;
        } else if (installed > latest) {
            return false;
        }
    }
    return false;
}
if (appsArray.length > 0) {
    var appsPackages = {};
    appsPackages.packages = appsArray;
    appsPackages.name = 'Update Apps';
    var data = new global.JSON().encode(appsPackages);

    var url = gs.getProperty('glide.servlet.uri') +'$restapi.do?ns=sn_cicd&service=CICD%20Batch%20Install%20API&version=latest';
    gs.info('\\nOpen the following URL in a new tab:\\n\\n' + url + '\\n\\ncopy/paste the following JSON into the "Raw" Request body\\n\\n' + data);
} else {
    gs.info("\\nNo apps to update found.\\nIf you think this is incorrect please try running this script again with `updateCheck` set to `true`. This will check the store for any new updates.\\n\\n(sometimes there are apps in the Application Manager that say that there are updates but you can't actually update them)");
}
`

const message = "<@U6E2TEKQ9> made a cool script for bulk updating apps!\n\n" + eric_script;

new x_snc_slackerbot.Slacker().send_chat(current, message, true);
