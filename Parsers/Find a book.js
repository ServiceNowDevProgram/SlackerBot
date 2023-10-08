/*
activation_example:!book "Title", !book "Title" "Author", !book (for random) - Quotation marks are required for lookups
regex:^!book
flags:gmi
*/

function handleBookInputs(message){
  var output = {};
  
  var invocation = message.substring(message.indexOf('!book'));
  invocation = invocation.replace('!book','').trim();
  if(invocation.length == 0){
    // No detail provided, get a random book
    output.message = '';
    output.success = true;
    output.type = 'random';
    output.invocation = null;
  } else if (invocation.indexOf('"') == -1) {
    // Query invalid, let the user know
    output.message = gs.getMessage('An invalid query was provided. Please ensure title (and author) are wrapped in double quotes for !book lookup.');
    output.success = false;
    output.type = null;
    output.invocation = null;
  }
  else{
    invocation = invocation.split(/\s(?=")/gmi);
    switch(invocation.length){
      case 1:
        output.message = '';
        output.success = true;
        output.type = 'title';
        break;
      case 2:
        output.message = '';
        output.success = true;
        output.type = 'titleauthor';
        output.invocation // finish;
        break;
      default:
        output.message = gs.getMessage('Too many parameters were passed. Please ensure to check example usage.');
        output.success = false;
        output.type = null;
        output.invocation = null;
    }
  }
  return output;
}

function getBook(

function getCoverImage(id){
}

function buildBlocks(details,imageUrl){
}

var action = handleBookInputs(current.text);
if(!action.success){
  // Send failure message
}
else{
  
}
