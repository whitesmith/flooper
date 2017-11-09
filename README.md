# Flooper.js
Uses flex order attribute to loop a list of items instead of duplication or expensive multiItem position calculations.

## Demo
http://whitesmith.github.io/Flooper.js/

## Original<br>
https://codepen.io/tomasmcm/pen/eeJpNb<br>

## Dev Setup
* Clone the repo
* `npm install`
* `gulp`

## Production Build 
`npm run build:prodcution`


## Deploy site to gh-pages
`npm run deploy:site`


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

```SCSS
//[1] optional, but recommended
.c-my-flooper{
	position: !static; // anything but static
	whitespace: nowrap;

	display: flex; //[1]
	flex-wrap: nowrap; //[1]
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

##### Options & defaults
```javascript
/**
 * @param {string} [flooper='.js-flooper']  - flooper classname hook
 * @param {string} [flooperItem='.js-flooper-item'] - each item classname hook
 * @param {number} [bufferSize=10] - amount of pixels after block as past left side
 * @param {number} [speed=1] - amount of pixels container element should move per call.
 */

// defaults
var instance = new Flooper({
	flooper: '.js-flooper', // string class selector
	flooperItem: .js-flooper-item', // 
	string class selector
	bufferSize: 10,
	speed: 1,
});
``` 

##### Methods
After instanciate and init, these are the current methods available.
```javascript
//
const myFlooper = new Flooper();
myFlooper.init();

```

| Method                   | Description                           
| -------------------------| ------------------                    
| `myFlooper.pause()`      | Pauses the flooper looping animation             
| `myFlooper.play()`       | Resumes animation if paused                    
| `myFlooper.slowMotion()` | Reduces speed to half. Currently default behaviour on mouseHover, but soon to be optional            


## Authors & Credits <br>
Tomás Marques | https://github.com/tomasmcm | @tomasmcm<br>
Renato de Leão | https://github.com/renatodeleao | @renatodeleao<br>


