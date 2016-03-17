import { loadScript } from '../utils';

//
// Take screenshot
//

const SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';

function execute(whoami, done) {

  loadScript(SCRIPT_URL, () => {
    const lastPosition = window.scrollY;

    window.html2canvas(document.body, {
      onrendered: canvas => {
        const data = canvas.toDataURL('image/jpeg');

        window.scroll(0, lastPosition);

        whoami.store.set('screenshot', data);
        done();
      }
    });

  });

}


export default { execute: execute }
