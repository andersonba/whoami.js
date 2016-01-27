//
// Run custom functions and store the results [sync/async]
//

function execute(whoami, done) {

  const fns = whoami.options.filters.functions || {};
  let finished = 0;
  let output = {};

  function checkFinalize() {
    if (finished >= Object.keys(fns).length) {
      whoami.store('functions', output);
      done();
    }
  }

  for (let k in fns) {
    // async
    const val = fns[k]((v) => {
      output[k] = v;
      finished++;
      checkFinalize();
    });

    // sync
    if (val) {
      output[k] = val;
      finished++;
      checkFinalize();
    }
  }
}


export default { execute: execute }
