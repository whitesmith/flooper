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
class Flooper{
  // Helper
  transformProp = (function(){
    var testEl = document.createElement('div');
    if(testEl.style.transform == null) {
      var vendors = ['Webkit', 'Moz', 'ms'];
      for(var vendor in vendors) {
        if(testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
          return vendors[vendor] + 'Transform';
        }
      }
    }
    return 'transform';
  })();

  constructor(
    flooper = '.js-flooper',
    flooperItem = '.js-flooper-item',
    bufferSize = 10,
    speed = 1
  ) {
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
    this.slowMotionOn = this.slowMotionOn.bind(this);
    this.slowMotionOff = this.slowMotionOff.bind(this);

    // EVENTS
    this.addEvents = this.addEvents.bind(this);
  }

    // init
    init(){
      this.addEvents();
      this.play()
    }

  /**
   * --------------------
   * CORE
   * --------------------
   */
  // THE MAGIC
  checkBlocks(){
    // cache block
    let block = this.flooperItem[this.curBlock];
    // cache dimensionsObj
    let blockRect = block.getBoundingClientRect();
    let blockComputedStyle = window.getComputedStyle(block);
    // Check if block has margins
    let blockSpacings = parseInt(blockComputedStyle.marginLeft, 10) + parseInt(blockComputedStyle.marginRight, 10);
    let blockComputedWidth = blockRect.width + blockSpacings;

    if(blockRect.x < -(blockComputedWidth + this.bufferSize) ) {
      block.style.order=this.order;
      this.order ++;
      this.left+=blockComputedWidth;
      this.curBlock++;

      if(this.curBlock > this.flooperItemCount - 1){
        this.curBlock = 0;
      }
    }
  }


  /* rAF */
  update() {
    this.left -= this.speed; //No IE8

    this.checkBlocks();
    this.flooper.style[this.transformProp] = `translateX(${this.left}px)`;

    if(!this.paused) requestAnimationFrame(this.update);
  }

  /**
   * --------------------
   * ANIMATION
   * --------------------
   */
  slowMotionOn(){
    this.speed = this.speed/2;
  }
  slowMotionOff(){
    this.speed = this.lastKnownSpeed;
  }

  play(){
    requestAnimationFrame(this.update);
  }

  pause(){
    this.paused = true;
  }

  resume(){
    if(this.paused){
      this.paused = false;
      this.play();
    }
  }

  addEvents(){
    this.flooper.addEventListener('mouseenter', this.slowMotionOn, false);
    this.flooper.addEventListener('mouseleave', this.slowMotionOff, false);
  }
}

module.exports = Flooper;
window.Flooper = Flooper; // TODO REMOVE ME, check why is not exporting as module
