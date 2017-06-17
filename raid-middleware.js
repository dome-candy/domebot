// imports for the win
const dateUtils = require( './date-utilities' );

// import Mongoose schemas
const raid = require( './models/raidSchema' );

/* set up a new raid event */
exports.setupRaid = ( username, details, channel ) => {
  // signal back that we're starting to create a new raid event
  channel.send( `Creating your Raid ${ username }` );
  // use destructuring assignment to extract necessary detail into local variables
  const [ name, openSeats, dateString, timeString, timezone ] = details;
  // convert the date and time into a Date object
  const date = dateUtils.handleDate( dateString, timeString, timezone );
  // create an event object to store in the database for safekeeping
  var newRaidEvent = raid({
    name,
    dateAndTime: date,
    peopleNeeded: openSeats
  });
  // attempt to save the event
  newRaidEvent.save( err => {
    // if there was an error
    if( err ) {
      // log it and let the user know
      console.log( err );
      channel.send( `There was an error saving your raid event, if the issue persists, please contact @discord admin` );
    } else {
      // send the newly minted event details back to the user
      message.channel.send( `Raid created! Here are your details:
        Name: ${ newRaidEvent.name }
        When: ${ moment( date ).format( 'MMMM Do YYYY, h:mm a' ) }
        Spaces left: ${ newRaidEvent.peopleNeeded }` );
    }
  });
}