/*
activation_example:!verify-admin @Astrid, !unverify-admin @Astrid, !verify-admin -help
regex:^!(?:un)?verify-admin\u0020?
flags:gi
*/

(function(){
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
  
    // Determine the base command to set default verification status
    // If it starts with !unverify, default is false. Otherwise (verify), default is true.
    var isUnverifyCommand = current.text.toLowerCase().indexOf("!unverify-admin") === 0;
    var defaultVerificationStatus = isUnverifyCommand ? false : true;
  
    // Grab user ID and then prep invocation if User-visible info provided
    var invocation = current.text
      .replace(/^!(?:un)?verify-admin\u0020?/gi, "")
      .trim();
    var paramArr = invocation.split(" ");
  
    // 1. Handle -help flag
    if (paramArr.length == 1 && paramArr[0] == "-help") {
      messageBody =
        "*Admin Tool - Verify User*\n" +
        "A parser for setting user verification and descriptions. \n" +
        "*Note:* This parser can only be triggered from admin channels.\n\n" +
        "*Usage:*\n" +
        "`!verify-admin @username [optional description]`\n" +
        "`!unverify-admin @username [optional description]`\n\n" +
        "*Examples:*\n" +
        "`!verify-admin @Astrid Is an Impasta`\n" +
        "`!unverify-admin @Astrid Is an Impasta`\n" +
        "`!verify-admin @Astrid Some Role, Some Company`\n" +
        "`!verify-admin @Astrid -v`\n\n" +
        "*Supported flags:*\n" +
        "`-v`: Verify the user (default for !verify-admin)\n" +
        "`-unv`: Unverify the user (default for !unverify-admin)\n" +
        "`-help`: Show this message";
      
      slacker.send_chat(current, messageBody, true);
      return;
    }
  
    // 2. Validate that a user tag is provided
    if (paramArr.length == 0 || !/^<@.*?>$/.test(paramArr[0])) {
      messageBody =
        "!verify-admin must be called with a user tag, followed by an optional parameter and optional description. For example: `!verify-admin @Astrid -unv Is an Impasta`\n\nThe full list of accepted triggers can be found by sending `!verify-admin -help`";
      slacker.send_chat(current, messageBody, true);
      return;
    }
  
    // 3. Extract User ID
    userId = paramArr[0].replace(/[<>@]/g, "");
    paramArr.shift();
  
    // 4. Validate Flags
    var hasV = paramArr.indexOf("-v") > -1;
    var hasUnv = paramArr.indexOf("-unv") > -1;
  
    if (hasV && hasUnv) {
      messageBody =
        "Please only provide one verify parameter in your message. Verification message ignored.";
      slacker.send_chat(current, messageBody, true);
      return;
    }
  
    // 5. Determine Verification Status
    // Flags override the default based on the command name
    if (hasUnv) {
      verificationStatus = false;
    } else if (hasV) {
      verificationStatus = true;
    } else {
      verificationStatus = defaultVerificationStatus;
    }
  
    // 6. Extract Description
    // Filter out the flags from the description
    var descriptionArr = paramArr.filter(function(item) {
      return item !== "-v" && item !== "-unv";
    });
    description = descriptionArr.join(" ");
  
    // 7. Update User Record
    var grUser = new GlideRecord("x_snc_slackerbot_user");
    if (grUser.get("user_id", userId)) {
      grUser.setValue("verified", verificationStatus);
      
      if (description.length > 0) {
        grUser.setValue("user_info", description);
      } else {
        // If no new description, keep the old one
        description = grUser.getValue("user_info");
      }
  
      grUser.update();
  
      messageBody =
        "Updated <@" +
        userId +
        ">'s verification information:\n";
      messageBody +=
        "Verification status: " +
        (verificationStatus ? "*Verified*" : "*Unverified*") +
        "\n";
      messageBody += "User information:\n>" + description;
    } else {
      messageBody = "I'm afraid I can't do that as the user (<@" + userId + ">) does not exist.";
    }
    
    slacker.send_chat(current, messageBody, true);
  }
})();
