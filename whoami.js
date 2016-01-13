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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var whoami = function () {
	  function whoami() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, whoami);

	    _objectDestructuringEmpty(options);

	    // storage

	    this.reports = [];

	    this._bindEvent();
	    this._bindShortcut();
	  }

	  _createClass(whoami, [{
	    key: 'execute',
	    value: function execute() {
	      alert('Capturing...');
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
	    value: function catchBasic() {
	      this._addReport('basic', {
	        title: document.title,
	        url: window.location.href,
	        origin: window.location.origin,
	        userAgent: navigator.userAgent,
	        resolution: screen.width + 'x' + screen.height
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

	  executeEvent: 'whoami.execute',

	  shortcutModifier: 'ctrl',
	  shortcutKey: '0'

	};

/***/ }
/******/ ]);