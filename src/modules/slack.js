import { postRequest } from '../utils';

//
// Send output to specific channel on Slack
// Use blockspring to forward request (using CORS)
// https://open.blockspring.com/andersonba/slack-proxy
//

const defaultOptions = {
  username: 'Whoami.js',
  text: 'New ticket received',
  urlfurl_links: true,
  link_names: false
}
const apiUrl = 'https://run.blockspring.com/api_v2/blocks/slack-proxy?api_key=br_1823_0eadf85b1a5f954587fc96df1917fd68ccc7fee8';
const failedMessage = 'Submit failed to Slack, try again or contact us';
const successMessage = 'Thank you! We contact you soon'

function action(whoami, output) {
  const options = whoami.options.slack;

  // TODO: upload image and show as attachment in post
  // Currently disabled, avoiding large post message (base64)
  delete output.screenshot;

  let hookUrl, data, callback;
  if (typeof(options) === 'string') {
    data = defaultOptions;
    hookUrl = options;
  } else {
    data = Object.assign(options, defaultOptions);
    hookUrl = options.hook_url;
    callback = data.callback;
    delete data.hook_url;
    delete data.callback;
  }

  // attachments
  data.attachments = [{
    title: 'Informations',
    fields: (function() {
      let fields = [];
      Object.keys(output).map(k => {
        fields.push({
          title: k.charAt(0).toUpperCase() + k.slice(1),
          value: JSON.stringify(output[k]),
          short: false
        });
      });
      return fields;
    }())
  }];

  const params = { hook_url: hookUrl, data: data};
  postRequest(apiUrl, params, (err, response) => {
    try {
      response = JSON.parse(response);
    } catch(err) {
      response = {};
    }

    const hasError = err && !response.sent;

    if (callback) {
      return callback(hasError)
    }

    alert(hasError ? failedMessage : successMessage);
  });
}


export default { action: action }
