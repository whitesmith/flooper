'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Flooper = function () {
  function Flooper() {
    var flooper = arguments.length <= 0 || arguments[0] === undefined ? '.js-flooper' : arguments[0];
    var flooperItem = arguments.length <= 1 || arguments[1] === undefined ? '.js-flooper-item' : arguments[1];
    var bufferSize = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
    var speed = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

    _classCallCheck(this, Flooper);

    this.transformProp = function () {
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
    }();

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

  // Helper

  Flooper.prototype.init = function init() {
    requestAnimationFrame(this.step);
  };

  Flooper.prototype.step = function step(timeStamp) {
    this.left -= this.speed;
    this.checkBlocks();

    this.flooper.style[this.transformProp] = 'translateX(' + this.left + 'px)';

    requestAnimationFrame(this.step);
  };

  Flooper.prototype.checkBlocks = function checkBlocks() {
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
  };

  return Flooper;
}();

// instanciate and initizialize

var i = new Flooper();
i.init();
