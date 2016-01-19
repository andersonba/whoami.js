import { loadScript, uploadImage } from '../utils';

//
// Take screenshot
//

const SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';
const errorMessage = 'Failed to upload screenshot, try again.';

function execute(whoami, done) {

  loadScript(SCRIPT_URL, () => {
    const lastPosition = window.scrollY;

    window.html2canvas(document.body, {
      onrendered: canvas => {
        const data = canvas.toDataURL();

        window.scroll(0, lastPosition);

        uploadImage(data, whoami.options.cloudinary, (err, res) => {
          if (err) { return alert(errorMessage); }

          whoami.store('screenshot', res.url);
          done();
        });

      }
    });

  });

}


export default { execute: execute }
