// import { createWheel } from './dist/esm/index.js';
import { createWheel } from './src/index.js';

const wheel = createWheel('#wheel', {
  segments: [
    { weight: 10, fill: 'purple', text: 'Segment 1', color: 'pink' },
    { weight: 10, fill: 'pink', text: 'Segment 2', color: 'purple' },
    { weight: 10, fill: 'purple', text: 'Segment 3', color: 'pink' },
    { weight: 10, fill: 'pink', text: 'Segment 4', color: 'purple' },
    { weight: 10, fill: 'purple', text: 'Segment 5', color: 'pink' },
    { weight: 10, fill: 'pink', text: 'Segment 6', color: 'purple' },
  ],
  stroke: false,
});

wheel.on('done', result => {
  console.log(result);
});

const spinBtn = document.querySelector('#spin') as HTMLElement;
spinBtn.addEventListener('click', wheel.spin);
