//
// Get basic informations from browser
//

function execute(whoami, done) {

  whoami.store('basic', {
    title: document.title,
    url: window.location.href,
    origin: window.location.origin,
    userAgent: navigator.userAgent,
    resolution: `${screen.width}x${screen.height}`,
    time: +new Date()
  });
  done();

}


export default { execute: execute }
