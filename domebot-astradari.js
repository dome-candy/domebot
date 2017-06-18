// Declare requirements
var Discord = require('discord.js');
var client = new Discord.Client({sync: true});
var token = 'MzI0OTgwMzcxMDk3NjQ5MTU0.DCSSEg.UoCFajvUUe2iNtMUAAkWe_RzUVI';
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/domeBot');
var db = mongoose.connection
var moment = require('moment');
var autoincrement = require('simple-mongoose-autoincrement');
mongoose.plugin(autoincrement, {});

// Import Mongoose Schemas
var raid = require('./models/raidSchema');

// Ready the bot
client.on('ready', function(){
  console.log('All systems firing. DomeBot is ready.');
  //console.log(client.users.find('username', 'CormacMc0'));
});

// Testing listener function
client.on('message', function(message){
  if(message.content === 'marco'){
    message.channel.send('Polo, ' + message.author.username + '. Please don\'t ask again');
    console.log(message.author + ', ' + message.author.username);
  }
});

// Send private message function
var sendPM = function(userid, mToSend){
  var target = client.users.find('id', userid);
  console.log(target);
  console.log(`FIRE!`);
  target.send(`${mToSend}, ${target.username}.`);
};


// Raid Builder Variables
var authorDetails = {name: '', id: ''},
    creatingRaid = false,
    step = '',
    raidName = '',
    raidDate = '',
    dateParts = '',
    raidTime = '',
    timeParts = '',
    raidPeople = '',
    raidToDB = '';

// Raid builder Functional
client.on('message', function(message){
  if(message.content.indexOf('!createraid') !== -1){
    authorDetails = {name: message.author.username, id: message.author.id};
    creatingRaid = true;
    step = 'Name';
    message.channel.send(`Alright ${authorDetails.name}, lets create this raid! \nWhat would you like to call it?`);
    console.log(authorDetails, creatingRaid);
  } else if (creatingRaid === true && authorDetails.id === message.author.id && message.content === 'exit') {
    message.channel.send(`Alrighty ${authorDetails.name}, see you later!`);
    authorDetails = {name: '', id: ''};
    creatingRaid = false;
    step = '';
  } else if (creatingRaid === true && authorDetails.id === message.author.id && message.content === 'back') {
    if (!step || step === 'Name') {
      message.channel.send(`You can't go backwards from the beginning!`);
    } else if (step === 'Date') {
      message.channel.send(`Heading back to the naming bit!\n\nLet's get a name.`);
      step = 'Name';
    } else if (step === 'Time') {
      message.channel.send(`Heading back to the date bit!\n\nLet's get a date.`);
      step = 'Date';
    } else if (step === 'People') {
      message.channel.send(`Heading back to the Time bit!\n\nLet's get a time.`);
      step = 'Time';
    } else if (step === 'Confirmation') {
      message.channel.send(`Heading back to the People bit!\n\nTell me how many people you need.`);
      step = 'People'
    }
  } else if (creatingRaid === true && authorDetails.id === message.author.id && step === 'Name') {
    raidName = message.content;
    message.channel.send(`Raid name: ${raidName}.\nLets get a date!\n\nType "exit" to exit.`);
    step = 'Date';
  } else if (creatingRaid === true && authorDetails.id === message.author.id && step === 'Date') {
    raidDate = message.content;
    dateParts = message.content.split('/')
    dateFormat = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0]);
    console.log(dateFormat);
    message.channel.send(`Raid date: ${moment(dateFormat).format('dddd, MMMM Do YYYY')}\nWhat time are we starting at?\n\nType "exit" to exit.\nType "back" to go back a step.`);
    step = 'Time';
  } else if (creatingRaid === true && authorDetails.id === message.author.id && step === 'Time') {
    console.log(dateParts);
    raidTime = message.content;
    timeParts = message.content.split(':');
    timeFormat = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    message.channel.send(`Raid time: ${moment(timeFormat).format('h:mm:ss a')}\nHow many people do you need?\n\nType "exit" to exit.\nType "back" to go back a step.`);
    step = 'People';
  } else if (creatingRaid === true && authorDetails.id === message.author.id && step === 'People') {
    raidPeople = message.content;
    message.channel.send(`Raiders Needed: ${raidPeople}. \nLets confirm your details:\nName: ${raidName}\nWhen: ${moment(timeFormat).format('dddd, MMMM Do YYYY, h:mm:ss a')}\nRaiders Needed: ${raidPeople}\n\nType "exit" to exit.\nType "back" to go back a step.\nType "confirm" to confirm your raid!`);
    step = 'Confirmation';
  } else if (creatingRaid === true && authorDetails.id === message.author.id && step === 'Confirmation') {
    raidToDB = raid({
      name: raidName,
      dateAndTime: timeFormat,
      peopleNeeded: raidPeople,
      testArea: ['2', '3'],
      creator: {
        username: authorDetails.name,
        userid: authorDetails.id
      }
    });
    console.log(raidToDB);
    raidToDB.save(function(err, raidSaved){
      if(err)console.log(err);
      console.log(raidSaved);
      message.channel.send(`Raid Confirmed! Your raid ID is: ${raidSaved.id}.`);
      authorDetails = {name: '', id: ''},
      creatingRaid = false,
      step = '';
      raidName = '';
      raidDate = '';
      dateParts = '';
      raidTime = '';
      timeParts = '';
      raidPeople = '';
      raidToDB = '';
    });
  }

});


