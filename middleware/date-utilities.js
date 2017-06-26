exports.handleDate = ( dateString, timeString, timezone ) => {
  // create variables for storing pieces of the date string
  let day, month, year;
  // use destructuring assignment to extract the parts of the time
  let [ hours, minutes ] = timeString.split( ':' );
  // update the hours value based on the passed in timezone if one exists
  hours = timezone ? getTimeOffset( hours, timezone ) : hours;

  // change the time based on the offset, using destructuring assignment to extract the parts of the date
  switch( timezone ) {
    case 'GMT' : [ day, month, year ] = dateString.split( '/' ); break;
    case 'EST' : [ month, day, year ] = dateString.split( '/' ); break;
    default    : [ year, month, day ] = dateString.split( '/' );
  }

  // create date object, passing date parts in the expected order
  return new Date( year, month, day, hours, minutes );
};

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

exports.dateOnly = (dateString) => {
  let day, month, year;
  [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

exports.timeOnly = (timeString) => {
  let [hours, minutes] = timeString.split(':');
  return new Date( "", "", "", hours, minutes);
}
