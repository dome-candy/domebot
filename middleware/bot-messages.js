const dateUtils = require( './date-utilities' ),
      moment = require('moment');

let messageBox = [];

function MessageStore(messageId, authorId){
  this.messageId = messageId;
  this.authorId = authorId;
};

exports.startRaid = (message, author, channel) => {
  channel.send(`Let's get this event going ${author.username}!\nTime for a name:`);
};

exports.dateRaid = (message, author, channel, raid) => {
  channel.send(`Current details:\nName: ${raid.name}\nTime for a date:`);
};

exports.timeRaid = (message, author, channel, raid) => {
  channel.send(`Current details:\nName: ${raid.name}\nDate: ${moment(dateUtils.dateOnly(raid.date)).format('dddd, MMMM Do YYYY')}\nTime for a...time:`);
}

exports.openingsRaid = (message, author, channel, raid) => {
  channel.send(`Current details:\nName: ${raid.name}\nDate: ${moment(dateUtils.dateOnly(raid.date)).format('dddd, MMMM Do YYYY')}\nTime: ${moment(dateUtils.timeOnly(raid.time)).format('h:mm a')}\nHow many openings?`);
};

exports.timezoneRaid = (message, author, channel, raid) => {
  channel.send(`Current details:\nName: ${raid.name}\nDate: ${moment(dateUtils.dateOnly(raid.date)).format('dddd, MMMM Do YYYY')}\nTime: ${moment(dateUtils.timeOnly(raid.time)).format('h:mm a')}\nOpenings: ${raid.openings}\nWhat timezone is most local to you?`);
};

exports.confirmRaid = (message, author, channel, raid) => {
  channel.send(`Current details:\nName: ${raid.name}\nDate: ${moment(dateUtils.dateOnly(raid.date)).format('dddd, MMMM Do YYYY')}\nTime: ${moment(dateUtils.timeOnly(raid.time)).format('h:mm a')}\nOpenings: ${raid.openings}\nTimezone: ${raid.timezone}\nShall we confirm?`);
};

exports.confirmRaidResult = (message, author, channel, raid) => {
  channel.send(`Here's your new raid!\nID: ${raid.id}\nName: ${raid.name}\nWhen: ${moment(raid.date).format('dddd, MMMM Do YYYY, h:mm a')}\nOpenings: ${raid.openings}`)
};
