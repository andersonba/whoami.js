var whoami =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	var _utils = __webpack_require__(2);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var whoami = function () {
	  function whoami() {
	    var _this = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var callback = arguments[1];

	    _classCallCheck(this, whoami);

	    if (typeof options === 'function') {
	      callback = options;
	      options = {};
	    }

	    var _options = options;
	    var _options$api = _options.api;
	    var api = _options$api === undefined ? null : _options$api;
	    var _options$customData = _options.customData;
	    var customData = _options$customData === undefined ? null : _options$customData;
	    var _options$filters = _options.filters;
	    var filters = _options$filters === undefined ? {} : _options$filters;
	    var _options$clipboard = _options.clipboard;
	    var clipboard = _options$clipboard === undefined ? false : _options$clipboard;
	    var _options$shortcut = _options.shortcut;
	    var shortcut = _options$shortcut === undefined ? true : _options$shortcut;

	    var defaultFilters = {
	      basic: true,
	      customData: true,
	      screenshot: true,
	      tasks: false
	    };

	    var defaultConsoleFilter = {
	      log: true,
	      error: true,
	      debug: true,
	      info: true,
	      warn: true
	    };

	    this.loggers = {
	      exception: [],
	      console: []
	    };
	    this.output = {};
	    this.api = api;
	    this.clipboard = !!clipboard;
	    this.customData = customData;
	    this.shortcut = shortcut;
	    this.callback = callback;

	    // configuring filters
	    this.filters = _extends(defaultFilters, filters);
	    this.enabledFilters = Object.keys(this.filters).filter(function (f) {
	      return _this.filters[f];
	    });
	    var consoleFilter = this.filters.console;
	    if (consoleFilter !== false) {
	      consoleFilter = (typeof consoleFilter === 'undefined' ? 'undefined' : _typeof(consoleFilter)) === 'object' ? consoleFilter : {};
	      this.filters.console = _extends(defaultConsoleFilter, consoleFilter);
	    }

	    // binds
	    this.execute = this.execute.bind(this);
	    this._runCatches = this._runCatches.bind(this);
	    this._bindException = this._bindException.bind(this);
	    this._bindConsole = this._bindConsole.bind(this);

	    // start
	    this._init();
	  }

	  _createClass(whoami, [{
	    key: '_init',
	    value: function _init() {
	      // bind shortcut
	      if (this.shortcut) {
	        this._bindShortcut();
	      }

	      // save exceptions
	      if (this.enabledFilters.indexOf('exception') >= 0) {
	        this._bindException();
	      }

	      // save console output
	      if (this.enabledFilters.indexOf('console') >= 0) {
	        this._bindConsole();
	      }
	    }
	  }, {
	    key: 'execute',
	    value: function execute() {
	      var _this2 = this;

	      this.output = {};
	      this._showLoading();

	      // load html2canvas.js external script
	      _utils2.default.loadScript(_constants2.default.html2canvasUrl, function () {
	        _this2._runCatches(function () {

	          var ajaxOrIgnore = function ajaxOrIgnore(done) {
	            if (_this2.api) {
	              return _this2._sendAjax(done);
	            }
	            done();
	          };

	          // send ajax or callback
	          ajaxOrIgnore(function () {

	            // copy to clipboard
	            if (_this2.clipboard) {
	              _this2._copyClipboard();
	            }

	            // pass to callback
	            if (_this2.callback) {
	              _this2.callback(_this2.output);
	            }

	            _this2._hideLoading();
	          });
	        });
	      });
	    }
	  }, {
	    key: '_showLoading',
	    value: function _showLoading() {
	      console.log('Loading: start');
	    }
	  }, {
	    key: '_hideLoading',
	    value: function _hideLoading() {
	      console.log('Loading: done');
	    }
	  }, {
	    key: '_copyClipboard',
	    value: function _copyClipboard() {
	      prompt(_constants2.default.clipboardMessage, JSON.stringify(this.output));
	    }
	  }, {
	    key: '_sendAjax',
	    value: function _sendAjax(done) {
	      var data = JSON.stringify(this.output);
	      _utils2.default.postRequest(this.api, data, function (err, code) {
	        if (err) {
	          alert(_constants2.default.submitErrorMessage);
	        } else {
	          alert(code ? _constants2.default.sentSuccessCodeMessage + ' "' + code + '".' : _constants2.default.sentSuccessMessage);
	        }
	        done();
	      });
	    }
	  }, {
	    key: '_runCatches',
	    value: function _runCatches(done) {
	      var _this3 = this;

	      var finished = 0;
	      var enabled = this.enabledFilters;

	      enabled.map(function (f) {
	        var fnName = 'catch' + f.charAt(0).toUpperCase() + f.slice(1);
	        if (_this3[fnName] && typeof _this3[fnName] === 'function') {
	          _this3[fnName](function () {
	            finished++;
	            if (enabled.length === finished) {
	              done();
	            }
	          });
	        }
	      });
	    }
	  }, {
	    key: '_bindException',
	    value: function _bindException() {
	      window.onerror = function (msg, url, line, col) {
	        this.loggers.exception.push({
	          time: +new Date(),
	          message: msg,
	          url: url,
	          line: line,
	          col: col
	        });
	      }.bind(this);
	    }
	  }, {
	    key: '_bindConsole',
	    value: function _bindConsole() {
	      var _this4 = this;

	      var enabledFns = Object.keys(this.filters.console).filter(function (f) {
	        return _this4.filters.console[f];
	      });

	      enabledFns.map(function (name) {
	        _utils2.default.patchFunction(window.console, name, function () {
	          this.loggers.console.push({
	            time: +new Date(),
	            message: Array.prototype.slice.call(arguments).join(' ')
	          });
	        }.bind(_this4));
	      });
	    }
	  }, {
	    key: '_bindShortcut',
	    value: function _bindShortcut() {
	      var _this5 = this;

	      document.addEventListener('keydown', function (e) {
	        var isModifier = !!e[_constants2.default.shortcutModifier + 'Key'];
	        var isKey = String.fromCharCode(e.which) === _constants2.default.shortcutKey;

	        if (isModifier && isKey) {
	          _this5.execute();
	        }
	      });
	    }
	  }, {
	    key: '_addReport',
	    value: function _addReport(name, value) {
	      var existent = this.output[name];
	      if (existent) {
	        existent = _utils2.default.isArray(existent) ? existent : [existent];
	        existent.push(value);
	      }
	      this.output[name] = existent || value;
	    }
	  }, {
	    key: 'catchBasic',
	    value: function catchBasic(done) {
	      this._addReport('basic', {
	        title: document.title,
	        url: window.location.href,
	        origin: window.location.origin,
	        userAgent: navigator.userAgent,
	        resolution: screen.width + 'x' + screen.height,
	        time: +new Date()
	      });
	      done();
	    }
	  }, {
	    key: 'catchCustomData',
	    value: function catchCustomData(done) {
	      if (this.customData) {
	        this._addReport('customData', this.customData);
	      }
	      done();
	    }
	  }, {
	    key: 'catchCookie',
	    value: function catchCookie(done) {
	      this._addReport('cookie', _utils2.default.getCookies());
	      done();
	    }
	  }, {
	    key: 'catchLocalStorage',
	    value: function catchLocalStorage(done) {
	      this._addReport('localStorage', _extends({}, localStorage));
	      done();
	    }
	  }, {
	    key: 'catchException',
	    value: function catchException(done) {
	      this._addReport('exception', this.loggers.exception);
	      done();
	    }
	  }, {
	    key: 'catchConsole',
	    value: function catchConsole(done) {
	      this._addReport('console', this.loggers.console);
	      done();
	    }
	  }, {
	    key: 'catchScreenshot',
	    value: function catchScreenshot(done) {
	      var _this6 = this;

	      window.html2canvas(document.body, {
	        onrendered: function onrendered(canvas) {
	          _this6._addReport('screenshot', canvas.toDataURL());
	          done();
	        }
	      });
	    }
	  }, {
	    key: 'catchDescription',
	    value: function catchDescription(done) {
	      var result = prompt(_constants2.default.descriptionDialogMessage);
	      this._addReport('description', result);
	      done();
	    }
	  }, {
	    key: 'catchTasks',
	    value: function catchTasks(done) {
	      var self = this;
	      var tasks = this.filters.tasks || {};
	      var finished = 0;
	      var output = {};

	      function checkFinalize() {
	        if (finished >= Object.keys(tasks).length) {
	          self._addReport('tasks', output);
	          done();
	        }
	      }

	      var _loop = function _loop(k) {
	        // async
	        val = tasks[k](function (v) {
	          output[k] = v;
	          finished++;
	          checkFinalize();
	        });

	        // sync

	        if (val) {
	          output[k] = val;
	          finished++;
	          checkFinalize();
	        }
	      };

	      for (var k in tasks) {
	        var val;

	        _loop(k);
	      }
	    }
	  }]);

	  return whoami;
	}();

	window.__whoami = {
	  loadedScripts: []
	};

	module.exports = whoami;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {

	  clipboardMessage: 'Copy this text using Ctrl+C and send for us. Thanks!',
	  sentSuccessMessage: 'We will contact you, soon. Thanks!',
	  sentSuccessCodeMessage: 'Thanks! Your ticket code is',
	  submitErrorMessage: 'Ops... Failed to submit data, try again or contact us.',
	  descriptionDialogMessage: 'Please describe the issue you are experiencing (optional)',

	  shortcutModifier: 'ctrl',
	  shortcutKey: '0',

	  html2canvasUrl: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'

	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  isArray: function isArray(arr) {
	    return Object.prototype.toString.call(arr) === '[object Array]';
	  },
	  postRequest: function postRequest(url, data, done) {
	    var xhr = new window.XMLHttpRequest() ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	    data = JSON.stringify(data);

	    xhr.open('POST', encodeURI(url), true);
	    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

	    xhr.onload = function () {
	      if (xhr.readyState === 4 && xhr.status === 200) {
	        var code = undefined;
	        try {
	          code = (JSON.parse(xhr.responseText) || {}).code;
	        } catch (err) {}
	        return done(null, code);
	      }
	      done(new Error(xhr.statusText));
	    };
	    xhr.send(data);
	  },
	  getCookies: function getCookies() {
	    var cookies = {};
	    var pairs = document.cookie.split(';');
	    for (var i = 0, len = pairs.length; i < len; i++) {
	      var pair = pairs[i].trim().split('=');
	      cookies[pair[0]] = unescape(pair[1]);
	    }
	    return cookies;
	  },
	  patchFunction: function patchFunction(obj, name, fn) {
	    if (!obj[name] || typeof obj[name] !== 'function') {
	      return;
	    }

	    var oldFn = obj[name];
	    obj[name] = function () {
	      oldFn.apply(obj, arguments);
	      fn.apply(obj, arguments);
	    };

	    return obj;
	  },
	  loadScript: function loadScript(src, done) {
	    // prevent reload
	    if (window.__whoami.loadedScripts.indexOf(src) >= 0) {
	      return done();
	    }

	    // create script tag
	    var s = document.createElement('script');
	    s.type = 'text/javascript';
	    s.async = true;
	    s.src = src;
	    s.addEventListener('load', done, false);

	    // append to head
	    var h = document.getElementsByTagName('head')[0];
	    h.appendChild(s);

	    window.__whoami.loadedScripts.push(src);
	  }
	};

/***/ }
/******/ ]);