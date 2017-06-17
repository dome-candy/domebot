// simulate config options from your production environment by
// customising the .env file in your project's root folder.
require( 'dotenv' ).load();

// imports for the win
const Discord        = require( 'discord.js' ),
      mongoose       = require( 'mongoose' ),
      moment         = require( 'moment' ),
      dbUtils        = require( './db-utilities' ),
      raidMiddleware = require( './raid-middleware' );

// Use native promises for mongoose
mongoose.Promise = global.Promise;

// connect to Discord to allow writing to channels
const client    = new Discord.Client( { sync: true } ),
      token     = process.env.CLIENT_TOKEN;

// connect to the database
var isDBConnected = dbUtils.connectToDatabase();
// if the database connection is successful
isDBConnected.then( () => {
  // set up event listeners
  bindEventListeners();
  // run a test
  runTest();
  // connect the bot using application token from Discord
  client.login( token );
})
// if the database connection is unsuccessful
.catch( reason => {
  // log it
  console.log( reason );
});

/* bind all event listeners */
function bindEventListeners() {
  // when the bot is ready, log it
  client.on( 'ready', () => {
    console.log( 'DomeBot is ready' );
  });
  // create a listener for any messages received from Discord
  client.on( 'message', message => {
    // process the user's input
    handleInput( message );
  });
}

/* handle any and all user input, calling the appropriate processing functions */
function handleInput( message ) {
  // extract the action from the user's message by grabbing everything up to the first space
  const action = message.content.slice( 0, message.content.indexOf( ' ' ) ).toLowerCase();
  // split the message (minus the action) into array elements
  const rawDetails = message.content.replace( '!createraid', '' ).split( ',' );
  // trim any whitespace off each of the details elements
  const details = rawDetails.map( detail => detail.trim() );
  // extract the channel object to allow the bot to respond to the user
  const channel = message.channel
  // extract the name of the user making the request
  const username = message.author.username;
  // call the function needed to handle the user's request
  switch( action ) {
    case '!createraid' : raidMiddleware.setupRaid( username, details, channel ); break;
    default            : raidMiddleware.setupRaid( username, details, channel );
  }
}
/* TODO: delete this when testing without Discord isn't needed */
function runTest() {

  const message = {
    content: '!createraid Wrath of the Machine Challenge Mode, 3, 27/02/2018, 20:45, GMT',
    author: {
      username: 'John Snow'
    },
    channel: {
      send: console.log
    }
  }

  handleInput( message );
}