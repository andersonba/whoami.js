import constants from './constants';

class whoami {

  constructor(options = {}) {
    const {
      context = {}
    } = options;

    this.reports = [];
    this.userContext = context;

    this._bindEvent();
    this._bindShortcut();
  }

  execute() {
    alert('Capturing...');
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
    let cookies = {};
    const pairs = document.cookie.split(';');
    for (let i=0, len=pairs.length; i < len; i++) {
      const pair = pairs[i].trim().split('=');
      cookies[pair[0]] = unescape(pair[1]);
    }
    this._addReport('cookie', cookies);
  }

  catchLocalStorage() {
    this._addReport('localStorage', localStorage);
  }

}


module.exports = whoami;
