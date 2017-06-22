// imports for the win
const MongoClient = require( 'mongodb' ).MongoClient;

exports.connectToDatabase = () => {
  // return a promise for chaining by the calling function
  return new Promise( ( resolve, reject ) => {
    // connect to the mongo database
    MongoClient.connect( `${ process.env.MONGO_URI }/${ process.env.DATABASE }`, ( err, db ) => {
    // MongoClient.connect( process.env.MONGOLAB_URI, ( err, db ) => {
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
};
