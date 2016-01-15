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
  var result = document.getElementById('result');

  submit.disabled = true;
  result.style.display = 'none';

  var options = {
    api: isChecked('api') ? '/api' : null,
    clipboard: isChecked('clipboard'),
    customData: isChecked('customData') ? {id: 123, username: 'myuser', email: 'user@email.com'} : null,
    shortcut: false,
    filters: {
      tasks: isChecked('tasks') ? mountTasks() : null,
      basic: isChecked('basic'),
      screenshot: isChecked('screenshot'),
      exception: isChecked('exception'),
      cookie: isChecked('cookie'),
      localStorage: isChecked('localStorage'),
      feedback: isChecked('feedback'),
      console: isChecked('console') ? {
        log: isChecked('console.log'),
        error: isChecked('console.error'),
        debug: isChecked('console.debug'),
        info: isChecked('console.info'),
        warn: isChecked('console.warn'),
      } : false
    }
  };

  var me = new whoami(options, function(output) {
    var screenshot = output.screenshot;

    // bug: to avoid crash memory
    if (isChecked('screenshot')) {
      output.screenshot = 'BASE64_FORMAT';
    }

    // write payload
    result.style.display = 'block';
    document.getElementById('options').innerHTML = rawCode(JSON.parse(JSON.stringify(options)));
    document.getElementById('output').innerHTML = JSON.stringify(output);
    submit.disabled = false;

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