// Raid Finder
client.on('message', function(message){
  if (message.content.indexOf('!findraids') !== -1) {
    var raidLimit = parseInt(message.content.replace('!findraids ', '')) || 5;
    console.log(raidLimit);
    raid.find({}, 'id name dateAndTime peopleNeeded joined', {sort: {dateAndTime: 1}}).limit(raidLimit).then(function(raids){
      console.log(raids);
      console.log(moment(raids[0].dateAndTime).format('dddd, MMMM Do YYYY, h:mm:ss a'));
      console.log('made it to here.');
      var raidsString = '',
          name = '',
          when = '',
          spaces = '',
          id = '';
      for (var i = 0; i < raids.length; i++) {
        console.log('not making it to here.');
            name = raids[i].name;
            when = raids[i].dateAndTime;
            spaces = raids[i].peopleNeeded;
            id = raids[i].id;
        console.log(name, when, spaces);
            //id = raids[i].id
        raidsString = raidsString + `ID: ${id}\nName: ${name}\nWhen: ${moment(when).format('dddd, MMMM Do YYYY, h:mm:ss a')}\nSpaces Left: ${spaces}\n\n`;
        console.log(raidsString);
        if(i === raids.length - 1){
          console.log('Made it through all them raids!');
          raidsString = raidsString + `\nTo join a raid, type "!joinraid" followed by the ID.`;
          message.channel.send(raidsString);
        }
      }
    });
  } else if (message.content.indexOf('!findraid') !== -1) {
    var raidFindID = parseInt(message.content.replace('!findraid ', ''));
    console.log(raidFindID);
    var raidString = '';
    raid.findById(raidFindID, 'id name dateAndTime peopleNeeded joined').then(function(raids){
      if (raids === null) {
        message.channel.send(`Raid ID ${raidFindID} does not exist.`);
      } else {
      console.log(raids);
      console.log(raidString);
      raidString = `ID: ${raids.id}\nName: ${raids.name}\nWhen: ${moment(raids.dateAndTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}\nPeople Needed: ${raids.peopleNeeded}\nRaiders so far: ${raids.joined}`;
      console.log(raidString);
      message.channel.send(raidString);
    }
    });
  }
});

