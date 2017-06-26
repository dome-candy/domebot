const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var raidEvent = new Schema({
  name: String,
  date: Date,
  openings: Number,
  attendees: Array,
  creatorid: Number
  // testArea: // not sure what this is used for
  // creator: // point to person model
});

var event = mongoose.model( 'raidEvent', raidEvent );

module.exports = event;

// var raidSchema = new Schema({
//   name: String,
//   dateAndTime: Date,
//   peopleNeeded: Number,
//   joined: Array,
//   testArea: Array,
//   creator: {
//     username: String,
//     userid: String
//   }
// });

// var raid = mongoose.model('raid', raidSchema);

// module.exports = raid;
