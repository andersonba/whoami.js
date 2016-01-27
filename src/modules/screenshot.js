import { loadScript, uploadImage } from '../utils';

//
// Take screenshot
//

const SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';
const errorMessage = 'Failed to upload screenshot, try again.';

function init(whoami) {
  if (whoami.filters.indexOf('screenshot') < 0) {
    return;
  }

  const cloudinary = whoami.options.cloudinary || {};
  if (!(cloudinary.name && cloudinary.key && cloudinary.preset)) {
    throw new Error('Missing Cloudinary configuration');
  }
}

function execute(whoami, done) {

  loadScript(SCRIPT_URL, () => {
    const lastPosition = window.scrollY;

    window.html2canvas(document.body, {
      onrendered: canvas => {
        const data = canvas.toDataURL();

        window.scroll(0, lastPosition);

        uploadImage(data, whoami.options.cloudinary, (err, res) => {
          if (err) { alert(errorMessage); }
          whoami.store('screenshot', err ? null : res.url);
          done();
        });
      }
    });

  });

}


export default { init: init, execute: execute }
