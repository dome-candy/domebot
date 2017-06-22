const Discord = require( 'discord.js' );
    // Must remove this comment! - Astra
    // moment           = require( 'moment' ),
    //   dbUtils          = require( './middleware/db-utilities' ),
const raidMiddleware   = require( './raid-middleware' ),
      actionMiddleware = require( './action-middleware' );

// connect to Discord to allow writing to channels
const client = new Discord.Client( { sync: true } );

/* log in to Discord */
exports.login = () => {
    client.login( process.env.CLIENT_TOKEN );
};

/* bind all event listeners */
exports.bindEventListeners = () => {
  // when the bot is ready, log it
  client.on( 'ready', () => {
    console.log( 'DomeBot is ready' );
    // run a test ( this will be removed when the Discord server is connected )
    //exports.runTest();
  });
  // create a listener for any messages received from Discord
  client.on( 'message', message => {
    // process the user's input
    exports.handleInput( message );
  });
};

/* handle any and all user input, calling the appropriate processing functions */
exports.handleInput = message => {
  let details, action;
  let usableActions = ['!createraid', '!joinraid', '!leaveraid', '!findraids'];
  // extract the action from the user's message by grabbing everything up to the first space
  //action = message.content.slice( 0, message.content.indexOf( ' ' ) ).toLowerCase();
  for (var i = 0; i < usableActions.length; i++) {
    if (message.content.indexOf(usableActions[i]) > -1) {
      action = usableActions[i];
      break;
    } else if(i === usableActions.length - 1){
      action = message.content;
      break;
    }
  };
  console.log(action);
  // if the action starts with a !, it is meant to be a new action
  if( action.startsWith( '!' ) ) {
    // split the message (minus the action) into array elements
    const rawDetails = message.content.replace( action, '' ).split( ',' );
    // trim any whitespace off each of the details elements
    details = rawDetails.map( detail => detail.trim() );
  // otherwise, we're expecting a single action as a string
  } else {
    details = message.content;
  }
  // extract the channel object to allow the bot to respond to the user
  const channel = message.channel
  // extract information about the author making the request
  const author = message.author;
  // call the function needed to handle the user's request
  switch( action ) {
    case '!createraid' : raidMiddleware.setupRaid( message, author, channel ); break;
    case '!joinraid'   : raidMiddleware.joinRaid( author, details, channel ); break;
    case '!leaveraid'  : raidMiddleware.leaveRaid( author, details, channel ); break;
    case '!findraids'  : raidMiddleware.findRaids( details, channel ); break;
    default            : raidMiddleware.existingProcess( message, author, channel );
  }
};

/* TODO: delete this when testing without Discord isn't needed */
/*exports.runTest = () => {
console.log( 'running test' );
  const message = {
    content: '!createraid Wrath of the Machine Challenge Mode, 3, 27/02/2018, 20:45, GMT',
    author: {
      username: 'John Snow'
    },
    channel: {
      send: console.log
    }
  }

  exports.handleInput( message );
};
*/
