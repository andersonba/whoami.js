//
// Run custom functions and store the results [sync/async]
//

function execute(whoami, done) {

  const fns = whoami.options.functions || {};
  let finished = 0;
  let output = {};

  function checkFinalize() {
    if (finished >= Object.keys(fns).length) {
      whoami.store.set('functions', output);
      done();
    }
  }

  for (let k in fns) {
    output[k] = undefined;

    // async
    const val = fns[k]((v) => {
      output[k] = v;
      checkFinalize();
    });

    // sync
    if (val) {
      output[k] = val;
      checkFinalize();
    }

    finished++;
  }
}


export default { execute: execute }
