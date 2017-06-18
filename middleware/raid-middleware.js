// imports for the win
const dateUtils        = require( './date-utilities' ),
      prompts          = require( './prompts' ),
      actionMiddleware = require( './action-middleware' );

// import Mongoose schemas
const event = require( '../models/event' );

/* set up a new raid event */
exports.setupRaid = ( author, details, channel ) => {
  const currentAction = actionMiddleware.getAction();
  // use destructuring assignment to extract necessary detail into local variables
  let [ name, openings, dateString, timeString, timezone ] = details;
  // if the name hasn't been set, prompt the user for the event name
  if( !currentAction.name ) {
    var fetchName = prompts.promptForName( 'raid', channel );
  }
  // if the openSeats hasn't been set, prompt the user for it
  if( !currentAction.openings ) {
    var fetchOpenings = prompts.promptForOpenings( channel );
  }
  // if the date hasn't been set, prompt the user for it
  if( !currentAction.dateString ) {
    fetchDateString = prompts.promptForDate( channel );
    // convert the date and time into a Date object
    const date = dateUtils.handleDate( dateString, timeString, timezone );
  }
  // if the time hasn't been set, prompt the user for it
  if( !currentAction.timeString ) {
    fetchTimeString = prompts.promptForTime( channel );
  }
  // if the timezone hasn't been set, prompt the user for it
  if( !currentAction.timezone ) {
    fetchTimezone = prompts.promptForTimezone( channel );
  }
};

function saveRaid() {
  // signal back that we're starting to create a new raid event
  channel.send( `Creating your Raid ${ author.username }` );
  
  // create an event object to store in the database for safekeeping
  var newRaid = new event({
    name: name,
    date: date,
    openings: openSeats
  });

  // attempt to save the event
  newRaid.save().then( () => {
    // send the newly minted event details back to the user
    message.channel.send( `Raid created! Here are your details:
      Name: ${ newRaidEvent.name }
      When: ${ moment( date ).format( 'MMMM Do YYYY, h:mm a' ) }
      Spaces left: ${ newRaidEvent.peopleNeeded }` );
  })
  .catch( reason => {
    // log it and let the user know
    console.log( reason );
    channel.send( `There was an error saving your raid event, if the issue persists, please contact @discord admin` );
  });
};

exports.updateRaidDetails = ( details ) => {

}