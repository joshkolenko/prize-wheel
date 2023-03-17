interface PrizeWheel {
  canvas: HTMLCanvasElement;
  el: HTMLElement;
  settings: PrizeWheelSettings;
  render: () => void;
  rotate: (degrees: number) => void;
  spin: () => void;
}

interface PrizeWheelCartesianCoordinates {
  x: number;
  y: number;
}

interface PrizeWheelDefaults {
  counterclockwise: boolean;
  duration: number;
  size: number;
  scale: number;
  speed: number;
  stroke: PrizeWheelStroke;
  text: PrizeWheelText;
  threshold: number;
}

interface PrizeWheelImage {
  el: HTMLImageElement;
  src: string;
  rotation: number;
}

interface PrizeWheelOptions {
  counterclockwise?: boolean;
  duration?: number;
  image?: PrizeWheelImage;
  size?: number;
  scale?: number;
  segments: PrizeWheelSegment[];
  speed?: number;
  stroke?: false | PrizeWheelStroke;
  text?: PrizeWheelText;
  threshold?: number;
}

interface PrizeWheelSegment {
  color?: string;
  data?: {};
  fill: string;
  text?: string;
  weight: number;
}

interface PrizeWheelSegmentAngles {
  start: number;
  end: number;
}

interface PrizeWheelSegmentModified extends PrizeWheelSegment {
  angles: PrizeWheelSegmentAngles;
  length: number;
}

interface PrizeWheelSettings extends PrizeWheelDefaults {
  image?: PrizeWheelImage;
  segments: PrizeWheelSegmentModified[];
}

interface PrizeWheelStroke {
  color: string;
  width: number;
}

interface PrizeWheelText {
  color: string;
  font: string;
  fontHref?: string;
  flip: boolean;
  offset: number;
  size: number;
  style: string;
}
