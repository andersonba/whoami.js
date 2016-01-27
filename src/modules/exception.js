//
// Catch all exceptions
//

function init(whoami) {

  if (whoami.filters.indexOf('exception') < 0) {
    return;
  }

  window.__whoami_exceptions = [];

  window.onerror = function(msg, url, line, col) {

    window.__whoami_exceptions.push({
      time: +new Date(),
      message: msg,
      url: url,
      line: line,
      col: col
    });
  }

}

function execute(whoami, done) {

  whoami.store('exception', window.__whoami_exceptions);
  done();

}


export default { init: init, execute: execute };
