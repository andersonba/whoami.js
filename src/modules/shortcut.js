//
// Use Ctrl + 0 to execute whoami
//

const modifier = 'ctrl';
const key = '0';

function init(whoami) {

  if (!whoami.options.shortcut) {
    return;
  }

  document.addEventListener('keydown', e => {
    const isModifier = !!e[`${modifier}Key`];
    const isKey = String.fromCharCode(e.which) === key;

    if (isModifier && isKey) {
      whoami.execute();
    }
  });

}


export default { init: init }
