//
// Get browser's localStorage
//

function execute(whoami, done) {

  whoami.store('localStorage', Object.assign({}, window.localStorage));
  done();

}


export default { execute: execute }
