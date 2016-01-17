//
// Get all console output
//

const defaultConsoleFilters = {
  log: true,
  error: true,
  debug: true,
  info: true,
  warn: true
};

function init(whoami) {

  if (whoami.filters.indexOf('console') < 0) {
    return;
  }

  window.__whoami_console = [];

  let filters = whoami.options.filters.console;
  if (filters !== false) {
    filters = typeof(filters) === 'object' ? filters : {};
    filters = Object.assign(defaultConsoleFilters, filters);
  }

  const enabledFns = Object.keys(filters)
    .filter(f => filters[f]);

  enabledFns.map(name => {
    utils.patchFunction(window.console, name, function() {
      window.__whoami_console.push({
        time: +new Date(),
        message: Array.prototype.slice.call(arguments).join(' ')
      })
    }.bind(whoami));
  });

}

function execute(whoami, done) {

  whoami.store('console', window.__whoami_console);
  done();

}


export default { init: init, execute: execute }
