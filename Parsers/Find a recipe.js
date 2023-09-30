/*
activation_example:!recipe chicken
regex:!recipe
flags:gmi
*/

var prompt = current.text.replace(/!recipe/gmi, "").trim().substring(0, 1000);
var recipe = new sn_ws.RESTMessageV2();
recipe.setEndpoint('https://api.spoonacular.com/recipes/complexSearch?query=' + prompt + '&number=1');
recipe.setHttpMethod("GET");
recipe.setRequestHeader("x-api-key", "388e91b9cd7b416aaa236234e26e9d35");
var chatResponse = recipe.execute();
var chatResponseBody = JSON.parse(chatResponse.getBody());

new x_snc_slackerbot.Slacker().send_chat(current, chatResponseBody.results[0].title + '\n' + chatResponseBody.results[0].image,false);
