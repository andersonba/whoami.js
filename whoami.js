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

	    _classCallCheck(this, whoami);

	    var _options$userContext = options.userContext;
	    var userContext = _options$userContext === undefined ? null : _options$userContext;
	    var _options$filters = options.filters;
	    var filters = _options$filters === undefined ? {} : _options$filters;

	    var defaultFilters = {
	      basic: true,
	      userContext: true,
	      screenshot: true
	    };

	    this.reports = [];
	    this.reportsException = [];
	    this.reportsConsole = [];
	    this.userContext = userContext;
	    this.filters = _extends(defaultFilters, filters);
	    this.enabledFilters = Object.keys(this.filters).filter(function (f) {
	      return _this.filters[f];
	    });

	    // binds
	    this.execute = this.execute.bind(this);
	    this._runCatches = this._runCatches.bind(this);
	    this._bindException = this._bindException.bind(this);
	    this._bindConsole = this._bindConsole.bind(this);

	    // start
	    this._init();
	    this._bindEvent();
	    this._bindShortcut();
	  }

	  _createClass(whoami, [{
	    key: 'execute',
	    value: function execute() {
	      var _this2 = this;

	      this._showLoading();

	      // load html2canvas.js external script
	      _utils2.default.loadScript(_constants2.default.html2canvasUrl, function () {
	        _this2._runCatches(function () {
	          _this2._hideLoading();
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
	    key: '_init',
	    value: function _init() {
	      // save exceptions
	      if ('exception' in this.enabledFilters) {
	        this._bindException();
	      }

	      // save console output
	      if ('console' in this.enabledFilters) {
	        this._bindConsole();
	      }
	    }
	  }, {
	    key: '_runCatches',
	    value: function _runCatches(done) {
	      var _this3 = this;

	      var returned = 0;
	      var enabledFilters = this.enabledFilters;

	      enabledFilters.map(function (f) {
	        var fnName = 'catch' + f.charAt(0).toUpperCase() + f.slice(1);
	        if (_this3[fnName] && typeof _this3[fnName] === 'function') {
	          _this3[fnName](function () {
	            returned++;

	            if (returned === enabledFilters.length) {
	              done();
	            }
	          });
	        }
	      });
	    }
	  }, {
	    key: '_bindException',
	    value: function _bindException() {
	      window.onerror = function (msg, url, line, col, error) {
	        this.reportsException.push({
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

	      ['log', 'error', 'debug', 'info', 'warn'].map(function (name) {
	        _utils2.default.patchFunction(window.console, name, function () {
	          this.reportsConsole.push({
	            time: +new Date(),
	            message: Array.prototype.slice.call(arguments).join(' ')
	          });
	        }.bind(_this4));
	      });
	    }
	  }, {
	    key: '_bindEvent',
	    value: function _bindEvent() {
	      document.addEventListener(_constants2.default.executeEvent, this.execute);
	    }
	  }, {
	    key: '_bindShortcut',
	    value: function _bindShortcut() {
	      document.addEventListener('keydown', function (e) {
	        var isModifier = !!e[_constants2.default.shortcutModifier + 'Key'];
	        var isKey = String.fromCharCode(e.which) === _constants2.default.shortcutKey;

	        if (isModifier && isKey) {
	          document.dispatchEvent(new Event(_constants2.default.executeEvent));
	        }
	      });
	    }
	  }, {
	    key: '_addReport',
	    value: function _addReport(name, value) {
	      this.reports.push({
	        name: name,
	        value: value
	      });
	    }
	  }, {
	    key: 'catchBasic',
	    value: function catchBasic(done) {
	      this._addReport('basic', {
	        title: document.title,
	        url: window.location.href,
	        origin: window.location.origin,
	        userAgent: navigator.userAgent,
	        resolution: screen.width + 'x' + screen.height
	      });
	      done();
	    }
	  }, {
	    key: 'catchUserContext',
	    value: function catchUserContext(done) {
	      if (this.userContext) {
	        this._addReport('userContext', this.userContext);
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
	      this._addReport('exception', this.reportsException);
	      done();
	    }
	  }, {
	    key: 'catchConsole',
	    value: function catchConsole(done) {
	      this._addReport('console', this.reportsConsole);
	      done();
	    }
	  }, {
	    key: 'catchScreenshot',
	    value: function catchScreenshot(done) {
	      var _this5 = this;

	      window.html2canvas(document.body, {
	        onrendered: function onrendered(canvas) {
	          _this5._addReport('screenshot', canvas.toDataURL());
	          done();
	        }
	      });
	    }
	  }]);

	  return whoami;
	}();

	module.exports = whoami;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {

	  html2canvasUrl: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',

	  executeEvent: 'whoami.execute',

	  shortcutModifier: 'ctrl',
	  shortcutKey: '0'

	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
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
	    // create script tag
	    var s = document.createElement('script');
	    s.type = 'text/javascript';
	    s.async = true;
	    s.src = src;
	    s.addEventListener('load', done, false);

	    // append to head
	    var h = document.getElementsByTagName('head')[0];
	    h.appendChild(s);
	  }
	};

/***/ }
/******/ ]);