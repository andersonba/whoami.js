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
      userContext: true,
      screenshot: true
    };

    this.reports = [];
    this.reportsException = [];
    this.reportsConsole = [];
    this.userContext = userContext;
    this.filters = Object.assign(defaultFilters, filters);
    this.enabledFilters = Object.keys(this.filters).filter(f => this.filters[f]);

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
    this._showLoading();

    // load html2canvas.js external script
    utils.loadScript(constants.html2canvasUrl, () => {
      this._runCatches(() => {
        this._hideLoading();
      });
    });
  }

  _showLoading() {
    console.log('Loading: start');
  }

  _hideLoading() {
    console.log('Loading: done');
  }

  _init() {
    // save exceptions
    if ('exception' in this.enabledFilters) {
      this._bindException();
    }

    // save console output
    if ('console' in this.enabledFilters) {
      this._bindConsole();
    }
  }

  _runCatches(done) {
    let returned = 0;
    const enabledFilters = this.enabledFilters;

    enabledFilters.map(f => {
      const fnName = 'catch' + f.charAt(0).toUpperCase() + f.slice(1);
      if (this[fnName] && typeof(this[fnName]) === 'function') {
        this[fnName](function() {
          returned++;

          if (returned === enabledFilters.length) {
            done();
          }
        });
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

  catchBasic(done) {
    this._addReport('basic', {
      title: document.title,
      url: window.location.href,
      origin: window.location.origin,
      userAgent: navigator.userAgent,
      resolution: `${screen.width}x${screen.height}`
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
    this._addReport('exception', this.reportsException);
    done();
  }

  catchConsole(done) {
    this._addReport('console', this.reportsConsole);
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

}


module.exports = whoami;
