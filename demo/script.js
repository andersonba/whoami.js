var submitBtn = document.getElementById('submit');
var functionName = document.getElementById('function-name');
var functionCode = document.getElementById('function-code');

// submit button
submitBtn.addEventListener('click', function(e) {
  e.preventDefault();
  configureAndExecute();
});

// shortcut
document.addEventListener('keydown', e => {
  if (e.ctrlKey && String.fromCharCode(e.which) === '0') {
    submitBtn.dispatchEvent(new Event('click'));
  }
});

// toggle groups
var toggleGroup = document.getElementsByClassName('filter-group-input');
for (var i=0, len=toggleGroup.length; i<len; i++) {
  toggleGroup[i].addEventListener('change', function() {
    this.parentNode.nextElementSibling.nextElementSibling.style.display = this.checked ? 'block' : 'none';
  });
}


function isChecked(name) {
  return document.querySelector('[name="'+name+'"]').checked;
}

function mountFunctions() {
  var output = {};
  output[functionName.value] = eval('fn = ' + functionCode.value);
  return output;
}

function rawCode(options) {
  if (isChecked('functions')) {
    delete options.filters.functions;
    options.filters.functions = {};
    options.filters.functions[functionName.value] = functionCode.value;
  }
  options.cloudinary = {
    name: 'CLOUD_NAME',
    key: 'API_KEY',
    preset: 'UNSIGNED_PRESET'
  };
  ['clipboard', 'ajax', 'slack', 'context', 'shortcut'].map(function(k) {
    if (options[k] === false || options[k] === null || options[k] === undefined) {
      delete options[k];
    }
  });
  return 'new whoami(' + JSON.stringify(options) + ');';
}

function configureAndExecute() {
  var submit = document.getElementById('submit');
  var result = document.getElementById('result');

  submit.disabled = true;
  submit.innerHTML = 'CAPTURING...';
  result.style.display = 'none';

  var options = {
    cloudinary: {
      name: 'whoami',
      key: '239596714167885',
      preset: 'scalg9q6'
    },
    clipboard: isChecked('clipboard'),
    ajax: isChecked('ajax') ? {
      url: '/api',
      callback: function(err, response) {
        var code;
        try {
          code = JSON.parse(response).code;
        } catch(err) { code = '012345' }

        if (err) {
          return alert('Submit failed, try again or contact us.');
        }
        alert('Thanks! Your feedback code is "' + code + '"');
      }
    } : null,
    slack: isChecked('slack') ? 'HOOK_URL' : null,
    context: isChecked('context') ? {id: 123, username: 'myuser', email: 'user@email.com'} : null,
    shortcut: false,
    filters: {
      functions: isChecked('functions') ? mountFunctions() : null,
      basic: isChecked('basic'),
      screenshot: isChecked('screenshot'),
      exception: isChecked('exception'),
      cookie: isChecked('cookie'),
      localStorage: isChecked('localStorage'),
      feedback: isChecked('feedback'),
      console: isChecked('console') ? {
        log: isChecked('console.log'),
        error: isChecked('console.error'),
        info: isChecked('console.info'),
        warn: isChecked('console.warn'),
      } : false
    }
  };

  var me = new whoami(options, function(output) {
    var screenshot = output.screenshot;

    // write payload
    result.style.display = 'block';
    document.getElementById('options').innerHTML = rawCode(JSON.parse(JSON.stringify(options)));
    document.getElementById('output').innerHTML = JSON.stringify(output);
    submit.disabled = false;
    submit.innerHTML = 'CLICK HERE';

    // show screenshot?
    var sDiv = document.getElementById('screenshot');
    sDiv.style.display = screenshot ? 'block' : 'none';
    document.getElementById('screenshot-img').src = screenshot;

    window.scroll(0, result.offsetTop - 50);

    var codesTags = document.getElementsByTagName('code');
    for (var i=0, len=codesTags.length; i<len; i++) {
      hljs.highlightBlock(codesTags[i]);
    }
  });

  me.execute();
};
