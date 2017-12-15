import { indexAnimate } from './animations/indexAnimations.js';
import 'workerbench.coffee/workerbench.js';

const minCores = 2;
//
export default function animate() {
  WorkerBench.setup({
    maxWorkersToTestFor: minCores + 1,
    numberOfTimesToBenchmark: 2
  });

  WorkerBench.start((result) => {
    console.log(`%cComputing... you have ${result} core(s)`, "color:orange;font-size:8px");

    if(result > minCores){
      indexAnimate();
      console.log("%cAttached animations successfully", "color:orange;font-size:8px");
    } else {
      console.log("%cSkipped animations", "color:orange;font-size:8px");
    }
  });
}
