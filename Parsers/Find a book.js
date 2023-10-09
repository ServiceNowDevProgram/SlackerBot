/*
activation_example:!book -t "Title", !book -t "Title" -a "Author", !book -s "Subject" - Quotation marks are required for lookups
regex:!book -(\S\s|help)
flags:gmi
*/

function handleBookInputs(message) {
  var output = {};

  // Ignore anything preceeding !book
  var call = message.substring(message.indexOf('!book')); //^!book -((a|t|s) "|help)
  var invocation = call.replace('^!book', '').trim();
  if (invocation.match(/-help/gmi) !== null) {
    // Help was called, send the message
    output.message = gs.getMessage('Book: Slackerbot\'s integration to OpenLibrary for book lookups\n\nTo leverage !book, one or more of the following parameters must be sent:\n-a "Author": The name or a fragment of the name of an author\n-t "Title": The title of a book or a fragment thereof\n-s "Subject": The subject of a book\n\nThese flags can be used in any combination, but at least one is required for a successful search. Quotation marks are required for search parameters.');
    output.success = false;
    output.search = null;
  } else if (invocation.indexOf('"') == -1) {
    // Query invalid, let the user know
    output.message = gs.getMessage('Book: An invalid query was provided. Please ensure query values are wrapped in double quotes for book lookup.');
    output.success = false;
    output.search = null;
  } else {
    // Prepare search output
    output.search = {};
    output.search.author = null;
    output.search.title = null;
    output.search.subject = null;
    invocation = invocation.match(/(-\S)\s(".*?")/gmi);
    for (var i = 0; i < invocation.length; i++) {
      switch (invocation[i].charAt(1)) {
        case 'a':
          output.search.author = invocation[i].substring(invocation[i].indexOf('"'));
          break;
        case 't':
          output.search.title = invocation[i].substring(invocation[i].indexOf('"'));
          break;
        case 's':
          output.search.subject = invocation[i].substring(invocation[i].indexOf('"'));
          break;
        default:
          break;
      }
    }
    if (output.search.author === null && output.search.title === null && output.search.subject === null) {
      output.message = gs.getMessage('Book: No supported flags were present in the command. Please call the command with `-help` for the supported flags and usage.');
      output.success = false;
      output.search = null;
    } else {
      output.message = '';
      output.success = true;
    }
  }
  return output;
}

function buildUrl(searchParams) {
  var baseUrl = 'https://openlibrary.org/search.json?limit=1&q=';
  var query = '';
  if (searchParams.author !== null) {
    query = query + ' author:' + searchParams.author;
  }
  if (searchParams.title !== null) {
    query = query + ' title_suggest:' + searchParams.title;
  }
  if (searchParams.subject !== null) {
    query = query + ' subject:' + searchParams.subject;
  }
  query = query.trim();

  return baseUrl + encodeURIComponent(query);
}

function getBook(searchQuery) {
  var output = {};
  var searchMessage = new sn_ws.RESTMessageV2();
  searchMessage.setEndpoint(searchQuery);
  searchMessage.setHttpMethod('GET');
  searchMessage.setRequestHeader('User-Agent', 'servicenow');
  var searchResponse = searchMessage.execute();
  if (searchResponse.getStatusCode() != 200) {
    output.success = false;
    output.message = gs.getMessage('Book: There was an issue querying OpenLibrary with your search. Please try again later, or reach out to @Astrid if this continues to occur.');
    output.payload = null;
  } else {
    var payload = JSON.parse(searchResponse.getBody());
    if (payload.numFound == 0) {
      output.success = false;
      output.message = gs.getMessage('Book: There are no books present on OpenLibrary with your search. Please try modifying your query terms or looking for a different book.');
      output.payload = null;
    } else {
      output.success = true;
      output.message = '';
      output.payload = payload.docs[0];
    }
  }
  return output;
}

function getCoverImage(id) {
  var baseUrl = 'https://covers.openlibrary.org/b/id/{id}-L.jpg';
  baseUrl = baseUrl.replace('{id}', id);
  return baseUrl;
}

function buildBlocks(details, imageUrl) {
  var blockArr = [];

  blockArr.push({
    "type": "header",
    "text": {
      "type": "plain_text",
      "text": "Book: " + details.title
    }
  });

  blockArr.push({
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "*Author:* " + details.author_name
      }
    ]
  });

  blockArr.push({
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "*First published:* " + details.first_publish_year
      }
    ]
  });

  blockArr.push({
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": "*Editions:* " + details.edition_count
      }
    ]
  });

  if (details.id_goodreads !== undefined) {
    blockArr.push({
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "*Goodreads:* <https://www.goodreads.com/book/show/" + details.id_goodreads[0] + "|Book link>"
        }
      ]
    });
  }

  blockArr.push({
    "type": "image",
    "title": {
      "type": "plain_text",
      "text": "Cover art"
    },
    "image_url": imageUrl,
    "alt_text": "Cover art for " + details.title
  });

  return {
    "text": "Book: " + details.title,
    "blocks": blockArr
  };
}

var slacker = new x_snc_slackerbot.Slacker();
var action = handleBookInputs(current.text);
if (!action.success) {
  // Send failure message
  slacker.send_chat(current, action.message, false);
} else {
  var query = buildUrl(action.search);
  var book = getBook(query);
  if (!book.success) {
    slacker.send_chat(current, book.message, false);
  } else {
    var message = buildBlocks(book.payload, getCoverImage(book.payload.cover_i));
    slacker.send_chat(current, message, false);
  }
}