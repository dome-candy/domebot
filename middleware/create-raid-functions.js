// Dependencies!
const action = require('./action-middleware'),
      dateUtils = require( './date-utilities' ),
      moment = require('moment'),
      botTalk = require('./bot-messages');

// import Mongoose schemas
const raidEvent = require( '../models/event' );

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
    if(raids[raidId] && raids[raidId].creatorid === author.id && raids[raidId].creatorChannel === channel.id){
      resolve(raidId);
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
  // Run our check for correct author AND channel, resolve triggers action on the object, reject logs to console
  checkAuthor(author, channel).then((raidId) => {
    raids[raidId].name = message.content;
    console.log(raids[raidId]);
    botTalk.dateRaid(message, author, channel, raids[raidId]);
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
  botTalk.startRaid(message, author, channel);
  nextStep();
};

exports.date = (message, author, channel) => {
  checkAuthor(author, channel).then((raidId) => {
    raids[raidId].date = message.content;
    console.log(raids[raidId]);
    botTalk.timeRaid(message, author, channel, raids[raidId]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.time = (message, author, channel) => {
  checkAuthor(author, channel).then((raidId) => {
    raids[raidId].time = message.content;
    console.log(raids[raidId]);
    botTalk.openingsRaid(message, author, channel, raids[raidId]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.openings = (message, author, channel) => {
  checkAuthor(author, channel).then((raidId) => {
    raids[raidId].openings = message.content;
    console.log(raids[raidId]);
    botTalk.timezoneRaid(message, author, channel, raids[raidId]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.timezone = (message, author, channel) => {
  checkAuthor(author, channel).then((raidId) => {
    raids[raidId].timezone = message.content;
    console.log('the full raid should now be visible here.');
    console.log(raids[raidId]);
    botTalk.confirmRaid(message, author, channel, raids[raidId]);
    nextStep();
    return;
  }).catch((err) => {
    console.log(err);
  });
}

exports.confirmRaid = (message, author, channel) => {
  console.log('Attempting Assimilation to Database, please hold...');
  var raidToDB;
  checkAuthor(author, channel).then((raidId) => {
    console.log('We have identified the raid in question...');
    //Sort out date
    let date = dateUtils.handleDate(raids[raidId].date, raids[raidId].time, raids[raidId].timezone);
    console.log(`We have defined the date... ${date}`);
    // Set up event model for saving
    raidToDB = new raidEvent({
      name: raids[raidId].name,
      date: date,
      openings: raids[raidId].openings,
      creatorid: raids[raidId].creatorid
    });
    console.log(raidToDB);
    raidToDB.save(function(err, raidSaved){
      if(err)console.log(err);
      console.log(raidSaved);
      console.log(`New raid event has been created. Well done. Parameters: ${raidSaved.name}, ${moment(raidSaved.date).format('dddd, MMMM Do YYYY, h:mm a')}, ${raidSaved.openings}, ${raidSaved.creatorid}.`);
      botTalk.confirmRaidResult(message, author, channel, raid);
      action.resetAction();
    });//.catch( reason => {
      //console.log(reason);
    //});
  }).catch((err) => {
    console.log(err);
  });
}

let dbTest = () => {
  return raidEvent.find()
};

console.log(dbTest());
