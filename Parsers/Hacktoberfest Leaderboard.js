/*
activation_example:!hackleaders
regex:!hackleaders?|!hacktoberfestleaderboard|!leaderboardhacktoberfest
flags:gmi
stop_processing:false
*/

var count = new GlideAggregate("x_snc_hacktrack_event");
count.addEncodedQuery(
  "userISNOTEMPTY^pointISNOTEMPTY^point!=0^sys_created_onDATEPARTSeptember@javascript:gs.datePart('month','sep','EE')^ORsys_created_onDATEPARTOctober@javascript:gs.datePart('month','oct','EE')^ORsys_created_onDATEPARTNovember@javascript:gs.datePart('month','nov','EE')^sys_created_onONThis year@javascript:gs.beginningOfThisYear()@javascript:gs.endOfThisYear()^payload!=ignore"
);
count.groupBy("user");
count.addAggregate("SUM", "point");
count.orderByAggregate("SUM", "point");
count.query();
var items = [];
while (count.next()) {
  var item = {};
  item.username = count.user.toString();
  item.points = parseInt(count.getAggregate("SUM", "point").split(".")[0]);
  items.push(item);
}
var leaderboard = [];
var leaderboard_index = 0;
var count = 0;
if (Math.floor(items.length * 0.05) > 0) {
  leaderboard.push("*Top 5% contributors:*");
  count = Math.floor(items.length * 0.05);
  var this_section = [];
  for (var i05 = 0; i05 < count; i05++) {
    this_section.push(items[leaderboard_index].username);
    leaderboard_index++;
  }
  leaderboard.push(this_section.join(", "));
  leaderboard.push("");
}
if (Math.floor(items.length * 0.1) > 0) {
  leaderboard.push("*Top 10% contributors:*");
  count = Math.floor(items.length * 0.1) - Math.floor(items.length * 0.05);
  this_section = [];
  for (var i10 = 0; i10 < count; i10++) {
    this_section.push(items[leaderboard_index].username);
    leaderboard_index++;
  }
  leaderboard.push(this_section.join(", "));
  leaderboard.push("");
}
if (Math.floor(items.length * 0.25) > 0) {
  leaderboard.push("*Top 25% contributors:*");
  count =
    Math.floor(items.length * 0.25) -
    Math.floor(items.length * 0.1) -
    Math.floor(items.length * 0.05);
  this_section = [];
  for (var i25 = 0; i25 < count; i25++) {
    this_section.push(items[leaderboard_index].username);
    leaderboard_index++;
  }
  leaderboard.push(this_section.join(", "));
  leaderboard.push("");
}
if (Math.floor(items.length * 0.5) > 0) {
  leaderboard.push("*Top 50% contributors:*");
  count =
    Math.floor(items.length * 0.5) -
    Math.floor(items.length * 0.25) -
    Math.floor(items.length * 0.1) -
    Math.floor(items.length * 0.05);
  this_section = [];
  for (var i50 = 0; i50 < count; i50++) {
    this_section.push(items[leaderboard_index].username);
    leaderboard_index++;
  }
  leaderboard.push(this_section.join(", "));
  leaderboard.push("");
}

new x_snc_slackerbot.Slacker().send_chat(current, leaderboard.join("\n"), true);
