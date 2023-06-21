/*
activation_example:!snname
regex:(!snname)|(!newname)|(!productname) 
flags:gmi
*/

var names = [
  {
    text: "Scheduled Jobs (again)",
    order: 0,
    end: true,
    nospace: true
  },
  {
    text: "List v3 (v2)",
    order: 0,
    end: true,
    nospace: true
  }
];

var buzzwords = ["Blockchain", "AI", "IoT", "BigData", "Cloud", "Quantum", "VR", "AR", "Cybersecurity", "Analytics", "MachineLearning", "DeepLearning", "NLP", "Cryptocurrency", "Bitcoin", "Agile", "DevOps", "Containers", "Microservices", "Fintech", "Insurtech", "Edtech", "SaaS", "PaaS", "IaaS", "5G", "AR", "VR", "Autonomous", "Drones", "EdgeComputing", "Robotics", "SmartHome", "DataScience", "DataMining", "Chatbot", "Wearable", "GenAI", "Integration", "Admin", "Reports", "SEO", "UI", "UX", "GrowthHacking", "DataBreach", "DDoS", "Ransomware", "Firewall"];
for (var i in buzzwords){
  var buzzword = {
    text: buzzwords[i],
    order: 0,
    end: false,
    nospace: true
  };
  names.push(buzzword);
}

var suffices = ["Experience", "UI", "Framework", "Workspace", "Environment", "Platform", "Suite", "Engine", "System", "Network", "Cloud", "Hub", "Interface", "Kit", "Tool", "Pro", "Plus", "Max", "X", "Matrix", "Box", "Gate", "Base", "Dome", "Sphere", "Realm", "Vista", "Horizon", "Nexus", "Oasis", "Solutions", "Point", "Link", "Connect", "Verse", "Infinity", "Edge", "Prime", "Core", "Zone", "Lab", "Fusion", "Rise", "Boost", "Wave", "Dynamo", "Pulse", "Bolt", "Vault", "Rush", "Expanse", "Grid"];
for (var j in suffices){
  var suffix = {
    text: suffices[j],
    order: 1,
    end: false,
    nospace: false
  };
  names.push(suffix);
}

var enders = ["2.0", "Pro", "V2", "Enterprise", "Lite", "Premium", "Plus", "Advanced", "Deluxe", "Professional", "Ultimate", "Classic", "Standard", "Express", "Turbo", "Gold", "Silver", "Bronze", "V1", "V3", "V5", "V10", "3.0", "4.0", "5.0", "X", "XL", "XXL", "LE", "SE", "Ultra", "Mega", "Giga", "Tera", "Peta", "Max", "Prime", "Alpha", "Beta", "Gamma", "Omega", "NextGen", "Future", "2023", "2024", "2025"];

var currentOrder = 0;
var results = [];

while (currentOrder < 2) {
  var filteredNames = names.filter(function(obj) {
    return obj.order === currentOrder;
});
  if (filteredNames.length > 0){
    var item = filteredNames[Math.floor(Math.random()*filteredNames.length)];
    if (!item.nospace){
      if (Math.random() < 0.5) results.push(" ");
    }
    results.push(item.text);
    if (item.end) break;
    currentOrder++;
  } else {
    break;
  }
}

if (Math.random() < 0.5) results.push(" " + enders[Math.floor(Math.random()*enders.length)]);

var message = "`Introducing ServiceNow's newest product:`\n:star: *" + results.join("") + "* :star";
var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, message, false);
