var submitBtn = document.getElementById('submit');
var taskName = document.getElementById('tasks-name');
var taskFunction = document.getElementById('tasks-function');

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

// tasks input
document.getElementById('tasks-input').addEventListener('change', function() {
  document.getElementById('tasks-group').style.display = this.checked ? 'block' : 'none';
});


function isChecked(name) {
  return document.querySelector('[name="'+name+'"]').checked;
}

function mountTasks() {
  var output = {};
  output[taskName.value] = eval('fn = ' + taskFunction.value);
  return output;
}

function rawCode(options) {
  if (isChecked('tasks')) {
    delete options.filters.tasks;
    options.filters.tasks = {};
    options.filters.tasks[taskName.value] = taskFunction.value;
  }
  return 'new whoami(' + JSON.stringify(options) + ');';
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
      tasks: isChecked('tasks') ? mountTasks() : null,
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

  document.getElementById('options').innerHTML = rawCode(JSON.parse(JSON.stringify(options)));

  var me = new whoami(options, function(output) {
    var screenshot = output.screenshot;

    // bug: to avoid crash memory
    if (isChecked('screenshot')) {
      output.screenshot = 'BASE64_FORMAT';
    }
    document.getElementById('output').innerHTML = JSON.stringify(output);
    submit.disabled = false;

    // show screenshot?
    var sDiv = document.getElementById('screenshot');
    sDiv.style.display = screenshot ? 'block' : 'none';
    document.getElementById('screenshot-img').src = screenshot;

    window.scroll(0, document.getElementById('result').offsetTop);
  });

  me.execute();
};
