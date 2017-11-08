/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	* Name: Flooper.js
	* Version: 'v0.0.1'
	* Author: Tomás Marques | https://github.com/@tomasmcm | @tomasmcm
	*
	* Description: Flex order looper. Uses flex order attribute to loop a list of items instead of duplication or expensive multiItem position caclulations.
	* Original: https://codepen.io/tomasmcm/pen/eeJpNb
	* Adpatation: https://github.com/@renatodeleao
	*
	*
	* @param {string} [flooper='.js-flooper']  - flooper classname hook
	* @param {string} [flooper='.js-flooper-item'] - each item classname hook
	* @param {number} [bufferSize=10] - amount of pixels after block as past left side - The callback that handles the response.
	* @param {number} [speed=1] - amount of pixels container element should move per call.
	*
	*/
	'use strict';
	
	var _createClass = __webpack_require__(1)['default'];
	
	var _classCallCheck = __webpack_require__(5)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var Flooper = (function () {
	  function Flooper() {
	    var flooper = arguments.length <= 0 || arguments[0] === undefined ? '.js-flooper' : arguments[0];
	    var flooperItem = arguments.length <= 1 || arguments[1] === undefined ? '.js-flooper-item' : arguments[1];
	    var bufferSize = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
	    var speed = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
	
	    _classCallCheck(this, Flooper);
	
	    this.transformProp = (function () {
	      var testEl = document.createElement('div');
	      if (testEl.style.transform == null) {
	        var vendors = ['Webkit', 'Moz', 'ms'];
	        for (var vendor in vendors) {
	          if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
	            return vendors[vendor] + 'Transform';
	          }
	        }
	      }
	      return 'transform';
	    })();
	
	    this.left = 0;
	    this.bufferSize = bufferSize;
	    this.flooper = document.querySelector(flooper);
	    this.flooperItem = document.querySelectorAll(flooperItem);
	    this.flooperItemCount = this.flooperItem.length;
	    this.curBlock = 0;
	    this.order = this.flooperItemCount + 1;
	    this.speed = speed;
	
	    // Bindings
	    this.step = this.step.bind(this);
	    this.checkBlocks = this.checkBlocks.bind(this);
	  }
	
	  // init
	
	  _createClass(Flooper, [{
	    key: 'init',
	    value: function init() {
	      requestAnimationFrame(this.step);
	    }
	  }, {
	    key: 'step',
	    value: function step(timeStamp) {
	      this.left -= this.speed;
	      this.checkBlocks();
	
	      this.flooper.style[this.transformProp] = 'translateX(' + this.left + 'px)';
	
	      requestAnimationFrame(this.step);
	    }
	  }, {
	    key: 'checkBlocks',
	    value: function checkBlocks() {
	      // cache block
	      var block = this.flooperItem[this.curBlock];
	      // cache dimensionsObj
	      var blockSize = block.getBoundingClientRect();
	
	      if (blockSize.x < -(blockSize.width + this.bufferSize)) {
	        block.style.order = this.order;
	        this.order++;
	        this.left += blockSize.width;
	        this.curBlock++;
	
	        if (this.curBlock > this.flooperItemCount - 1) {
	          this.curBlock = 0;
	        }
	      }
	    }
	  }]);
	
	  return Flooper;
	})();
	
	exports['default'] = Flooper;
	
	module.exports = Flooper;
	window.Flooper = Flooper; // TODO REMOVE ME, check why is not exporting as module
	module.exports = exports['default'];

	// Helper

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(2)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ })
/******/ ]);
//# sourceMappingURL=Flooper.js.map