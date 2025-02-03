/*
activation_example:!appupdate
regex:(!appupdate|!update|!app-update|!bulkupdate|!bulk-update|!plugin|!plugins)
flags:gmi
*/

// NOTE!
// When you update eric_script, you must find/replace \n with \\n and ` with \`

const eric_script = `
/*----------------------------------------------------*/
/*                      AUTO                          */
/*  Have a bunch of apps that need to be updated?     */
/*  Run this and follow the directions in the output  */
/*  It will automaticallybuild and run a batch        */
/*  install of all of the needed updates.             */
/*                                                    */
/*         Latest code always available at            */
/*         https://snwizard.com/update-apps           */
/*                                                    */
/*----------------------------------------------------*/

//Want Demo Data with the app?
var loadDemoData = true;
var updateCheck = false; //this can take some time to run and adds a LOT of stuff to the log making the important bit harder to find

if (updateCheck) new sn_appclient.UpdateChecker().checkAvailableUpdates();

var prevName;
var appsArray = [];
var grSSA = new GlideRecord("sys_store_app");
grSSA.addEncodedQuery(
    "install_dateISNOTEMPTY^hide_on_ui=false^vendor=ServiceNow^ORvendorISEMPTY"
);
grSSA.orderBy("name");
grSSA.orderBy("version");
grSSA.query();
while (grSSA.next()) {
    var curName = grSSA.getValue("name");
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
            requested_version: grSSA.getValue("latest_version"),
        };
        appsArray.push(appObject);
    }
}

function updateAvailable(grSSA) {
    var installedVersion = grSSA.getValue("version");
    var latestVersion = grSSA.getValue("latest_version");
    var installedArray = installedVersion.split(".");
    var latestArray = latestVersion.split(".");
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
    gs.info("\\n\\n------------------------------------------------\\n\\nLinks to track progress below the payload information\\n\\n(scroll down)\\n\\n-----------------------------------------------\\n\\n");

    var appsPackages = {};
    appsPackages.packages = appsArray;
    appsPackages.name = "Update Apps";
    var data = new global.JSON().encode(appsPackages);

    var baseUrl = gs.getProperty("glide.servlet.uri");
    var update = new sn_appclient.AppUpgrader().installBatch(data);
    var updateObj = JSON.parse(update);
    gs.info(
        "\\n\\n------------------------------------------------\\n\\nOpen the Batch install link to monitor the installation progress. It may take some time for the apps to all populate in the related list. After all apps have populated the install will start and the State will change to In progress.\\n\\nBatch install:\\n" +
        baseUrl +
        "nav_to.do?uri=sys_batch_install_plan.do?sys_id=" +
        updateObj.batch_installation_id +
        "\\n\\nExecution tracker:\\n" +
        baseUrl +
        "nav_to.do?uri=sys_progress_worker.do?sys_id=" +
        updateObj.execution_tracker_id +
        "\\n\\n-----------------------------------------------\\n\\n"
    );
    var grSBIP = new GlideRecord('sys_batch_install_plan');
if (grSBIP.get(updateObj.batch_installation_id)) {
    grSBIP.setValue('notes','It may take some time for the apps to all populate in the related list below (you can refresh the list as needed to see them populating). \\n\\nAfter all apps have populated the install will start and the State (above) will change to In progress. \\n\\nWhen the batch is done the state will update to Installed');
    grSBIP.update();
}
} else {
    gs.info(
        "\\n\\n-----------------------------------------------\\n\\nAll apps appear to be up-to-date. \\n\\nIf you think this is incorrect please try running this script again with \`updateCheck\` set to \`true\`. This will check the store for any new updates.\\n(sometimes there are apps in the Application Manager that say that there are updates but you can't actually update them)\\n\\n-----------------------------------------------\\n\\n"
    );
}
`;

// Using block kit because the script is too long for a regular message
const message = {
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "<@U6E2TEKQ9> made a cool script for bulk updating apps!\n\n"
      }
    },
    {
      "type": "rich_text",
      "elements": [
        {
          "type": "rich_text_preformatted",
          "elements": [
            {
              "type": "text",
              "text": eric_script
            }
          ]
        }
      ]
    }
  ]
}
new x_snc_slackerbot.Slacker().send_chat(current, message, true);
