/**!
 * Flooper.js
 * @author Tomás Marques <@tomasmcm> <http://tomasmcm.design/>
 * @author Renato de Leão <@renatodeleao> <http://renatodeleao.com>
 * @license The MIT License (MIT)
 */
class Flooper{
  /*
   * Browser Vendor prop
   * @function
   * @static
   */
  static vendorTransformProp = (function(){
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


  /*
   * Get options from data-attribute with JSON like structure
   * https://gomakethings.com/setting-multiple-javascript-plugin-options-with-a-single-data-attribute/
   * @function
   * @static
   */
  static getDataOptions(options) {
    return (!options || typeof JSON.parse !== 'function') ? {} : JSON.parse(options);
  };


  /*
   * Sticky Sidebar Constructor.
   * @constructor
   * @param {HTMLElement|String} flooper - The flooper element or flooper selector.
   * @param {Object} options - The options of flooper.
   */
  constructor(flooper, options = {}) {
    const OPTS_ATTR = 'data-flooper-options';
    const DEFAULTS = {
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
      name: `flooperInstance`,
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
      onFloop: ()=> {}, // noop
      //
      onSlowmotion: () => {},
      onPause: () => {},
      onStart: () => {},
      onPlay: () =>{}
    }

    // Flooper element query if there's no one, throw error.
    this.flooper = ('string' === typeof flooper ) ? document.querySelector(flooper) : flooper;
    if( 'undefined' === typeof this.flooper ) {
      throw new Error("There is no specific flooper element.");
    }

    // EXTEND OPTIONS
    this.options = {...DEFAULTS, ...Flooper.getDataOptions(this.flooper.getAttribute(OPTS_ATTR)), ...options };

    this.uid = `${this.options.name}-${Date.now()}`;

    // ELEMENTS AND OPTIONS ALIAS
    this.flooperContainer = this.flooper.parentElement;
    this.flooperItems = [].slice.call(this.flooper.querySelectorAll(this.options.flooperItemSelector));
    this.bufferSize = this.options.bufferSize ;
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
    let callbackNames = ['onFloop', 'onStart', 'onPause', 'onPlay', 'onSlowmotion'];
    callbackNames.forEach(key => {
      this[key] = this.options[key]
    });

    this.setCallbacks = this.setCallbacks.bind(this);

    if(this.options.autoPlay) this.init()
  }

  // init
  init(){
    this.paused = false;
    this.initialised = true;
    this.addEvents();
    this.start();
    this.onStart();
  }


  setCallbacks(obj){
    var self = this;
    Object.keys(obj).map(cb => self[cb] = obj[cb] );
  }

  /**
   * --------------------
   * CORE
   * --------------------
   */
  // THE MAGIC
  checkBlocks(){
    // cache block
    var self = this;
    let block = this.flooperItems[this.curBlock];
    // cache dimensionsObj
    let blockRect = block.getBoundingClientRect();

    let blockComputedStyle = window.getComputedStyle(block);
    // Check if block has margins
    let blockSpacings = parseInt(blockComputedStyle.marginLeft, 10) + parseInt(blockComputedStyle.marginRight, 10);
    let blockComputedWidth = blockRect.width + blockSpacings;

    let blockX = (typeof blockRect.x === "undefined") ? blockRect.left : blockRect.x;

    if(blockX < -(blockComputedWidth + this.bufferSize - this.flooperContainer.getBoundingClientRect().left ) ) {
      block.style.order=this.order;
      block.style["-ms-flex-order"]=this.order;
      this.order ++;
      this.left+=blockComputedWidth;
      this.curBlock++;

      if(this.curBlock > this.flooperItemsCount - 1){
        this.curBlock = 0;
      }

      // CALLBACKS
      this.onFloop(block, self.order);
    }
  }

  /* rAF */
  update() {
    this.left -= this.speed; //No IE8

    this.checkBlocks();
    this.flooper.style[Flooper.vendorTransformProp] = `translateX(${this.left}px)`;

    if(!this.paused) requestAnimationFrame(this.update);
  }

  /**
   * --------------------
   * ANIMATION
   * --------------------
   */
  slowMotion(){
    this.slowmotion = !this.slowmotion; // toggle if on goes of, if off goes on

    if (this.slowmotion){
      this.speed = this.speed/2;
    } else {
      this.speed = this.lastKnownSpeed;
    }

    this.onSlowmotion();
  }

  start(){
    requestAnimationFrame(this.update);
  }

  pause(){
    this.paused = true;
    this.onPause();
  }

  play(){
    if(!this.initialised){
      this.init();
    } else if(this.paused) {
      this.paused = false;
      this.start();
      this.onPlay();
    }
  }

  addEvents(){
    this.flooper.addEventListener('mouseenter', this.slowMotion, false);
    this.flooper.addEventListener('mouseleave', this.slowMotion, false);
  }

  getState(){
    return {
      initialised: this.initialised,
      paused: this.paused,
      slowmotion: this.slowmotion,
      speed: this.speed
    }
  }
}

module.exports = Flooper;
