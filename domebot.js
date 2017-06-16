// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require( 'dotenv' ).load();

// imports for the win
const Discord     = require( 'discord.js' ),
      mongoose    = require( 'mongoose' ),
      moment      = require( 'moment' ),
      MongoClient = require( 'mongodb' ).MongoClient;

// import Mongoose schemas
const raid      = require( './models/raidSchema' );

// connect to Discord to allow writing to channels
const client    = new Discord.Client( { sync: true } ),
      token     = process.env.CLIENT_TOKEN;

// connect to the database
var isDBConnected = connectToDatabase();
// if the database connection is successful
isDBConnected.then( () => {
  // log it
  console.log( 'connected' );
  // set up event listeners
  bindEventListeners();

})
// if the database connection is unsuccessful
.catch( reason => {
  // log it
  console.log( reason );
});

// Connect the bot using application token from Discord
client.login( token );

/**********************************************************************************************/
/* all functions below can be moved to their own files, left here for now because... laziness */
/**********************************************************************************************/

function connectToDatabase() {
  // return a promise for chaining by the calling function
  return new Promise( ( resolve, reject ) => {
    // connect to the mongo database
    MongoClient.connect( process.env.MONGO_URI, ( err, db ) => {
      // if there was an error
      if( err ) {
        // log reject the promise with the reason for the failure
          return reject( err );
      }
      // otherwise, log it and resolve the promise
      console.log( 'database connection open' );
      resolve();

    });
  });
}

/* bind all event listeners */
function bindEventListeners() {
  // when the bot is ready
  client.on( 'ready', () => {
    // log it
    console.log( 'DomeBot is ready' );
  });
  // create a listener for any messages received from Discord
  client.on( 'message', message => {
    // handle input
    handleInput();
  });
}

/* handle any and all user input, calling the appropriate processing functions */
function handleInput() {
  // if the user intended to start a raid event
    if( message.content.includes( '!createraid' ) ) {
      // start setting up the raid
      setupRaid( message );  
    }
}

/* set up a new raid event */
function setupRaid() {
  // signal back that we understood
  message.channel.send( `Creating your Raid ${message.author.username}` );

  var raidInfo = message.content.replace( '!createraid ', '' ).split( ', ' );

  var dateString = raidInfo[1] + ' ' + raidInfo[2],
      dateTimeParts = dateString.split( ' ' ),
      timeParts = dateTimeParts[1].split( ':' ),
      dateParts = dateTimeParts[0].split( '/' ),
      date;

  date = new Date( dateParts[ 2 ], parseInt( dateParts[ 1 ], 10 ) - 1, dateParts[ 0 ], timeParts[ 0 ], timeParts[ 1 ] );

  var newRaid = raid({
    name: raidInfo[ 0 ],
    dateAndTime: date,
    peopleNeeded: raidInfo[ 3 ]
  });

  newRaid.save( err => {
    if( err ) console.log( err );
    console.log( 'Raid saved!' );
  });

  message.channel.send( `Raid created! Here are your details:
  Name: ${ newRaid.name }
  When: ${ moment( date ).format( 'MMMM Do YYYY, h:mm a' ) }
  Spaces left: ${ newRaid.peopleNeeded }` );

  let result = '!createraid Wrath of the Machine Challenge Mode, 27/02/2018, 20:45, 3';

  result = result.replace( '!createraid ', '' );
  result = result.split( ', ' );
  console.log( result );
  console.log( `Your next raid is: ${ result[ 0 ] }
                Kicking off: ${ result[ 1 ] } : ${ result[ 2 ] }
                Still need: ${ result[ 3 ] }` );
}