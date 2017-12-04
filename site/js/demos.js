import Flooper from '../../lib/index.js';

import {
  beatlesDemo
} from './demos/beatles'

function initialiseDemoInstances(){
  window.flooperInstances = [];
  var $floopers = [].slice.call(document.querySelectorAll('[data-flooper="container"]'));

  $floopers.forEach(function(flooper, i){
    flooperInstances[i] = new Flooper(flooper, {
      onSlowmotion: () => player.mapStateToPlayer()
    });
  });

  window.curFlooper = flooperInstances[0];
  // update player
  player.update();
}


export function initDemos(){
  initialiseDemoInstances();
  beatlesDemo();
}
