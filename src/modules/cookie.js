import { getCookies } from '../utils';

//
// Get domain's cookie
//

function execute(whoami, done) {

  whoami.store.set('cookie', getCookies());
  done();

}


export default { execute: execute }
