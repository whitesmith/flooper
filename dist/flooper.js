(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("flooper", [], factory);
	else if(typeof exports === 'object')
		exports["flooper"] = factory();
	else
		root["flooper"] = factory();
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

	/**!
	 * @preserve
	 *
	 * Flooper.js
	 * @author Tomás Marques <@tomasmcm> <http://tomasmcm.design/>
	 * @author Renato de Leão <@renatodeleao> <http://renatodeleao.com>
	 * @license The MIT License (MIT)
	 */
	'use strict';
	
	var _createClass = __webpack_require__(1)['default'];
	
	var _classCallCheck = __webpack_require__(5)['default'];
	
	var _extends = __webpack_require__(6)['default'];
	
	var _Object$keys = __webpack_require__(21)['default'];
	
	var Flooper = (function () {
	  _createClass(Flooper, null, [{
	    key: 'getDataOptions',
	
	    /*
	     * Get options from data-attribute with JSON like structure
	     * https://gomakethings.com/setting-multiple-javascript-plugin-options-with-a-single-data-attribute/
	     * @function
	     * @static
	     */
	    value: function getDataOptions(options) {
	      return !options || typeof JSON.parse !== 'function' ? {} : JSON.parse(options);
	    }
	  }, {
	    key: 'vendorTransformProp',
	
	    /*
	     * Browser Vendor prop
	     * @function
	     * @static
	     */
	    value: (function () {
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
	    })(),
	    enumerable: true
	  }]);
	
	  /*
	   * Sticky Sidebar Constructor.
	   * @constructor
	   * @param {HTMLElement|String} flooper - The flooper element or flooper selector.
	   * @param {Object} options - The options of flooper.
	   */
	
	  function Flooper(flooper) {
	    var _this = this;
	
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Flooper);
	
	    var OPTS_ATTR = 'data-flooper-options';
	    var DEFAULTS = {
	      /**
	       * Start on instanciate boolean
	       * @type {Boolean}
	       */
	      autoPlay: true,
	      /**
	       * amount of pixels after block as past left side - The callback that handles the response.
	       * @type {Number}
	       */
	      bufferSize: 10,
	      name: 'flooperInstance',
	      /**
	       * Selector for flooper child elements
	       * @type {String}
	       */
	      flooperItemSelector: '.js-flooper-item',
	      /**
	       * amount of pixels container element should move per call.
	       * @type {Number}
	       */
	      speed: 1,
	      /**
	       * Callback after looping/changin order of an item
	       * @type {function}
	       * @return flooped HTMLElement and current order.
	       */
	      onFloop: function onFloop() {}, // noop
	      //
	      onSlowmotion: function onSlowmotion() {},
	      onPause: function onPause() {},
	      onStart: function onStart() {},
	      onPlay: function onPlay() {}
	    };
	
	    // Flooper element query if there's no one, throw error.
	    this.flooper = 'string' === typeof flooper ? document.querySelector(flooper) : flooper;
	    if ('undefined' === typeof this.flooper) {
	      throw new Error("There is no specific flooper element.");
	    }
	
	    // EXTEND OPTIONS
	    this.options = _extends({}, DEFAULTS, Flooper.getDataOptions(this.flooper.getAttribute(OPTS_ATTR)), options);
	
	    this.uid = this.options.name + '-' + Date.now();
	
	    // ELEMENTS AND OPTIONS ALIAS
	    this.flooperContainer = this.flooper.parentElement;
	    this.flooperItems = [].slice.call(this.flooper.querySelectorAll(this.options.flooperItemSelector));
	    this.bufferSize = this.options.bufferSize;
	    this.speed = this.options.speed;
	
	    // CONSTANTS
	    this.left = 0;
	    this.curBlock = 0;
	    this.flooperItemsCount = this.flooperItems.length;
	    this.order = this.flooperItemsCount + 1;
	    this.lastKnownSpeed = this.speed;
	
	    /**
	     * Bindings
	     */
	    // CORE
	    this.init = this.init.bind(this);
	    this.checkBlocks = this.checkBlocks.bind(this);
	    this.update = this.update.bind(this);
	
	    // ANIMATION / INTERACTION
	    this.start = this.start.bind(this); // init rAF
	    //CONTROLS
	    this.play = this.play.bind(this);
	    this.pause = this.pause.bind(this);
	    this.slowMotion = this.slowMotion.bind(this);
	
	    // EVENTS
	    this.addEvents = this.addEvents.bind(this);
	
	    // Flags
	    this.paused = true;
	    this.slowmotion = false;
	    this.initialised = false;
	
	    // Callbacks
	    var callbackNames = ['onFloop', 'onStart', 'onPause', 'onPlay', 'onSlowmotion'];
	    callbackNames.forEach(function (key) {
	      _this[key] = _this.options[key];
	    });
	
	    this.setCallbacks = this.setCallbacks.bind(this);
	
	    if (this.options.autoPlay) this.init();
	  }
	
	  // init
	
	  _createClass(Flooper, [{
	    key: 'init',
	    value: function init() {
	      this.paused = false;
	      this.initialised = true;
	      this.addEvents();
	      this.start();
	      this.onStart();
	    }
	  }, {
	    key: 'setCallbacks',
	    value: function setCallbacks(obj) {
	      var self = this;
	      _Object$keys(obj).map(function (cb) {
	        return self[cb] = obj[cb];
	      });
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
	      var self = this;
	      var block = this.flooperItems[this.curBlock];
	      // cache dimensionsObj
	      var blockRect = block.getBoundingClientRect();
	
	      var blockComputedStyle = window.getComputedStyle(block);
	      // Check if block has margins
	      var blockSpacings = parseInt(blockComputedStyle.marginLeft, 10) + parseInt(blockComputedStyle.marginRight, 10);
	      var blockComputedWidth = blockRect.width + blockSpacings;
	
	      var blockX = typeof blockRect.x === "undefined" ? blockRect.left : blockRect.x;
	
	      if (blockX < -(blockComputedWidth + this.bufferSize - this.flooperContainer.getBoundingClientRect().left)) {
	        block.style.order = this.order;
	        block.style["-ms-flex-order"] = this.order;
	        this.order++;
	        this.left += blockComputedWidth;
	        this.curBlock++;
	
	        if (this.curBlock > this.flooperItemsCount - 1) {
	          this.curBlock = 0;
	        }
	
	        // CALLBACKS
	        this.onFloop(block, self.order);
	      }
	    }
	
	    /* rAF */
	  }, {
	    key: 'update',
	    value: function update() {
	      this.left -= this.speed; //No IE8
	
	      this.checkBlocks();
	      this.flooper.style[Flooper.vendorTransformProp] = 'translateX(' + this.left + 'px)';
	
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
	
	      this.onSlowmotion();
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      requestAnimationFrame(this.update);
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      this.paused = true;
	      this.onPause();
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      if (!this.initialised) {
	        this.init();
	      } else if (this.paused) {
	        this.paused = false;
	        this.start();
	        this.onPlay();
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
	        initialised: this.initialised,
	        paused: this.paused,
	        slowmotion: this.slowmotion,
	        speed: this.speed
	      };
	    }
	  }]);
	
	  return Flooper;
	})();
	
	module.exports = Flooper;

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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$assign = __webpack_require__(7)["default"];
	
	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};
	
	exports.__esModule = true;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	module.exports = __webpack_require__(12).Object.assign;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(10);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(15)});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(4)
	  , toObject = __webpack_require__(16)
	  , IObject  = __webpack_require__(18);
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(20)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(17);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(19);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(22), __esModule: true };

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(23);
	module.exports = __webpack_require__(12).Object.keys;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(16);
	
	__webpack_require__(24)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(12)
	  , fails   = __webpack_require__(20);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ })
/******/ ])
});
;
//# sourceMappingURL=flooper.js.map