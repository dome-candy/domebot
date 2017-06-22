// imports for the win
const dateUtils = require( './date-utilities' ),
      prompts   = require( './prompts' );

// import Mongoose schemas
const event = require( '../models/event' );

let currentAction = null;

let raidActions = ['start', 'name', 'date', 'time', 'openings','timezone', 'confirm'];

exports.checkAction = () => {
  return currentAction;
}

exports.setAction = (actionId) => {
  currentAction = raidActions[actionId];
}
/* reset the action object to allow a new interaction with the bot */
exports.resetAction = () => {
  currentAction = null;
};

exports.actionIndex = (action) => {
  return raidActions.findIndex((x) => {return x === action});
};

/*
exports.continueAction = ( author, details, channel ) => {
  const currentAction = getAction();

  switch( currentAction ) {
    case '!createraid': updateRaidDetails(); break;
    default: updateRaidDetails;
  }
}
*/
