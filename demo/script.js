var submitBtn = document.getElementById('submit');
var functionFilters = document.getElementsByClassName('functions-filters')[0];

// submit button
submitBtn.addEventListener('click', function(e) {
  e.preventDefault();
  configureAndExecute();
});

// shortcut
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && String.fromCharCode(e.which) === '0') {
    submitBtn.dispatchEvent(new Event('click'));
  }
});

// toggle groups
var toggleGroup = document.getElementsByClassName('filter-group-input');
for (var i=0, len=toggleGroup.length; i<len; i++) {
  var input = toggleGroup[i];
  input.addEventListener('change', function() {
    var group = this.parentNode.nextElementSibling.nextElementSibling;
    group.style.display = this.checked ? 'block' : 'none';
  });
}

// functions add
var control = document.getElementsByClassName('function-fork')[0].cloneNode(true);
var inputsControl = control.querySelectorAll('input');
inputsControl[0].value = 'myFunction';
inputsControl[1].value = 'function() {}';

document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('function-add')) { return; }

  var newElement = control.cloneNode(true);
  var inputsNew = newElement.querySelectorAll('input');

  functionFilters.insertBefore(newElement, document.getElementsByClassName('function-add')[0]);
});

// functions remove
document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('function-remove')) { return; }
  e.target.parentNode.remove();
});


function isChecked(name) {
  return document.querySelector('[name="'+name+'"]').checked;
}

function mountObjFromFunctionItems(modifier) {
  modifier = modifier || function(r) { return r };
  var items = document.getElementsByClassName('function-item');
  var output = {};
  Array.prototype.forEach.call(items, function(node) {
    output[node.querySelectorAll('.function-name')[0].value] = modifier(node.querySelectorAll('.function-code')[0].value);
  });
  return output;
}

function mountFunctions() {
  return mountObjFromFunctionItems(function(code) {
    return eval('fn = ' + code);
  });
}

function rawCode(options) {
  if (isChecked('functions')) {
    delete options.functions;
    options.functions = mountObjFromFunctionItems();
  }
  return 'new whoami(' + JSON.stringify(options) + ');';
}

function configureAndExecute() {
  var submit = document.getElementById('submit');
  var result = document.getElementById('result');

  submit.disabled = true;
  submit.innerHTML = 'CAPTURING...';
  result.style.display = 'none';

  var options = {};
  ['context', 'functions', 'basic', 'screenshot', 'error', 'cookie', 'localStorage', 'sessionStorage', 'console'].map(function(k) {
    if (!isChecked(k)) { return; }

    var val = true;
    switch (k) {
      case 'context': val = {id: 123, username: 'myuser', email: 'user@email.com'}; break;
      case 'functions': val = mountFunctions(); break;
      case 'console': val = {
        log: isChecked('console.log'),
        error: isChecked('console.error'),
        info: isChecked('console.info'),
        warn: isChecked('console.warn')
      }; break;
    }

    options[k] = val;
  });

  var me = new whoami(options, function(output) {
    var screenshot = output.screenshot;
    output.screenshot = '[base64]';

    // write payload
    result.style.display = 'block';
    document.getElementById('options').innerHTML = rawCode(JSON.parse(JSON.stringify(options))).replace(/\"([^(\")"]+)\":/g,"$1: ").replace(/,/g, ', ');
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
