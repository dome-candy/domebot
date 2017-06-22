// Dependencies!
const action = require('./action-middleware'),
      dateUtils = require( './date-utilities' ),
      moment = require('moment');

// import Mongoose schemas
const event = require( '../models/event' );

// Define raids array for storing new raid objects
let raids = [];

// Create constructor function for generating new raids
function Raid(creatorid, creatorChannel, name, date, time, openings, timezone){
  this.creatorid = creatorid;
  this.creatorChannel = creatorChannel;
  this.name = name;
  this.date = date;
  this.time = time;
  this.openings = openings;
  this.timezone = timezone;
};

// New promise to check if the correct person is sending the message

let checkAuthor = (author, channel) => {
  return new Promise((resolve, reject) => {
    let raidId = findRaid(author);
    if(raids[raidId].creatorid === author.id && raids[raidId].creatorChannel === channel.id){
      resolve();
    } else {
      let message = `The author '${author.username}' or the channel '${channel.name}' are incorrect for the current raid session.`;
      reject(message);
    }
  })
};

// Define function to find correct object in array
let findRaid = (author) => {
  let id = author.id;
  return raids.findIndex((raid) => {return raid.creatorid === id});
};

// Define function to advance raid step forward one place
let nextStep = () => {
  action.setAction(action.actionIndex(action.checkAction()) + 1);
};

// Perform raid in progress check
// If the raid exists, pass on the id
// If the raid does not exist, return a new instance of raid to push to array
let raidInProgress = (author, channel) =>{
  let raidIndex = findRaid(author);
  console.log(raidIndex);
  if(raidIndex === -1){
    let raid = new Raid(author.id, channel.id);
    raids.push(raid);
    console.log(raids);
    return findRaid(author);
  } else {
    return raidIndex;
  }
};

// Export all creating raid functions. Commenting for name mirrored for each export
exports.name = (message, author, channel) => {
  // Check if we got Here
  console.log(`We got here!`);
  // This will return the index of the raid we're creating, or create a new instance, push to the array, and return that index
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  // Run our check for correct author AND channel, resolve triggers action on the object, reject logs to console
  checkAuthor(author, channel).then(() => {
    raids[raidIndex].name = message.content;
    console.log(raids[raidIndex]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.start = (message, author, channel) => {
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  console.log(`Let's start making a raid!`);
  nextStep();
};

exports.date = (message, author, channel) => {
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  checkAuthor(author, channel).then(() => {
    raids[raidIndex].date = message.content;
    console.log(raids[raidIndex]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.time = (message, author, channel) => {
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  checkAuthor(author, channel).then(() => {
    raids[raidIndex].time = message.content;
    console.log(raids[raidIndex]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.openings = (message, author, channel) => {
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  checkAuthor(author, channel).then(() => {
    raids[raidIndex].openings = message.content;
    console.log(raids[raidIndex]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.timezone = (message, author, channel) => {
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  checkAuthor(author, channel).then(() => {
    raids[raidIndex].timezone = message.content;
    console.log(raids[raidIndex]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.confirm = (author, channel) => {
  let raidIndex = raidInProgress(author, channel);
  console.log(raidIndex);
  checkAuthor(author, channel).then(() => {
    //Sort out date
    let date = dateUtils.handleDate(raids[raidIndex].date, raids[raidIndex].time, raids[raidIndex].timezone);
    // Set up event model for saving
    let newRaid = new event({
      name: raids[raidIndex].name,
      date: date,
      openings: raids[raidIndex].openings,
      creatorid: raids[raidIndex].creatorid
    }).then(() => {
      console.log(`New raid event has been created. Well done. Parameters: ${newRaid.name}, ${moment(newRaid.date).format('dddd, MMMM Do YYYY, h:mm a')}, ${newRaid.openings}, ${newRaid.creatorid}.`);
      action.resetAction();
    });
  }).catch((err) => {
    console.log(err);
  });
}
