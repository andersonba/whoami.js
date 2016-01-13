import constants from './constants';

class whoami {

  constructor(options = {}) {
    const {
    } = options;

    this.bindEvent();
    this.bindShortcut();
  }

  execute() {
    alert('Capturing...');
  }

  bindEvent() {
    document.addEventListener(constants.executeEvent, this.execute);
  }

  bindShortcut() {
    document.addEventListener('keydown', e => {
      const isModifier = !!e[`${constants.shortcutModifier}Key`];
      const isKey = String.fromCharCode(e.which) === constants.shortcutKey;

      if (isModifier && isKey) {
        document.dispatchEvent(new Event(constants.executeEvent));
      }
    });
  }

}


module.exports = whoami;
