//
// Get browser's localStorage
//

function execute(whoami, done) {
  const storage = window.localStorage || {};
  let output = {};

  for (const attr in storage) {
    if (storage.hasOwnProperty(attr)) {
      output[attr] = storage[attr];
    }
  }

  whoami.store('localStorage', output);
  done();

}


export default { execute: execute }
