function convert(str) {
  var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2),
      hours = ("0" + date.getHours()).slice(-2);
      minutes = ("0" + date.getMinutes()).slice(-2),
      milliSeconds = ("0" + date.getMilliseconds()).slice(-2);

  return [date.getFullYear(), mnth, day].join("-") + "T" + [hours, minutes, milliSeconds].join(":");//+":00-07:00";
}

// Client ID and API key from the Developer Console
var type, date;
var CLIENT_ID = '360950073378-avo4kr27vc1alme8es2662o6vn805vje.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCo73uWhQtkfaCZ6IBF5ejuphFZLAcnzps';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    console.log("is Signed IN", type, date)
    gIsSignedIn = true;
  } else {
    gIsSignedIn = false;
    console.log("is Signed  Not sIN")
    handleAuthClick();
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(date) {
  console.log("Lilst Date:--", (new Date()).toISOString())
  console.log("Lilst Date:--", date)
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': date ? date : (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 20,
    'orderBy': 'startTime'
  }).then(function (response) {
    var events = response.result.items;
    console.log("Events:--", events);

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        console.log(event.summary + ' (' + when + ')')

        $('#messages').append($('<li>').html("Event index " + i + "\n" + event.summary + ' (' + when + ')'));

      }
    } else {
      console.log('No upcoming events found.')
      $('#messages').append($('<li>').html("No upcoming events found."));
    }
  });
}
function listDateEvents(date) {
  console.log("Lilst Date:--", (new Date()).toISOString())
  console.log("Lilst Date:--", date)
  let minDate = moment(date, "YYYY-MM-DDTHH:mm:ssz")
  minDate.set('hour', 24).set('minute', 00).set('second', 00);
  minDate = moment(minDate).format("YYYY-MM-DDTHH:mm:ssz")
  console.log("MIn Date:--", minDate)
  let maxDate = moment(date, "YYYY-MM-DDTHH:mm:ssz")
  maxDate.set('hour', 00).set('minute', 00).set('second', 00)//.format("YYYY-MM-DDTHH:mm:ss")//.set('hour', 24).set('minute', 00).set('second', 00);
  maxDate = moment(maxDate).format("YYYY-MM-DDTHH:mm:ssz")

  console.log("Max Date:--", maxDate)
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': maxDate ? maxDate + 'z' : (new Date()).toISOString(),
    'timeMax': minDate ? minDate + 'z' : (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 20,
    'orderBy': 'startTime'
  }).then(function (response) {
    var events = response.result.items;
    console.log("Events:--", events);

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        console.log(event.summary + ' (' + when + ')')
        if (type === 'delete') {
          deleteEvents(date, event, when)
        } else {
          $('#messages').append($('<li>').html("Event index " + i + "\n" + event.summary + ' (' + when + ')'));
        }
      }
    } else {
      console.log('No upcoming events found.')
      $('#messages').append($('<li>').html("No upcoming events found."));
    }
  });
}
function deleteEvents(date, event, when) {
  console.log("Lilst Date:--", (new Date()).toISOString())
  console.log("Lilst Date:--", date)
  gapi.client.calendar.events.delete({
    'calendarId': 'primary',
    'eventId': event.id
  }).then(function (response) {
    console.log("Events:--", response);
    $('#messages').append($('<li>').html("Event Deleted: " + event.summary + ' (' + when + ')'));
  });
}

function insertEvent(eventTitle, eventDate) {
  console.log("Event date:--", eventDate)
  var event = {
    'summary': eventTitle,
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': eventDate,
      'timeZone': 'Asia/Kolkata'
    },
    'end': {
      'dateTime': eventDate,
      'timeZone': 'Asia/Kolkata'
    },
    'attendees': [
      { 'email': 'lpage@example.com' },
      { 'email': 'sbrin@example.com' }
    ]
  };

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function (event) {
    console.log('Event created: ', event);
    listUpcomingEvents();
  });
}