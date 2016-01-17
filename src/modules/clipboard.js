import { clipboardMessage } from '../constants';

//
// copy to clipboard
//

function action(whoami, output) {

  if (whoami.options.clipboard) {
    prompt(clipboardMessage, JSON.stringify(output));
  }

}

export default { action: action }
