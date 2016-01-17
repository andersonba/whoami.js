import { postRequest } from '../utils';

//
// Send data via ajax request
//

const successMessage = 'Thank you, we will contact you soon';
const errorMessage = 'Submit failed, try again or contact us.';

function action(whoami, output) {

  const data = JSON.stringify(output);
  const options = whoami.options.ajax;
  const hasOptions = typeof(options) !== 'string';
  const url = !hasOptions ? options : options.url;
  const callback = hasOptions ? options.callback : undefined;

  postRequest(url, data, (err, response) => {
    if (callback) {
      return callback(response);
    }

    // default behavior
    alert(err ? errorMessage : successMessage);
  })

}

export default { action: action }
