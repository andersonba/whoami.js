//
// Run custom functions and store the results [sync/async]
//

function execute(whoami, done) {

  const tasks = whoami.options.filters.tasks || {};
  let finished = 0;
  let output = {};

  function checkFinalize() {
    if (finished >= Object.keys(tasks).length) {
      whoami.store('function', output);
      done();
    }
  }

  for (let k in tasks) {
    // async
    var val = tasks[k]((v) => {
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
