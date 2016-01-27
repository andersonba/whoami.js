//
// Get browser's localStorage
//

function execute(whoami, done) {
  var storage = window.localStorage || {};
  var output = {};

  for (var attr in storage) {
    if (storage.hasOwnProperty(attr)) {
      output[attr] = storage[attr];
    }
  }

  whoami.store('localStorage', output);
  done();

}


export default { execute: execute }
