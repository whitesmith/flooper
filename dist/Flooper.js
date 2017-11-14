(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Flooper"] = factory();
	else
		root["Flooper"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
	* Version: 'v0.0.3'
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
	    this.lastKnownSpeed = this.speed;
	
	    /**
	     * Bindings
	     */
	    // CORE
	    this.init = this.init.bind(this);
	    this.checkBlocks = this.checkBlocks.bind(this);
	    this.update = this.update.bind(this);
	
	    // ANIMATION / INTERACTION
	    this.play = this.play.bind(this);
	    this.pause = this.pause.bind(this);
	    this.resume = this.resume.bind(this);
	    this.slowMotion = this.slowMotion.bind(this);
	
	    // EVENTS
	    this.addEvents = this.addEvents.bind(this);
	
	    // Flags
	    this.paused = false;
	    this.slowmotion = false;
	  }
	
	  // init
	
	  _createClass(Flooper, [{
	    key: 'init',
	    value: function init() {
	      this.addEvents();
	      this.play();
	    }
	
	    /**
	     * --------------------
	     * CORE
	     * --------------------
	     */
	    // THE MAGIC
	  }, {
	    key: 'checkBlocks',
	    value: function checkBlocks() {
	      // cache block
	      var block = this.flooperItem[this.curBlock];
	      // cache dimensionsObj
	      var blockRect = block.getBoundingClientRect();
	      var blockComputedStyle = window.getComputedStyle(block);
	      // Check if block has margins
	      var blockSpacings = parseInt(blockComputedStyle.marginLeft, 10) + parseInt(blockComputedStyle.marginRight, 10);
	      var blockComputedWidth = blockRect.width + blockSpacings;
	
	      if (blockRect.x < -(blockComputedWidth + this.bufferSize)) {
	        block.style.order = this.order;
	        this.order++;
	        this.left += blockComputedWidth;
	        this.curBlock++;
	
	        if (this.curBlock > this.flooperItemCount - 1) {
	          this.curBlock = 0;
	        }
	      }
	    }
	
	    /* rAF */
	  }, {
	    key: 'update',
	    value: function update() {
	      this.left -= this.speed; //No IE8
	
	      this.checkBlocks();
	      this.flooper.style[this.transformProp] = 'translateX(' + this.left + 'px)';
	
	      if (!this.paused) requestAnimationFrame(this.update);
	    }
	
	    /**
	     * --------------------
	     * ANIMATION
	     * --------------------
	     */
	  }, {
	    key: 'slowMotion',
	    value: function slowMotion() {
	      this.slowmotion = !this.slowmotion; // toggle if on goes of, if off goes on
	
	      if (this.slowmotion) {
	        this.speed = this.speed / 2;
	      } else {
	        this.speed = this.lastKnownSpeed;
	      }
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      requestAnimationFrame(this.update);
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      this.paused = true;
	    }
	  }, {
	    key: 'resume',
	    value: function resume() {
	      if (this.paused) {
	        this.paused = false;
	        this.play();
	      }
	    }
	  }, {
	    key: 'addEvents',
	    value: function addEvents() {
	      this.flooper.addEventListener('mouseenter', this.slowMotion, false);
	      this.flooper.addEventListener('mouseleave', this.slowMotion, false);
	    }
	  }, {
	    key: 'getState',
	    value: function getState() {
	      return {
	        paused: this.paused,
	        slowmotion: this.slowmotion
	      };
	    }
	  }]);
	
	  return Flooper;
	})();
	
	module.exports = Flooper;
	
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
/******/ ])
});
;
//# sourceMappingURL=Flooper.js.map