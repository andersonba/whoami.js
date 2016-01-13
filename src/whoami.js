import constants from './constants';
import { getCookies } from './utils';

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
    this.userContext = userContext;
    this.filters = Object.assign(defaultFilters, filters);

    // binds
    this.execute = this.execute.bind(this);
    this._runCatches = this._runCatches.bind(this);

    // start
    this._init();
    this._bindEvent();
    this._bindShortcut();
  }

  execute() {
    this._runCatches();
  }

  _init() {
  }

  _runCatches() {
    Object.keys(this.filters).map(f => {
      const fnName = 'catch' + f.charAt(0).toUpperCase() + f.slice(1);
      if (this[fnName] && typeof(this[fnName]) === 'function') {
        this[fnName]();
      }
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
    this._addReport('cookie', getCookies());
  }

  catchLocalStorage() {
    this._addReport('localStorage', localStorage);
  }

}


module.exports = whoami;
