import scrollama from 'scrollama';
import anime from 'animejs';
import { animejsAnimations } from './animejsAnimationsObject';
// Helpers
import {mapElementsToObject, githubStars} from '../utils';

/*
 * Index Hero Animations
 * Based on page Load
 */
export function heroAnimations(){

  // DOM SELECTORS
  let $hero = document.querySelector("[data-animejs-hero-timeline]");
  let $heroAnimationElements = $hero.querySelectorAll("[data-animejs]")


  let heroAnimationBlocks = {};
  mapElementsToObject({
    arr: $heroAnimationElements,
    attr: 'data-animejs',
    prop: 'hook',
    objToExtend: heroAnimationBlocks
  })


  /*
   * ANIMATION
   */
  // HERO TIMELINE SCENE
  var animeHeroTimelineScene = anime.timeline();
  /*
   *tagget animate nots from TOP animeNotes
   */
  var notesBlocks = heroAnimationBlocks.notes[0].querySelectorAll('[data-animejs]');
  var animeHeroNotes = {
    targets: notesBlocks,
    ...animejsAnimations.slideInFromTop,
    duration: 250,
    easing: 'easeOutCubic',
    delay: function(target, index) {
      // 100ms delay multiplied by every div index, in ascending order
      return index * 200;
    },
    complete: function(){
      githubStars("whitesmith/Flooper.js", updateStarGazers);
    }
  }

  /*
   * callcback function for Asyn Get GithubStarts
   * @param {Number} startsCount
   * @returns animeJs intance
  */

  function updateStarGazers(starsCount){
    var obj = { stars: 0 };

    var animeStargazers = anime({
      targets: obj,
      stars: starsCount,
      round: 1,
      duration: 500,
      easing: 'linear',
      update: function() {
        var el = document.querySelector('.js-gh-stars')
        el.innerHTML = JSON.stringify(obj.stars)
      }
    });
  }



  var animeFlooper = {
    targets: heroAnimationBlocks.flooper,
    ...animejsAnimations.fadeIn,
    duration: 600,
    delay: 500
  }


  var animeTypesetBlocks = {
    targets: heroAnimationBlocks.typesetBlock,
    ...animejsAnimations.slideInFromBottom,
    duration: 600,
    easing: 'easeOutQuad',
    delay: function(target, index) {
      // 100ms delay multiplied by every div index, in ascending order
      return index * 200;
    }
  }

  var poly = document.querySelector('.github-corner .morph');
  var animeGithubRibbon = {
    targets:  poly,
    points: [
      {value: "125,125 125,125 125,125"},
      {value: "-125,0 125,125 125,250"},
      {value: "0,0 250,0 250,250"},
    ],
    duration: 500,
    easing: 'easeInQuad'
  }

  var player = document.querySelector('.js-flooper-player');
  var animePlayer = {
    targets:  player,
    ...animejsAnimations.slideInFromBottom
  }

  animeHeroTimelineScene.add([animeFlooper, animeTypesetBlocks, animeHeroNotes, animeGithubRibbon, animePlayer]);
}



/*
 * How It Works Section Animation
 * Based on Scrollama points
 */
export function howItWorksAnimation(){

  var anim = {
    ...animejsAnimations.slideInFromBottom,
    delay: function(target, index) {
      // 100ms delay multiplied by every div index, in ascending order
      return index * 400;
    },
    autoplay: false
  }
   // DOM SELECTORS
  let $howSection = document.querySelector("[data-animejs-how-timeline]");
  let $howSectionElements = $howSection.querySelectorAll("[data-animejs]");

  var targets = {targets: $howSectionElements};
  var animeHowSectionBlocks = anime({...targets, ...anim});

  return animeHowSectionBlocks;
}


/*
 * Showcase Animation
 * Based on Scrollama points
 */
export function showcaseAnimation(){
  var anim = {
    ...animejsAnimations.fadeIn,
    duration: 250,
    autoplay: false
  }
  // DOM SELECTORS
  let $showcase = document.querySelector("[data-anime-js-showcase-timeline]");
  var targets = {targets: $showcase};
  var animeShowCaseSection = anime({...targets, ...anim});

  return animeShowCaseSection;
}



/*
 * SCROLLAMA SETUP
 */
export function scrollamaAnimations(){
  // instantiate the scrollama
  const scroller = scrollama();

  // Get animejs instances
  var howSection = howItWorksAnimation();
  //var showcaseSection = showcaseAnimation();

  // setup the instance, pass callback functions
  scroller
    .setup({
      step: '[data-scrollama-step]', // required
      offset: 0.75, // optional, default = 0.5
      debug: false // optional, default = false
    })
    .onStepEnter(handleStepEnter);


  function handleStepEnter(obj){
    //{ element: DOMElement, index: number, direction: string }
    if (obj.element.classList.contains('scrollamed')){
      return false
    }

    // no more animations for it after the first
    obj.element.classList.add('scrollamed');

    switch(obj.element.getAttribute('data-scrollama-step')){
      case 'how':
        howSection.play()
        break;
      /*
      case 'showcase':
       showcaseSection.play();
        break;
      */
      default:
        console.log('noop')
    }
  }
}

export function indexAnimate() {
  heroAnimations();
  scrollamaAnimations();
}

