import { postRequest } from '../utils';

//
// Send output files via Cloudinary
// http://cloudinary.com/documentation/image_upload_api_reference
//

const errorMessage = 'Submit failed to Cloudinary, try again or contact us.';

function action(whoami, output) {
  const screenshot = output.screenshot;
  delete output.screenshot;

  const { name, apiKey, preset } = whoami.options.cloudinary;
  const url = `https://api.cloudinary.com/v1_1/${name}/image/upload`;

  if (!(url && name && apiKey)) {
    throw new Error('Missing Cloudinary data in whoami.js');
  }

  let form = new FormData();
  form.append('upload_preset', preset)
  form.append('timestamp', +new Date);
  form.append('api_key', apiKey);
  form.append('file', screenshot);

  postRequest(url, form, (err, response) => {
    if (err) {
      return alert(errorMessage);
    }
    const result = JSON.parse(response);
    prompt(result.url);
  });
}


export default { action: action }
