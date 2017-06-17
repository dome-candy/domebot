// imports for the win
const MongoClient = require( 'mongodb' ).MongoClient;

exports.connectToDatabase = () => {
  // return a promise for chaining by the calling function
  return new Promise( ( resolve, reject ) => {
    // connect to the mongo database
    MongoClient.connect( process.env.MONGO_URI, ( err, db ) => {
      // if there was an error
      if( err ) {
        // reject the promise with the reason for the failure
          return reject( err );
      }
      // otherwise, log it and resolve the promise
      console.log( 'database connection open' );
      resolve();

    });
  });
}

function getTimeOffset( hours, timezone ) {
  // create a variable to store the hour offset based on the specified timezone
  let offset;
  // set the offset value, add more timezone handlers as needed
  switch( timezone ) {
    case 'GMT' : offset = 4; break;
    default    : offset = 0;
  }
  // convert and return the time
  return parseInt( hours, 10 ) + offset;
}