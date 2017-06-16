const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var raidSchema = new Schema({
  name: String,
  dateAndTime: Date,
  peopleNeeded: Number,
  joined: Array
});

var raid = mongoose.model( 'raid', raidSchema );

module.exports = raid;