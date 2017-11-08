console.log('hello world');

var i = new Flooper();
i.init();

document.querySelector(".js-flooper-pause").onclick = () => {
  i.pause();
  console.log("paused");
};
document.querySelector(".js-flooper-resume").onclick = () => {
  i.resume();
  console.log("resumed");
};
