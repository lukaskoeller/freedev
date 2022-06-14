'use strict';
console.log('handleApiTest: Loading function');

exports.handler = (event, context, callback) => {
  console.log({ event, context });
  
  callback(null, `handleApiTest: ${JSON.stringify(event)}`);
}