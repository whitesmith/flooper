
import Flooper from '../../dist/Flooper.js';
import {consoleColophon} from './consoleColophon';

consoleColophon();
var demoFlooper = new Flooper();
demoFlooper.init();

document.querySelector(".js-flooper-pause").onclick = () => {
  demoFlooper.pause();
  console.log("paused");
};
document.querySelector(".js-flooper-resume").onclick = () => {
  demoFlooper.resume();
  console.log("resumed");
};
