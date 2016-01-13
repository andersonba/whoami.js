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

}


module.exports = whoami;
