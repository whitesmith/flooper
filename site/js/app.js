
import Flooper from '../../dist/Flooper.js';
import {consoleColophon} from './consoleColophon';
import {toggleAnimation} from './utils';

consoleColophon();
var demoFlooper = new Flooper();
demoFlooper.init();

var paused = false;

document.querySelector(".js-flooper-pause").onclick = () => {
  demoFlooper.pause();

  if(!paused) toggleAnimation(document.querySelector(".js-flooper"), "paused");
  paused=true;

  console.log("paused");
};
document.querySelector(".js-flooper-resume").onclick = () => {
  demoFlooper.resume();

  if(paused) toggleAnimation(document.querySelector(".js-flooper"), "paused");
  paused=false;

  console.log("resumed");
};

// Add random delay to floating animation
document.querySelectorAll(".js-flooper-item").forEach( (e) => {
  e.style.animationDelay = Math.random()*3 + "s";
});
