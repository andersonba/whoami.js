//
// Catch all errors
//

function init(whoami) {

  whoami.__output_error = [];

  window.onerror = function(msg, url, line, col) {

    whoami.__output_error.push({
      time: +new Date(),
      message: msg,
      url: url,
      line: line,
      col: col
    });

    return false;
  }

}

function execute(whoami, done) {

  whoami.store('error', whoami.__output_error);
  done();

}


export default { init: init, execute: execute };
