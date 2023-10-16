/*
activation_example:!animal name of animal
regex:!animal
flags:gmi
*/

var where = current.text.indexOf('!animal ') + 8;
var term = current.text.substr(where).trim().replace(/\s/g, '+');
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint('https://api.api-ninjas.com/v1/animals?name=' + term);
chatReq.setHttpMethod("GET");

// Pull key from instance system properties
chatReq.setRequestHeader('X-Api-Key', gs.getProperty('x_snc_slackerbot.SlackerBot.animal.token'));
var chatResponse = chatReq.execute();
var chatResponseBody = chatResponse.getBody();

try {
  // Parse the API response as JSON
  var responseData = JSON.parse(chatResponseBody);

  // Check if the API response contains any data
  if (Array.isArray(responseData) && responseData.length > 0) {
	//Display 3 random animals
    var maxResults = 3; 
    var shuffledIndices = [];

    // Create an array of indices
    for (var i = 0; i < responseData.length; i++) {
      shuffledIndices.push(i);
    }

    // Shuffle the indices
    for (var i = shuffledIndices.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffledIndices[i];
      shuffledIndices[i] = shuffledIndices[j];
      shuffledIndices[j] = temp;
    }

    // Iterate through the first 3 shuffled animals in the array
    for (var i = 0; i < Math.min(maxResults, shuffledIndices.length); i++) {
      var index = shuffledIndices[i];
      processAnimal(responseData[index]);
    }
  } else {
    new x_snc_slackerbot.Slacker().send_chat(current, "No fun facts for the provided animal.", false);
  }
} catch (ex) {

  // Handle errors gracefully
  gs.error("An error occurred: " + ex.getMessage());
  new x_snc_slackerbot.Slacker().send_chat(current, "An error occurred while fetching animal facts. Please try again later.", false);
}

function processAnimal(animal) {
  var animalName = animal.name;
  var animalLocations = animal.locations;
  var animalLifespan = animal.characteristics.lifespan;
  var animalFood = animal.characteristics.favorite_food;
  var animalSlogan = animal.characteristics.slogan;
  var animalWeight = animal.characteristics.weight;
  var animalFeature = animal.characteristics.distinctive_feature;
  var animalMostfeature = animal.characteristics.most_distinctive_feature;

  // Check if "locations" is an array and has at least one location
  // I chose locations because it locations exists for all animals in the database
  if (Array.isArray(animalLocations) && animalLocations.length > 0) {
    var locationList = animalLocations.join(', ');
    var message = animalName + 's are located in ' + locationList + '. ';
    var featuresMessage = '';

    if (typeof animalFood !== "undefined") {
      featuresMessage += 'Their favorite food is ' + animalFood + '. ';
    }

    if (typeof animalLifespan !== "undefined") {
      featuresMessage += 'Their average lifespan is ' + animalLifespan + '. ';
    }

    if (typeof animalSlogan !== "undefined") {
      featuresMessage += 'A fun fact: ' + animalSlogan + '. ';
    }

    if (typeof animalFeature !== "undefined") {
      featuresMessage += 'Main features: ' + animalFeature + '. ';
    }

    if (typeof animalMostfeature !== "undefined") {
      featuresMessage += 'Main features: ' + animalMostfeature + '. ';
    }

    message += featuresMessage;

    new x_snc_slackerbot.Slacker().send_chat(current, message, false);
  }
}
