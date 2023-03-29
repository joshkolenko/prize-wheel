// import { createWheel } from './dist/esm/index.js';
import { createWheel } from './src/index.js';

const wheel = createWheel('#wheel', {
  duration: 6000,
  timeOffset: 1000,
  speed: 1,
  segments: [
    { fill: '#ffffff', text: 'Segment 1', weight: 10, color: 'black' },
    { fill: '#1C5D99', text: 'Segment 2', weight: 10 },
    { fill: '#BDFFFD', text: 'Segment 3', weight: 10, color: 'black' },
    { fill: '#7286A0', text: 'Segment 4', weight: 10 },
    { fill: '#BDEAFD', text: 'Segment 5', weight: 10, color: 'black' },
    { fill: '#1C5D69', text: 'Segment 6', weight: 10 },
  ],
  text: {
    size: 16,
  },
});

wheel.on('done', result => {
  console.log(result);
});

const spinBtn = document.querySelector('#spin') as HTMLElement;
spinBtn.addEventListener('click', wheel.spin);
