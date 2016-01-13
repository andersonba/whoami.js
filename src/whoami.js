import constants from './constants';
import utils from './utils';

class whoami {

  constructor(options = {}) {

    const {
      userContext = null,
      filters = {}
    } = options;

    const defaultFilters = {
      basic: true,
      userContext: true
    };

    this.reports = [];
    this.reportsException = [];
    this.reportsConsole = [];
    this.userContext = userContext;
    this.filters = Object.assign(defaultFilters, filters);

    // binds
    this.execute = this.execute.bind(this);
    this._runCatches = this._runCatches.bind(this);
    this._bindException = this._bindException.bind(this);
    this._bindConsole = this._bindConsole.bind(this);

    // start
    this._init();
    this._bindEvent();
    this._bindShortcut();
  }

  execute() {
    this._runCatches();
  }

  _init() {
    // save exceptions
    if (this.filters.exception) {
      this._bindException();
    }

    // save console output
    if (this.filters.console) {
      this._bindConsole();
    }
  }

  _runCatches() {
    Object.keys(this.filters).map(f => {
      const fnName = 'catch' + f.charAt(0).toUpperCase() + f.slice(1);
      if (this[fnName] && typeof(this[fnName]) === 'function') {
        this[fnName]();
      }
    });
  }

  _bindException() {
    window.onerror = function(msg, url, line, col, error) {
      this.reportsException.push({
        time: +new Date(),
        message: msg,
        url: url,
        line: line,
        col: col
      });
    }.bind(this)
  }

  _bindConsole() {
    ['log', 'error', 'debug', 'info', 'warn'].map(name => {
      utils.patchFunction(window.console, name, function() {
        this.reportsConsole.push({
          time: +new Date(),
          message: Array.prototype.slice.call(arguments).join(' ')
        })
      }.bind(this));
    });
  }

  _bindEvent() {
    document.addEventListener(constants.executeEvent, this.execute);
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
    this.reports.push({
      name: name,
      value: value
    });
  }

  catchBasic() {
    this._addReport('basic', {
      title: document.title,
      url: window.location.href,
      origin: window.location.origin,
      userAgent: navigator.userAgent,
      resolution: `${screen.width}x${screen.height}`
    });
  }

  catchUserContext() {
    if (!this.userContext) {
      return;
    }
    this._addReport('userContext', this.userContext);
  }

  catchCookie() {
    this._addReport('cookie', utils.getCookies());
  }

  catchLocalStorage() {
    this._addReport('localStorage', Object.assign({}, localStorage));
  }

  catchException() {
    this._addReport('exception', this.reportsException);
  }

  catchConsole() {
    this._addReport('console', this.reportsConsole);
  }

}


module.exports = whoami;
