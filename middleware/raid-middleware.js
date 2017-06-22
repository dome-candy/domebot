// imports for the win
const dateUtils        = require( './date-utilities' ),
      prompts          = require( './prompts' ),
      actionMiddleware = require( './action-middleware' ),
      createRaid       = require( './create-raid-functions' );

// import Mongoose schemas
const event = require( '../models/event' );

// Performs check on current action in progress, if no action then start from beginning otherwise return action
let currentAction = () => {
  return new Promise((resolve, reject) => {
    if(actionMiddleware.checkAction() === null){
      let zero = 0;
      actionMiddleware.setAction(zero);
      console.log(actionMiddleware.checkAction());
      resolve(actionMiddleware.checkAction());
    } else {
      resolve(actionMiddleware.checkAction());
    }
  });
}

/* set up a new raid event */
exports.setupRaid = ( message, author, channel ) => {
  currentAction().then((action) => {
    console.log(action);
    switch (action) {
      case 'start': createRaid.start(message, author, channel); break;
      case 'name': createRaid.name(message, author, channel); break;
      case 'date': createRaid.date(message, author, channel); break;
      case 'time': createRaid.time(message, author, channel); break;
      case 'openings': createRaid.openings(message, author, channel); break;
      case 'confirm': createRaid.confirm(author, channel); break;

      default:

    }
  });
};

exports.existingProcess = (message, author, channel) => {
  if(actionMiddleware.checkAction() !== null){
    exports.setupRaid(message, author, channel);
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
