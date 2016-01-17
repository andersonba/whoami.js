//
// Get custom data defined in whoami instance
//

function execute(whoami, done) {

  if (whoami.options.context) {
    whoami.store('context', whoami.options.context);
  }
  done();

}

export default { execute: execute }
