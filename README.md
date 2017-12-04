# Flooper
Uses flex order attribute to loop a list of items instead of duplication or expensive multiItem position calculations. See it in action at [project page](http://whitesmith.github.io/flooper/)

## Usage & Options

#### Install
Old school include (exposes `flooper` global):

```HTML
<script src="https://unpkg.com/flooper"></script>
```
Savage developers:
```zsh

npm install --save flooper
```

Then import it:
```javascript
import 'flooper' from 'flooper'; // or...
const flooper = require('flooper');
```

#### HTML & CSS
Don't be a bad boy and put js-hooks classes in your CSS files please.
This is the required and minimal HTML and CSS for the plugin to work.  

<small>Note: your classNames and jsHooks can be different</small>

```HTML
<!-- required hooks -->
<div class="c-my-flooper js-flooper">
  ...
  <div class="c-my-flooper__el js-flooper-item"></div>
  ...
</div>

```
```SCSS
//[1] required
.c-my-flooper{
  position: relative; // [1] anything but static
  display: flex; // [1]
  flex-wrap: nowrap; // [1]
  white-space: nowrap; // [1]
}

.c-my-flooper__el{
  //go wild;
}
```
#### Javascript
```javascript
/**
 * @function flooper
 *
 * @param {String|HTMLElement} flooperElement - flooper container, defaults to '.js-flooper'
 * @param {Object} [options] - containing the props described here at #options-and-defaults
 */

let myFlooper = new flooper('.js-flooper'); // you can ommit paramenter if used 'js-flooper' in HTML 
myFlooper.init();
// enjoy
```


#### Options and defaults
```javascript
/**
 * @param {Object} options
 *
 * @param {bool}   [options.autoPlay=true] - flooper starts playing at initialisation
 * @param {string} [options.flooperItemSelector = '.js-flooper-item'] - Flooper children loopable items
 * @param {number} [options.bufferSize = 10] - amount of pixels after block as past left side
 * @param {number} [options.speed = 1] - amount of pixels container element should move per call.
 * @param {String} [options.name] = 'flooperInstance' - Prefix to build unique id
 *
 * @callback onFloop - When an element of a flooper is looped
 * @param {HTMLElment} flooperItem 
 * @param {Number} CurrentIndex 
 *
 * @callback onStart - described next section
 * @callback onPause - described next section
 * @callback onPlay - described next section
 * @callback onSlowmotion - described next section
 */

// defaults
let instance = new Flooper('.js-flooper', {
  autoPlay: true, // 
  flooperItemSelector: '.js-flooper-item', // string class selector
  bufferSize: 10,
  name: `flooperInstance`, 
  speed: 1,
  onFloop: () => {}, //noop
  onStart: () => {}, //noop
  onPlay: () => {}, //noop
  onPause: () => {}, //noop
  onSlowmotion: () => {}, //noop
});
``` 

##### Usage via data-attributes
You can specifiy options via `data-flooper-options` attribute and using valid JSON notation
```HTML
<!-- back ticks used to allow \n in preprocessors -->
<div class="c-my-flooper js-flooper-with-data-options"  data-flooper-options=`{
    "autoplay": false,
    "speed": 2,
  }`>
  ...
  <div class="c-my-flooper__el js-flooper-item"></div>
  ...
</div>
```
```javascript
const myFlooper = new flooper('js-flooper-with-data-options');
myFlooper.init(); 
// this flooper will have speed: 2 and will not autoPlay
```


#### Methods & Callbacks
After instanciate and init, these are the current methods available.

```javascript
// define
const myFlooper = new flooper();
myFlooper.init();

```

| Method                   | Description                           
| -------------------------| ------------------                    
| `myFlooper.pause()`      | Pauses the flooper looping animation             
| `myFlooper.play()`       | Resumes animation if paused                    
| `myFlooper.slowMotion()` | Toggles slowmo mode. Reduces speed to half. Currently default behaviour on mouseHover, but soon to be optional  
| `myFlooper.setCallbacks(obj)` | Used this to pass an object with desired callbacks after instanciation. Ex: `myFlooper.setCallbacks({onFloop: function(el, i){console.log(el)}})`

| callback                 | Description                           
| -------------------------| ------------------                    
| `myFlooper.onFloop(el, order)` | Each time an element order is changed, returns flooped el and its current order 
| `myFlooper.onStart()`     | when initialised           
| `myFlooper.onPlay()`     | Self describing 
| `myFlooper.onPause()` | Self describing 
| `myFlooper.onSlowmotion()` | Self describing  


<br>

#### Multiple floopers on the same page
```HTML

<!-- 1-->
<div data-flooper data-flooper-options=`{
  "flooperItemSelector": "[data-flooper-item]", 
  "name": "first"
}`>
  <div data-flooper-item>1</div>
  ...
</div>


<!-- 2 -->
<div data-flooper data-flooper-options=`{
  "flooperItemSelector": "[data-flooper-item]", 
  "name": "second"
}`>
  <div data-flooper-item>1</div>
  ...
</div>

<!-- 3 -->
<div data-flooper data-flooper-options=`{
  "flooperItemSelector": "[data-flooper-item]", 
  "name": "third"
}`>
  <div data-flooper-item>1</div>
  ...
</div>
```
```javascript
(function(){
  var $floopers = document.querySelectorAll('[data-flooper]');

  $floopers.forEach(function(floop, i){
    flooperInstances[i] = new flooper(floop);
  });
})();
```

##### If you need access to a specific istance
```javascript

(function initAllThaFloopers(){
  // save a global reference
  window.flooperInstances = [];
  var $floopers = document.querySelectorAll('[data-flooper]');

  $floopers.forEach(function(floop, i){
    flooperInstances[i] = new flooper(floop);
  });
})();  

...
// later that day somewhere else
var secondFlooper = flooperInstances.find(inst => inst.uid.startsWith('second') === true); // or...
var secondFlooper = flooperInstances.find(inst => inst.options.name('second') === true);

secondFlooper.pause();
```

## Developing
* Clone the repo
* `npm install`
* `npm start` or `gulp`

#### Production env <br> 
To start a production like environment pass `--env production` flag.  
Ex:`npm start --env production`


#### Deploy site to gh-pages <br>
* `npm run deploy:site`
This will build a production ready optimized site and deploy it to `gh-pages` branch.

## Contributing
See [our guidelines](CONTRIBUTING.md)

## Authors & Credits <br>
Tomás Marques <tomasmcm@whitesmith.co> (http://tomasmcm.design/) <br>
Renato de Leão <renatodeleao@whitesmith.co> (http://renatodeleao.com/)<br>

##### Original Concept
- [Codepen](https://codepen.io/tomasmcm/pen/eeJpNb) by [@tomasmcm](http://tomasmcm.design/)

##### Demo Images source:
- https://www.pexels.com/photo/abbey-beatles-cc0-crossing-395714/
- https://www.flickr.com/photos/oddsock/167157641

##### Demo Animations powered by the awesome libs
- [Anime.js](http://animejs.com/) by [Julian Garnier](julianarnier.com)
- [Scrollama](https://github.com/russellgoldenberg/scrollama/) by Russell Goldenberg


## License
[The MIT License](LICENSE.md)

