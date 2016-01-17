import { loadScript } from '../utils';

//
// Take screenshot
//

const SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';

function execute(whoami, done) {

  utils.loadScript(SCRIPT_URL, () => {

    window.html2canvas(document.body, {
      onrendered: canvas => {
        whoami.store('screenshot', canvas.toDataURL());
        done();
      }
    });

  });

}


export default { execute: execute }
