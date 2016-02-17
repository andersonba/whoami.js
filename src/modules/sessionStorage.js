//
// Get window's sessionStorage
//

function execute(whoami, done) {

  whoami.store('sessionStorage', JSON.parse(JSON.stringify(window.sessionStorage)));
  done();

}

export default { execute: execute }
