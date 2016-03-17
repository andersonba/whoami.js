//
// Get browser's localStorage
//

function execute(whoami, done) {
  const storage = window.localStorage || {};
  let output = {};

  for (const attr in storage) {
    if (storage.hasOwnProperty(attr) && attr.indexOf(whoami.store.prefix) < 0) {
      output[attr] = storage[attr];
    }
  }

  whoami.store.set('localStorage', output);
  done();

}


export default { execute: execute }
