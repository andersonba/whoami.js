import constants from './constants';
import utils from './utils';

class whoami {

  constructor(options = {}) {

    const {
      api = null,
      userContext = null,
      filters = {},
      clipboard = false
    } = options;

    const defaultFilters = {
      basic: true,
      userContext: true,
      screenshot: true
    };

    const defaultConsoleFilter = {
      log: true,
      error: true,
      debug: true,
      info: true,
      warn: true
    };

    this.output = {};
    this.loggers = {
      exception: [],
      console: []
    };
    this.api = api;
    this.clipboard = !!clipboard;
    this.userContext = userContext;

    // configuring filters
    this.filters = Object.assign(defaultFilters, filters);
    this.enabledFilters = Object.keys(this.filters).filter(f => this.filters[f]);
    let consoleFilter = this.filters.console;
    if (consoleFilter !== false) {
      consoleFilter = typeof(consoleFilter) === 'object' ? consoleFilter : {};
      this.filters.console = Object.assign(defaultConsoleFilter, consoleFilter);
    }

    // binds
    this.execute = this.execute.bind(this);
    this._runCatches = this._runCatches.bind(this);
    this._bindException = this._bindException.bind(this);
    this._bindConsole = this._bindConsole.bind(this);

    // start
    this._init();
  }

  execute() {
    // reseting output
    this.output = {};

    this._showLoading();

    // load html2canvas.js external script
    utils.loadScript(constants.html2canvasUrl, () => {
      this._runCatches(() => {
        // submit data via ajax
        if (this.api) {
          this._sendAjax(this._hideLoading);
        }

        // copy to clipboard
        if (this.clipboard) {
          this._copyClipboard();
        }
      });
    });
  }

  _showLoading() {
    console.log('Loading: start');
  }

  _hideLoading() {
    console.log('Loading: done');
  }

  _copyClipboard() {
    prompt(constants.clipboardMessage, JSON.stringify(this.output));
  }

  _sendAjax(done) {
    let data = JSON.stringify(this.output);
    utils.postRequest(this.api, data, (err, code) => {
      if (err) {
        alert(constants.submitErrorMessage);
      } else {
        alert(code ? `${constants.sentSuccessCodeMessage} "${code}".` : constants.sentSuccessMessage);
      }
      done();
    });
  }

  _init() {
    // bind global event
    document.addEventListener(constants.executeEvent, this.execute);

    // bind shortcut
    this._bindShortcut();

    // save exceptions
    if (this.enabledFilters.indexOf('exception') >= 0) {
      this._bindException();
    }

    // save console output
    if (this.enabledFilters.indexOf('console') >= 0) {
      this._bindConsole();
    }
  }

  _runCatches(done) {
    let finished = 0;
    const enabled = this.enabledFilters;

    enabled.map(f => {
      const fnName = 'catch' + f.charAt(0).toUpperCase() + f.slice(1);
      if (this[fnName] && typeof(this[fnName]) === 'function') {
        this[fnName](() => {
          finished++;
          if (enabled.length === finished) {
            done();
          }
        });
      }
    });
  }

  _bindException() {
    window.onerror = function(msg, url, line, col) {
      this.loggers.exception.push({
        time: +new Date(),
        message: msg,
        url: url,
        line: line,
        col: col
      });
    }.bind(this)
  }

  _bindConsole() {
    const enabledFns = Object.keys(this.filters.console)
      .filter(f => this.filters.console[f]);

    enabledFns.map(name => {
      utils.patchFunction(window.console, name, function() {
        this.loggers.console.push({
          time: +new Date(),
          message: Array.prototype.slice.call(arguments).join(' ')
        })
      }.bind(this));
    });
  }

  _bindShortcut() {
    document.addEventListener('keydown', e => {
      const isModifier = !!e[`${constants.shortcutModifier}Key`];
      const isKey = String.fromCharCode(e.which) === constants.shortcutKey;

      if (isModifier && isKey) {
        document.dispatchEvent(new Event(constants.executeEvent));
      }
    });
  }

  _addReport(name, value) {
    let existent = this.output[name];
    if (existent) {
      existent = utils.isArray(existent) ? existent : [existent];
      existent.push(value);
    }
    this.output[name] = existent || value;
  }

  catchBasic(done) {
    this._addReport('basic', {
      title: document.title,
      url: window.location.href,
      origin: window.location.origin,
      userAgent: navigator.userAgent,
      resolution: `${screen.width}x${screen.height}`,
      time: +new Date()
    });
    done();
  }

  catchUserContext(done) {
    if (this.userContext) {
      this._addReport('userContext', this.userContext);
    }
    done();
  }

  catchCookie(done) {
    this._addReport('cookie', utils.getCookies());
    done();
  }

  catchLocalStorage(done) {
    this._addReport('localStorage', Object.assign({}, localStorage));
    done();
  }

  catchException(done) {
    this._addReport('exception', this.loggers.exception);
    done();
  }

  catchConsole(done) {
    this._addReport('console', this.loggers.console);
    done();
  }

  catchScreenshot(done) {
    window.html2canvas(document.body, {
      onrendered: canvas => {
        this._addReport('screenshot', canvas.toDataURL());
        done();
      }
    });
  }

  catchDescription(done) {
    const result = prompt(constants.descriptionDialogMessage);
    this._addReport('description', result);
    done();
  }

}


module.exports = whoami;
