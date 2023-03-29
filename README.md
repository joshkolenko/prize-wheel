<h1 style="text-align:center">PrizeWheel</h1>
<p style="text-align:center">
A configurable prize wheel library that is used to generate random results and spin a fancy wheel.
</p>

---

## Example

To use example, clone this repo, `cd` into the directory and run

```bash
npm i
npm run dev
```

The example uses `index.html`, `index.js` and `style.scss` in the repo root.

<br>

---

## Installation

Add an element to your html where you'd like the wheel `canvas` element appended (and maybe a button to spin it).<br>
_Note: The width and height of the element is used to calculate the width and height of the `canvas`_

```html
<div id="wheel"></div>
<button id="spin">Spin the wheel</button>
```

Import the `prize-wheel.js` or `prize-wheel.min.js` library (`dist/cjs` or `dist/esm`)
<br>
_Note: Currently working on the npm package, so you won't need to include the cjs or esm versions yourself_

```js
import { createWheel } from './prize-wheel.min.js
```

or include it in your html (`dist/web`).

```html
<script src="prize-wheel.min.js"></script>
```

<br>

---

## Usage

Initialize the prize wheel by calling `createWheel`. Returns `PrizeWheel.Instance`.

```js
const wheel = createWheel('#wheel', {
  segments: [
    { weight: 10, fill: '#ffffff', text: 'Segment 1', color: 'black' },
    { weight: 10, fill: '#1C5D99', text: 'Segment 2' },
    { weight: 10, fill: '#BDFFFD', text: 'Segment 3', color: 'black' },
    { weight: 10, fill: '#7286A0', text: 'Segment 4' },
    { weight: 10, fill: '#BDEAFD', text: 'Segment 5', color: 'black' },
    { weight: 10, fill: '#1C5D69', text: 'Segment 6' },
  ],
});
```

Use the `spin` method on the returned object to spin the wheel.

```js
const spinBtn = document.querySelector('#spin');

// Spin the wheel when button is clicked
spinBtn.addEventListener('click', wheel.spin);
```

You can use the `on` method to add event handlers to the wheel.

```js
wheel.on('spin', () => {
  // Do something once wheel has started spinning, such as disabling the spin button
});

wheel.on('done', result => {
  // Do something once wheel is done spinning, such as displaying the result

  console.log(result);
});
```

That's it! That's of course bare minimum so you may want to see the `PrizeWheel.Options` properties you can use to configure the `PrizeWheel.Instance`.

<br>

---

## API

### **`createWheel`** (function)

Initializes PrizeWheel on provided HTMLElement and returns `PrizeWheel.Instance`.

**Parameters**

- **el** (`string | HTMLElement`)
  - Element that the canvas be appended to. This element controls the width & height of the wheel.
- **options** (`PrizeWheel.Options`)
  - Object used to initialize & customize the prize wheel.

**Returns `PrizeWheel.Instance`**

<br>

### **`PrizeWheel.Instance`** (interface)

**Properties**

- **canvas** (`HTMLCanvasElement`) - HTML canvas element used to render prize wheel.
- **el** (`HTMLElement`) - HTML element that the canvas is appended to. Same as element passed to `createWheel`.
- **settings** (`PrizeWheel.Settings` (internal)) - Current settings for PrizeWheel instance.

**Methods**

- **render** - Calls the PrizeWheel's render method, which re-draws everything on canvas. Returns `void`.
- **rotate** (degrees: `number`) - Sets starting rotation of wheel. Returns `void`.
- **spin** - Spins the wheel and triggers `done` event once finished. Returns `void`.
- **on** (event: `string`, handler: `function`) - Add event handler to `PrizeWheel.Events`. Returns `void`.

<br>

### **`PrizeWheel.Options`** (interface)

Configuration object passed as the second argument in `createWheel`

**Properties**

- **counterclockwise?** (`HTMLCanvasElement`) - Flips rotation of wheel for rotate and spin methods.
- **duration?** (`number`) - Total duration of the animation for the spin method in milliseconds.
- **image?** (`PrizeWheel.Image`) - Used to render an image instead of canvas shapes.N ote: You still need to specify the wheel segments in the segments property.
- **scale?** (`number`) - Rendering scale of canvas for high DPI screens.
- **segments** (`PrizeWheel.Segment[]`) **_required_** - Array of `PrizeWheel.Segment` objects. These objects are used to render the wheel shapes and also controls where the wheel ends & the result of the spin() method. You can optionally pass a `data` property that will be returned with the result.
- **size?** (`number`) - Percent of width the wheel should take up of the element passed to `createWheel` out of `100`.
- **stroke?** - Object to customize the stroke of the drawn segments. Can be set to `false` for no stroke.
  - **Properties**
    - **color?** (`string`)
    - **width?** (`number`)
- **text?** - Object to customize the text of the drawn segments.
  - **Properties**
    - **color?** (`string`) - Color of segment text.
    - **flip?** (`boolean`) - Flips the segment text.
    - **font?** (`string`) - Font of segment text.
    - **fontHref?** (`string`) - Use this if you need to redraw the canvas once the font has loaded. Useful for if font is on a different server. e.g. Google Fonts, Typekit.
    - **offset?** (`number`) - Offset of segment text from the edge of the wheel.
    - **size?** (`number`) - Size of segment text..
    - **style?** (`number`) - Style of font. Example `bold`, `bold italic`, `normal`, `normal italic`, etc.
- **threshold?** (`number`) - How far from the edge the segment can land on when spun.
- **timeOffset?** - How far from the edge the segment can land on when spun.

<br>

### **`PrizeWheel.Defaults`**

```ts
{
  duration: 8000;
  scale: 2;
  size: 100;
  speed: 1;
  stroke: {
    color: 'black';
    width: 3;
  }
  text: {
    color: 'black';
    font: 'Arial, Helvetica';
    offset: 12;
    size: 20;
    style: 'bold';
  }
  timeOffset: 1000;
  threshold: 5;
}
```
