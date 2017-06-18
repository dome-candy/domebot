exports.promptForName = ( name, channel ) => {
  // return a promise for chaining by the calling function
  return new Promise( ( resolve, reject ) => {
    // connect to the mongo database
    MongoClient.connect( `${ process.env.MONGO_URI }/${ process.env.DATABASE }`, ( err, db ) => {
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

exports.promptForOpenings = channel => {

};

exports.promptForDate = channel => {

};

exports.promptForTime = channel => {

};

exports.promptForTimezone = channel => {

};