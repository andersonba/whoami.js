import { objToString, patchFunction } from '../utils';

//
// Get all console output
//

const defaultConsoleFilters = {
  log: true,
  error: true,
  info: true,
  warn: true
};

function init(whoami) {

  whoami.__output_console = [];

  let filters = whoami.options.console;
  if (filters !== false) {
    filters = typeof(filters) === 'object' ? filters : {};
    filters = Object.assign(defaultConsoleFilters, filters);
  }

  const enabledFns = Object.keys(filters)
    .filter(f => filters[f]);

  enabledFns.map(name => {
    patchFunction(window.console, name, function() {
      whoami.__output_console.push({
        time: +new Date(),
        type: name,
        message: Array.prototype.slice.call(arguments).map(objToString).join(' ')
      })
    }.bind(whoami));
  });

}

function execute(whoami, done) {

  whoami.store('console', whoami.__output_console);
  done();

}


export default { init: init, execute: execute }
