/*
activation_example:!animal name of animal
regex:!animal
flags:gmi
*/

var where = current.text.indexOf('!animal ') + 8;
var term = current.text.substr(where).trim();
var chatReq = new sn_ws.RESTMessageV2();
chatReq.setEndpoint('https://api.api-ninjas.com/v1/animals?name=' + term);
chatReq.setHttpMethod("GET");
chatReq.setRequestHeader('X-Api-Key', 'tbfgkwW8c0UY0xE0Yd9oSw==DusJx995ZmqecaPW');
var chatResponse = chatReq.execute();
var chatResponseBody = chatResponse.getBody();

// Parse the API response as JSON
var responseData = JSON.parse(chatResponseBody);

// Check if the API response contains any data
if (Array.isArray(responseData) && responseData.length > 0) {
  var maxResults = 3; // Display the first 3 animals

  // Iterate through the first 3 animals in the array
  for (var i = 0; i < Math.min(maxResults, responseData.length); i++) {
    var animal = responseData[i];
    var animalName = animal.name;
    var animalLocations = animal.locations;
    var animalLifespan = animal.characteristics.lifespan;
    var animalFood = animal.characteristics.favorite_food;
    var animalSlogan = animal.characteristics.slogan;
    var animalWeight = animal.characteristics.weight;
    var animalFeature = animal.characteristics.distinctive_feature;
	var animalMostfeature = animal.characteristics.most_distinctive_feature;

    // Check if "locations" is an array and has at least one location
    if (Array.isArray(animalLocations) && animalLocations.length > 0) {
      var locationList = animalLocations.join(', ');

      var message = animalName + 's are located in ' + locationList + '. ';

      if (typeof animalFood !== "undefined") {
        message += 'Their favorite food is ' + animalFood + '. ';
      }
      
      if (typeof animalLifespan !== "undefined") {
        message += 'Their average lifespan is ' + animalLifespan + '. ';
      }
      
      if (typeof animalSlogan !== "undefined") {
        message += 'A fun fact: ' + animalSlogan + '. ';
      }

	  if (typeof animalFeature !== "undefined") {
        message += 'Main features: ' + animalFeature + '. ';
      }

	  if (typeof animalMostfeature !== "undefined") {
        message += 'Main features: ' + animalMostfeature + '. ';
      }
      
      new x_snc_slackerbot.Slacker().send_chat(current, message, false);
      
}
  }
} else {
  new x_snc_slackerbot.Slacker().send_chat(current, "No fun facts for the provided animal.", false);
}
