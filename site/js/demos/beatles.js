import {toggleAnimation} from '../utils';
import {polyfillStringStartsWith} from '../utils';

export function beatlesDemo(){
  var beatlesFlooper = flooperInstances.find(inst => inst.uid.startsWith('beatles') === true);

   // Add random delay to floating animation
  var elements = beatlesFlooper.flooperItems;
  for (var i = 0, len = elements.length; i < len; ++i) {
    elements[i].style.animationDelay = Math.random()*3 + "s";
  }

  // custom Callback for this player
  let beatlesCbs = {
    onFloop: (el, order) => console.log(`%c Flooping ${el.querySelector('img').getAttribute('alt')} to order: ${order - 1}`, "color: #32CD32; font-size: 16px;")
  }

  beatlesFlooper.setCallbacks(beatlesCbs);
}
