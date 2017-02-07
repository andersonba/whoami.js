//
// Run custom functions and store the results [sync/async]
//

function execute(whoami, done) {

  const fns = whoami.options.functions || {};
  const timeout = whoami.options.functionsTimeout;
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
      finished++;
      checkFinalize();
    });

    // sync
    if (!output[k] && val) {
      output[k] = val;
      finished++;
      checkFinalize();
    }

    setTimeout(() => {
      if (!output[k]) {
        finished++;
        checkFinalize();
      }
    }, timeout);
  }
}


export default { execute: execute }