// Raid Join and Remove
client.on('message', function(message){
  if(message.content.indexOf('!joinraid') !== -1) {
    var raidToJoin = parseInt(message.content.replace('!joinraid ', '')),
        raider = {username: message.author.username, userid: message.author.id};
    console.log(raidToJoin);
    console.log(raider);
    raid.findById(raidToJoin).then(function(raidDetails){
      console.log(raidDetails);
      var raiderPresent = false;
      console.log(raidDetails.peopleNeeded, raidDetails.joined.length);
      if (raidDetails.peopleNeeded > 0 && raidDetails.joined.length > 0) {
        console.log('Raider Needed.');
        for (var i = 0; i < raidDetails.joined.length; i++) {
          if (raidDetails.joined[i].username === raider.username) {
            console.log('Checking presence in raid');
            message.channel.send(`You're already in this raid ${raider.username}!`);
            raiderPresent = true;
          } else if (raiderPresent === false && i === raidDetails.joined.length - 1) {
            raid.findByIdAndUpdate(raidToJoin, {$push: {'joined': raider}}, {new: true}).then(function(raid){
              console.log(raid);
              message.channel.send(`You have joined ${raid.name} starting at ${moment(raid.dateAndTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}\nHere's who's raiding: ${raid.joined.map(function(a){return a.username})}`);

            });
          }
        }
      } else if(raidDetails.peopleNeeded > 0 && raidDetails.joined.length === 0) {
        console.log('This event is fired!');
        raid.findByIdAndUpdate(raidToJoin, {$push: {'joined': raider}}, {new: true}).then(function(raid){
          console.log('We made it here!');
          console.log(raid);
          message.channel.send(`You have joined ${raid.name} starting at ${moment(raid.dateAndTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}\nHere's who's raiding: ${raid.joined.map(function(a){return a.username})}`);
          var messageToMaker = `${raid.name} has joined your raid, starting at ${moment(raid.dateAndTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}\nHere's who's raiding: ${raid.joined.map(function(a){return a.username})}`
          var target = client.users.get('id', raid.creator.userid);
          console.log(target);
          console.log(raid.creator.userid);
          console.log(messageToMaker);
          target.send(`${messageToMaker}.`);
        });
      } else if(raid.peopleNeeded === 0){
        message.channel.send(`There's no room left in this raid :[`);
      }
    });
  } else if (message.content.indexOf('!leaveraid') !== -1) {
    var raider = {username: message.author.username, userid: message.author.id},
        raidToLeave = parseInt(message.content.replace('!leaveraid ', ''));
        console.log(raider, raidToLeave);
        raid.findById(raidToLeave).then(function(raidDetails){
          if (raidDetails === null) {
            message.channel.send(`Raid ${raidToLeave} does not exist ${raider.username}.`);
          } else if (raidDetails.joined.length > 0) {
            for (var i = 0; i < raidDetails.joined.length; i++) {
              if(raidDetails.joined[i].userid === raider.userid){
                raid.findByIdAndUpdate(raidToLeave, {$pull: {'joined': {userid: raider.userid}}}, {new: true}).then(function(newRaid){
                message.channel.send(`You have been removed from ${raidDetails.name} at ${moment(raidDetails.dateAndTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}, ${raider.username}`);
              });
              break;
              }
            }
          } else if (raidDetails.joined.length === 0) {
            message.channel.send(`There is currently nobody in this raid at all, ${raider.username}.`);
          }
        });
  }

});

/*
client.on('message', function(message){
  if(message.content.indexOf('!createraid') !== -1){
    message.channel.send(`Creating your Raid ${message.author.username}`);
    var raidInfo = message.content.replace("!createraid ", "").split(', ');
    var dateString = raidInfo[1] + ' ' + raidInfo[2],
        dateTimeParts = dateString.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = dateTimeParts[0].split('/'),
        date;

    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

    var newRaid = raid({
      name: raidInfo[0],
      dateAndTime: date,
      peopleNeeded: raidInfo[3]
    });
    newRaid.save(function(err){
      if(err) console.log(err);
      console.log('Raid saved!');
    })
    message.channel.send(`Raid created! Here are your details: \nName: ${newRaid.name} \nWhen: ${moment(date).format('MMMM Do YYYY, h:mm a')} \nSpaces left: ${newRaid.peopleNeeded}`);

  }
})
*/

/*
var result = "!createraid Wrath of the Machine Challenge Mode, 27/02/2018, 20:45, 3";
result = result.replace("!createraid ", "");
result = result.split(', ');
console.log(result);
console.log('Your next raid is: ' + result[0] + '\n' + 'Kicking off: ' + result[1] + ' : ' + result[2] + '\n' + 'Still need: ' + result[3]);
*/
/*
client.on('message', function(message){
  if(message.content === '!greetCormac'){
    message.channel.send('<@' + client.users.find('username', 'CormacMc0').id + '>');
  }
});*/




// Connect the bot using application token from Discord
client.login(token);