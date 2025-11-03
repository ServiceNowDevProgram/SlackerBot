/*
activation_example:!verify-admin @Astrid, !verify-admin -help
regex:^!(?:un)?verify-admin\u0020?
flags:gi
*/

if (
  current.channel == "GD51HTR46" ||
  current.channel == "G9LAJG7G8" ||
  current.channel == "G7M4AP6U8"
) {
  //admin channels on sndevs
  var messageBody = "";
  var userId = "";
  var description = "";
  var verificationStatus = null;
  var slacker = new x_snc_slackerbot.Slacker();

  // Grab user ID and then prep invocation if User-visible info provided
  var invocation = current.text
    .replace(/^!(?:un)?verify-admin\u0020?/gi, "")
    .trim();
  var paramArr = invocation.split(" ");

  if (paramArr.length == 0) {
    messageBody =
      "!verify-admin must be called with a user tag, followed by an optional parameter and optional description. For example: `!verify-admin @Astrid -unv Is an Impasta`\n\nThe full list of accepted triggers can be found by sending `!verify-admin -help`";
  }

  if (paramArr.length == 1 && paramArr[0] == "-help") {
    messageBody =
      "Admin Tool - Verify user\nA parser for setting user verification and descriptions. *Note:* This parser can only be triggered from admin channels specified.\n\nUsage: `!verify-admin @username [-v|-unv] [message]`\nExamples:\n`!verify-admin @Astrid -unv Is an Impasta`\n`!verify-admin @Astrid Some Role, Some Company`\n`!verify-admin @Astrid -v`\n\nSupported flags:\n-v: Verify the user\n-unv: Remove verification from user\n-help: Show this message";
  }

    if (/^<@.*?>$/.test(paramArr[0])) {
      messageBody = paramArr[0];
      userId = paramArr[0].replace(/[<>@]/g, "");
      paramArr.shift();
    } else {
      messageBody =
        "!verify-admin must be called with a user tag, followed by an optional parameter and optional description. For example: `!verify-admin @Astrid -unv Is an Impasta`\n\nThe full list of accepted triggers can be found by sending `!verify-admin -help`";
      slacker.send_chat(current, messageBody, true);
    }
 
  if (paramArr.indexOf("-v") > -1 && paramArr.indexOf("-unv") > -1) {
    messageBody =
      "Please only provide one verify parameter in your message. Verification message ignored.";
    slacker.send_chat(current, messageBody, true);
  } else {
    if (/^!unverify/.test(current.text)) {
      verificationStatus = false;
    } else if (paramArr.indexOf("-v") > -1) {
      verificationStatus = true;
    } else if (paramArr.indexOf("-unv") > -1) {
      verificationStatus = false;
    } else if (verificationStatus == null) {
      verificationStatus = true;
    }

    description = paramArr.join(" ");
    var grUser = new GlideRecord("x_snc_slackerbot_user");
    if (grUser.get("user_id", userId)) {
      verificationStatus != null
        ? grUser.setValue("verified", verificationStatus)
        : grUser.getValue("verified");
      if (description.length > 0) {
        grUser.setValue("user_info", description);
      } else {
        description = grUser.getValue("user_info");
      }

      grUser.update();

      messageBody =
        "Updated <@" +
        userId +
        ">'s verification information with the following info:\n";
      messageBody +=
        "Verification status: " +
        (verificationStatus ? "*Verified*" : "*Unverified*") +
        "\n";
      messageBody += "User information:\n>" + description;
    } else {
      messageBody += `I'm afraid I can't do that as the ~limit~ user (<@${userId}>) does not exist.`;
    }
    slacker.send_chat(current, messageBody, true);
  }
}
