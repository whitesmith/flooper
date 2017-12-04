import {toggleAnimation} from './utils';
import scrollama from 'scrollama';
// Player styles => _c.player.scs
// Player html => _player.jade

export function Player(){
  let root = document.getElementById('app'),
      playerSelector = document.querySelector('.js-flooper-player'),
      binaryControlGroup = document.querySelector('.js-flooper-binary-controls'),
      filterControlGroup = document.querySelector('.js-flooper-filter-controls'),
      initStateHook = document.querySelector('.js-flooper-state-init'),
      playStateHook = document.querySelector('.js-flooper-state-play'),
      slowMotionStateHook = document.querySelector('.js-flooper-state-slowmotion'),
      speedStateHook = document.querySelector('.js-flooper-state-speed'),
      pauseControl = document.querySelector(".js-flooper-pause"),
      playControl = document.querySelector(".js-flooper-play"),
      slowMotionControl = document.querySelector(".js-flooper-slowmotion"),
      curFlooper = window.curFlooper,
      floopers = window.flooperInstances,
      selectbox;

  /**
   * Build selectbox with all demo flooper instances
   * @function
   */
  function buildSelectbox(){
    var container = document.querySelector('.js-player-selectbox-holder');
    selectbox = document.createElement('select');
    selectbox.classList.add('js-player-selectbox');

     for (var i = 0; i < floopers.length; i++) {
      var opt = document.createElement("option");
      opt.value = flooperInstances[i].uid;
      opt.innerHTML = floopers[i].options.name; // whatever property it has

      // then append it to the select element
      selectbox.appendChild(opt);
    }

    container.appendChild(selectbox);
  }

  function setSelectboxOption(index){
    selectbox.options.selectedIndex = index;
  }



  /* ---------------------------
   * HANDLE INTERACTIONS
   * --------------------------- */


  /**
   * Build selectbox with all demo flooper instances
   * @function
   */
  function handleActiveControl(e){
    let delegator = this;
    let elements = delegator.children;

    if(e.target && e.target.nodeName == "BUTTON"){
      var clickedControl = e.target;

      if( !clickedControl.classList.contains('is-active') ){
        // remove active class from siblings
        for (let i = 0; i < elements.length; ++i) {
          elements[i].classList.remove("is-active");
        }

        clickedControl.classList.add('is-active')
      }
    }
  }


  function mapStateToPlayer(){
    //console.log('bang');
    if (curFlooper === undefined) return false

    var state = curFlooper.getState();

    //console.log(state);

    initStateHook.innerHTML = state.initialised ? 'True' : 'False';
    playStateHook.innerHTML = state.paused ? 'Paused' : 'Playing';
    slowMotionStateHook.innerHTML = state.slowmotion ? 'On' : 'Off';
    speedStateHook.innerHTML = state.speed;
  }

  /**
   * Build selectbox with all demo flooper instances
   * @function
   */
  function onSelectChange(e){
    var selectedFlooper = e.target.selectedOptions[0].value;

    curFlooper = flooperInstances.find(flooper => flooper.uid === selectedFlooper );
    //console.log(curFlooper);

    mapStateToPlayer();
  }


  /**
  * Makes current selected flooper paused
  * @function
  */
  function handlePause(){
    if(!curFlooper.getState().paused){
      toggleAnimation(curFlooper.flooper, "paused");
    }

    curFlooper.pause();
    console.log(`${curFlooper.uid} is paused`);
    mapStateToPlayer();
  }


  /**
   * Makes current selected flooper play
   * @function
   */
  function handlePlay(){
    if(curFlooper.getState().paused){
      toggleAnimation(curFlooper.flooper, "paused");
    }

    curFlooper.play();
    console.log(`${curFlooper.uid} is playing`);
    mapStateToPlayer();
  }

  /**
   * Makes current selected flooper into slowmotion
   * @function
   */
  function handleSlowmotion(){
    curFlooper.slowMotion();

    let state = curFlooper.getState().slowmotion;
    mapStateToPlayer();
  }


  /**
   * Attach all events
   * @function
   */
  function attachEvents(){
    binaryControlGroup.addEventListener('click', handleActiveControl, true);
    filterControlGroup.addEventListener('click', handleActiveControl, true);

    pauseControl.addEventListener('click', handlePause, false);
    playControl.addEventListener('click', handlePlay, false);
    slowMotionControl.addEventListener('click', handleSlowmotion, false);

    selectbox.addEventListener('change', onSelectChange, false);
  }

  function getRoomForPlayer(){
    let h = playerSelector.getBoundingClientRect().height;
    root.style.paddingBottom = h + 'px';
  }

  function update(){
    curFlooper = window.curFlooper;
    floopers = window.flooperInstances;
    buildSelectbox();
    attachEvents();
    selectbox.dispatchEvent(new Event('change'));
    mapStateToPlayer();
    scrollUpdate();
  }

  function init(){
    getRoomForPlayer();

    if(curFlooper === undefined || floopers === undefined) return false;
    update();
  }

  // Update selectbox on scroll
  function scrollUpdate(){
    var playerScrollama = scrollama();

    playerScrollama.setup({
      step: '[data-scrollama-flooper]', // required
      offset: 0.5, // optional, default = 0.5
      debug: false // optional, default = false
    })
    .onStepEnter(handleStepEnter);

    function handleStepEnter(obj){
      //{ element: DOMElement, index: number, direction: string }
      setSelectboxOption(obj.index);
      selectbox.dispatchEvent(new Event('change'));
    }
  }

  // Expose some methods
  const P = {};
  P.setup = init;
  P.update = update;
  P.mapStateToPlayer = mapStateToPlayer;
  P.setSelectboxOption = setSelectboxOption;

  return P;
}
