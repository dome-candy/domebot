// imports for the win
const dateUtils = require( './date-utilities' ),
      prompts   = require( './prompts' );

// import Mongoose schemas
const event = require( '../models/event' );

let currentAction = {};

exports.getAction = () => {
  return currentAction;
}
/* reset the action object to allow a new interaction with the bot */
exports.resetAction = () => {
  currentAction = {};
};

exports.continueAction = ( author, details, channel ) => {
  const currentAction = getAction();

  switch( currentAction ) {
    case '!createraid': updateRaidDetails(); break;
    default: updateRaidDetails;
  }
}