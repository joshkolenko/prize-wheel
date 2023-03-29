/**
 * Namespace used for containing types in PrizeWheel.
 */
export namespace PrizeWheel {
  interface Instance {
    /**
     * HTML canvas element used to render prize wheel.
     * */
    canvas: HTMLCanvasElement;
    /**
     * HTML element that the canvas is appended to. Same as element passed to `createWheel`.
     * */
    el: HTMLElement;
    /**
     * Current settings for PrizeWheel instance.
     */
    settings: Settings;
    /**
     * Calls the wheels render method, which re-draws everything on canvas.
     * */
    render(): void;
    /**
     * Sets starting rotation of wheel.
     * */
    rotate(degrees: number): void;
    /**
     * Spins the wheel and triggers `done` event once finished.
     * */
    spin(): void;
    /**
     * Add event handler
     */
    on<E extends keyof Events>(event: E, handler: Events[E]): void;
  }

  /**
   * Settings object that PrizeWheel.Defaults and PrizeWheel.Options map to.
   * @internal
   */
  interface Settings {
    counterclockwise?: boolean;
    duration: number;
    image?: {
      el?: HTMLImageElement;
      src?: string;
      rotation?: number;
    };
    scale: number;
    segments: SegmentModified[];
    size: number;
    speed: number;
    stroke: {
      color: string;
      width: number;
    };
    text: {
      color: string;
      font: string;
      fontHref?: string;
      flip?: boolean;
      offset: number;
      size: number;
      style: string;
    };
    timeOffset: number;
    threshold: number;
  }

  /**
   * Default settings. Overwritten by Prizewheel.Options.
   * @internal
   */
  interface Defaults {
    duration: 8000;
    scale: 2;
    size: 100;
    speed: 1;
    stroke: {
      color: 'black';
      width: 3;
    };
    text: {
      color: 'black';
      font: 'Arial, Helvetica';
      offset: 12;
      size: 20;
      style: 'bold';
    };
    timeOffset: 1000;
    threshold: 5;
  }

  /**
   * Default event methods. Meant to be overwritten by PrizeWheel.Instance.on()
   * @internal
   */
  interface Events {
    spin(): void;
    done(result: Segment): void;
  }

  /**
   * Used to display wheel image instead of a canvas-generated wheel.
   */
  interface Image {
    /**
     * Image element to render inside of canvas.
     * Best practice is to use `src` property instead to render the image element.
     */
    el?: HTMLImageElement;

    /**
     * Source url of an image file.
     */
    src?: string;

    /**
     * Use to rotate the wheel the specified angle clockwise.
     * Only a visual effect for the wheel image that's drawn.
     * Doesn't affect the starting rotation of the wheel.
     *
     * Not affected by the `counterclockwise` option.
     */
    rotation?: number;
  }

  /**
   * Object used for PrizeWheel configuration.
   * Requires `segments` array.
   */
  interface Options {
    /**
     * Flips rotation of wheel for rotate and spin methods.
     *
     * Defaults to `false`
     * */
    counterclockwise?: boolean;

    /**
     * Total duration of the animation for the spin method in milliseconds.
     *
     * Defaults to `8000`
     */
    duration?: number;

    /**
     * Used to render an image instead of canvas shapes.
     *
     * Note: You still need to specify the wheel segments in the `segments` option.
     */
    image?: Image;

    /**
     * Percent of width the wheel should take up of the element passed to createWheel() out of 100.
     *
     * Defaults to `100`
     */
    size?: number;

    /**
     * Rendering scale of canvas for high DPI screens.
     *
     * Defaults to `2`
     */
    scale?: number;

    /**
     * Array of Segment objects.
     * These objects are used to render the wheel shapes and also controls where the wheel ends & the result of the spin() method.
     *
     * You can optionally pass a `data` property that will be returned with the result.
     *
     * @example
     * [
     *  { fill: '#ffffff', text: 'Segment 1', color: 'black', data: {} },
     *  { fill: '#000000', text: 'Segment 1', color: 'white', data: {} }
     * ]
     */
    segments: Segment[];

    /**
     * Speed of wheel in rotations per second.
     *
     * Defaults to `1`
     */
    speed?: number;

    /**
     * Object to customize the stroke of the drawn segments.
     * Can be set to `false` for no stroke.
     */
    stroke?:
      | false
      | {
          /**
           * Color of segment stroke.
           *
           * Defaults to `'black'`
           */
          color?: string;
          /**
           * Width of segment stroke.
           *
           * Defaults to `2`
           */
          width?: number;
        };

    /**
     * Object to customize the text of the drawn segments.
     */
    text?: {
      /**
       * Color of segment text.
       *
       * Defaults to `'black'`
       */
      color?: string;

      /**
       * Font of segment text.
       *
       * Defaults to `Arial, Helvetica`
       */
      font?: string;

      /**
       * Use this if you need to redraw the canvas once the font has loaded.
       * Useful for if font is on a different server. e.g. Google Fonts
       */

      fontHref?: string;
      /**
       * Flips the segment text.
       *
       * Defaults to `false`
       */
      flip?: boolean;

      /**
       * Offset of segment text from the edge of the wheel.
       *
       * Defaults to `12`
       */
      offset?: number;

      /**
       * Size of segment text.
       *
       * Defaults to `20`
       */
      size?: number;

      /**
       * Style of font.
       *
       * @example
       * '700'
       * 'bold italic'
       * 'normal'
       *
       * Defaults to `bold`
       */
      style?: string;
    };

    /**
     * Amount of time before wheel is done spinning to fire the `done` event
     *
     * Defaults to `1000`
     */
    timeOffset?: number;

    /**
     * Threshold of how far from the edge the segment can land on when spun.
     *
     * Defaults to `5`
     */
    threshold?: number;
  }

  /**
   * Modified version of PrizeWheel.Segment that has `_angles` & `_length` properties.
   * @internal
   */
  interface SegmentModified extends Segment {
    _angles: {
      start: number;
      end: number;
    };
    _length: number;
  }

  /**
   * Segments of PrizeWheel. Used for building wheel visually & for getting result.
   */
  interface Segment {
    /**
     * Color of segment text.
     * Overrides text.color
     */
    color?: string;

    /**
     * Property that can be anything that you'd like returned once wheel is done spinning.
     * Useful for information like the prize data, etc.
     */
    data?: any;

    /**
     * Background color of segment.
     *
     * Defaults to `'#ffffff'`
     */
    fill?: string;

    /**
     * Text to display on segment.
     */
    text?: string;

    /**
     * Weighted probability that the wheel will land on this segment.
     */
    weight: number;
  }
}

/**
 * Initializes PrizeWheel on provided HTMLElement and returns `PrizeWheel.Instance`.
 *
 * @example
 * const wheel = createWheel('#wheel', {
 *  segments: [
 *   {
 *    fill: '#000000',
 *    text: 'Segment 1',
 *    color: 'white',
 *    data: {}
 *   },
 *   {
 *    fill: '#ffffff',
 *    text: 'Segment 2',
 *    color: 'black',
 *    data: {}
 *   }
 *  ]
 * })
 *
 * @param el
 * Element that the canvas where the wheel is drawn will be appended to.
 * This element controls the width & height of the wheel.
 *
 * Can either be a string or an HTMLElement returned from a method such as `document.querySelector()`
 *
 * ---
 * @param options
 * Object used to initialize & customize the prize wheel.
 *
 * ---
 */
export function createWheel(
  el: string | HTMLElement,
  options: PrizeWheel.Options
): PrizeWheel.Instance;
