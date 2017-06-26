// TODO: create a real server and wrap the core code in an IIFE

// simulate config options from your production environment by
// customising the .env file in your project's root folder.
require( 'dotenv' ).load();

// imports for the win
const mongoose      = require( 'mongoose' ),
      dbUtils       = require( './middleware/db-utilities' ),
      botMiddleware = require( './middleware/bot-middleware' ),
      autoincrement = require('simple-mongoose-autoincrement');
      mongoose.plugin(autoincrement, {});

// Use native promises for mongoose
mongoose.Promise = global.Promise;

// connect to the database
const isDBConnected = dbUtils.connectToDatabase();
// if the database connection is successful
isDBConnected.then( () => {
  // set up event listeners
  botMiddleware.bindEventListeners();
  // connect the bot using application token from Discord
  botMiddleware.login();
})
// if the database connection is unsuccessful, log it
.catch( reason => {
  console.log( reason );
});
