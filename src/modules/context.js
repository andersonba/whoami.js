//
// Get custom data defined in whoami instance
//

function execute(whoami, done) {

  if (whoami.options.context) {
    whoami.store.set('context', whoami.options.context);
  }
  done();

}

export default { execute: execute }
