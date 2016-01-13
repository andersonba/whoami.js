// start
var submitBtn = document.getElementById('submit');
document.addEventListener('keydown', e => {
  if (e.ctrlKey && String.fromCharCode(e.which) === '0') {
    submitBtn.dispatchEvent(new Event('click'));
  }
});
submitBtn.addEventListener('click', function() {
  configureAndExecute();
});


function isChecked(name) {
  return document.querySelector('[name="'+name+'"]').checked;
}

function configureAndExecute() {
  var submit = document.getElementById('submit');
  submit.disabled = true;

  var options = {
    api: isChecked('api') ? '/api' : null,
    clipboard: isChecked('clipboard'),
    customData: isChecked('customData') ? {uid: 123, email: 'andersonba@email.com'} : null,
    shortcut: false,
    filters: {
      basic: isChecked('basic'),
      screenshot: isChecked('screenshot'),
      exception: isChecked('exception'),
      cookie: isChecked('cookie'),
      localStorage: isChecked('localStorage'),
      description: isChecked('description'),
      console: isChecked('console') ? {
        log: isChecked('console.log'),
        error: isChecked('console.error'),
        debug: isChecked('console.debug'),
        info: isChecked('console.info'),
        warn: isChecked('console.warn'),
      } : false
    }
  };

  document.getElementById('options').innerHTML = 'new whoami(' + JSON.stringify(options) + ');';
  var instance = new whoami(options, function(output) {
    var screenshot = output.screenshot;

    // bug: to avoid crash memory
    output.screenshot = 'BASE64_FORMAT';
    document.getElementById('output').innerHTML = JSON.stringify(output);
    submit.disabled = false;

    // show screenshot?
    var sDiv = document.getElementById('screenshot');
    sDiv.style.display = screenshot ? 'block' : 'none';
    document.getElementById('screenshot-img').src = screenshot;

    window.scroll(0, document.getElementById('result').offsetTop);
  });

  instance.execute();
};
