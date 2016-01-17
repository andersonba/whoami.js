//
// copy to clipboard
//

const message = 'Copy this text and send for us. Thanks!';

function action(whoami, output) {

  prompt(message, JSON.stringify(output));

}

export default { action: action }
