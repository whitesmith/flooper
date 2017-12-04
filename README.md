# Flooper
Uses flex order attribute to loop a list of items instead of duplication or expensive multiItem position calculations. See it in action at [project page](http://whitesmith.github.io/flooper/)

## Usage & Options

#### HTML

```HTML
<div class="c-my-flooper js-flooper">
  ...
  <div class="c-my-flooper__el js-flooper-item"></div>
  ...
</div>
```

#### CSS
Don't be a bad boy and put js-hooks classes in your CSS files please.
Required CSS for the plugin to work:

```SCSS

.c-my-flooper{
  position: !static; // anything but static
  display: flex; 
  flex-wrap: nowrap;
  white-space: nowrap;
}

.c-my-flopoper__el{
  //go wild;
}
```
#### Javascript
```javascript
var instance = new Flooper();
instance.init();
// enjoy
```

#### Options & defaults
```javascript
/**
 * @param {string} [flooper='.js-flooper']  - flooper classname hook
 * @param {string} [flooperItem='.js-flooper-item'] - each item classname hook
 * @param {number} [bufferSize=10] - amount of pixels after block as past left side
 * @param {number} [speed=1] - amount of pixels container element should move per call.
 * @param {function} onFloop - described next section
 * @param {function} onStart - described next section
 * @param {function} onPause - described next section
 * @param {function} onPlay - described next section
 * @param {function} onSlowmotion - described next section
 */

// defaults
var instance = new Flooper({
  flooper: '.js-flooper', // string class selector
  flooperItem: '.js-flooper-item', // string class selector
  bufferSize: 10,
  speed: 1,
  onFloop: () => {}, //noop
  onStart: () => {}, //noop
  onPlay: () => {}, //noop
  onPause: () => {}, //noop
  onSlowmotion: () => {}, //noop
});
``` 

#### Methods & Callbacks
After instanciate and init, these are the current methods available.

```javascript
// define
const myFlooper = new Flooper();
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

