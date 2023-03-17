function createWheel(
  el: string | HTMLElement,
  options: PrizeWheelOptions
): PrizeWheel {
  if (typeof el === 'string') {
    el = document.querySelector(el) as HTMLElement;
  }

  const defaults: PrizeWheelDefaults = {
    counterclockwise: false,
    duration: 8000,
    size: 100,
    scale: 3,
    speed: 1,
    stroke: {
      color: 'black',
      width: 2,
    },
    text: {
      color: 'black',
      font: 'Arial, Helvetica',
      flip: false,
      offset: 12,
      size: 16,
      style: 'normal',
    },
    threshold: 5,
  };

  if (options.stroke === false) {
    options.stroke = { color: 'transparent', width: 0 };
  }

  const settings: PrizeWheelSettings = {
    ...defaults,
    ...options,
    segments: options.segments.map(
      (segment: PrizeWheelSegment, i: number): PrizeWheelSegmentModified => {
        const length = 360 / options.segments.length;

        const angles = {
          start: length * i,
          end: length * i + length,
        };

        return {
          ...segment,
          length,
          angles,
        };
      }
    ),
    stroke: {
      ...defaults.stroke,
      ...(options.stroke ? options.stroke : {}),
    },
    text: {
      ...defaults.text,
      ...(options.text ? options.text : {}),
    },
  };

  let width = el.clientWidth * settings.scale;
  let height = el.clientHeight * settings.scale;

  const strokeWidth = width * (settings.stroke.width / 300);
  const textSize = width * (settings.text.size / 300);
  const textOffset = width * (settings.text.offset / 300);

  const size = width * (settings.size / 100) - strokeWidth;
  const radius = size / 2;
  const center = {
    x: width / 2,
    y: height / 2,
  };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = width;
  canvas.height = height;

  el.append(canvas);

  function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  function polarToCartesian(
    degrees: number,
    radius: number
  ): PrizeWheelCartesianCoordinates {
    const radians = degreesToRadians(degrees);

    return {
      x: center.x + radius * Math.cos(radians),
      y: center.y + radius * Math.sin(radians),
    };
  }

  function render(): void {
    context.clearRect(0, 0, width, height);

    function drawImage(): void {
      if (settings.image) {
        context.save();

        if (settings.image.rotation) {
          context.translate(center.x, center.y);
          context.rotate(settings.image.rotation);
          context.translate(-center.x, -center.y);
        }

        context.drawImage(settings.image.el, 0, 0, width, height);
        context.restore();
      }
    }

    function drawSegments(): void {
      settings.segments.forEach(segment => {
        const point = polarToCartesian(segment.angles.start, radius);

        function drawSegmentShape(): void {
          context.fillStyle = segment.fill;
          context.lineWidth = strokeWidth;
          context.strokeStyle = settings.stroke.color;

          context.beginPath();
          context.arc(
            center.x,
            center.y,
            radius,
            Math.PI * (segment.angles.start / 180),
            Math.PI * (segment.angles.end / 180),
            false
          );

          context.lineTo(center.x, center.y);
          context.lineTo(point.x, point.y);

          context.fill();

          context.stroke();
        }

        function drawSegmentText(): void {
          const angle = segment.angles.start + segment.length / 2 + 180;
          const point = polarToCartesian(
            segment.angles.start + segment.length / 2,
            radius
          );

          context.save();

          context.font = `${settings.text.style} ${textSize}px ${settings.text.font}, sans-serif`;
          context.fillStyle = segment.color || settings.text.color;
          context.textBaseline = 'middle';
          context.textAlign = settings.text.flip ? 'right' : 'left';

          context.translate(point.x, point.y);
          context.rotate(
            degreesToRadians(settings.text.flip ? angle - 180 : angle)
          );
          context.translate(-point.x, -point.y);

          if (segment.text) {
            context.fillText(
              segment.text,
              settings.text.flip ? point.x - textOffset : point.x + textOffset,
              point.y
            );
          }

          context.restore();
        }

        drawSegmentShape();

        drawSegmentText();
      });
    }

    if (settings.image) {
      drawImage();
    } else {
      drawSegments();
    }
  }

  function rotate(degrees: number): void {
    context.translate(center.x, center.y);
    context.rotate(degreesToRadians(degrees));
    context.translate(-center.x, -center.y);

    render();
  }

  function shuffleArray(array: PrizeWheelSegment[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getWeightedResult(
    array: PrizeWheelSegmentModified[]
  ): PrizeWheelSegmentModified {
    let resultArray: PrizeWheelSegmentModified[] = [];

    array.forEach(obj => {
      for (let i = 0; i < obj.weight * 10; i++) {
        resultArray.push(obj);
      }
    });

    shuffleArray(resultArray);

    return resultArray[Math.floor(Math.random() * resultArray.length)];
  }

  // Quintic easing out
  // https://spicyyoghurt.com/tools/easing-functions
  function ease(t: number, b: number, c: number, d: number): number {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  }

  let isSpinning = false;

  async function spin(): Promise<PrizeWheelSegmentModified> {
    return new Promise(resolve => {
      if (isSpinning) {
        return;
      }

      const start = new Date();
      const result = getWeightedResult(settings.segments);

      let offset = (360 / settings.segments.length - settings.threshold) / 2;
      offset *= Math.random();
      offset *= Math.random() > 0.5 ? 1 : -1;

      let final = (settings.duration / 1000) * settings.speed * 360 + offset;

      if (settings.counterclockwise) {
        final += result.angles.start;
        final *= -1;
      } else {
        final -= result.angles.start;
      }

      final = Math.floor(final);

      function animate() {
        const now = new Date();
        const time = now.valueOf() - start.valueOf();
        const angle = ease(time, 0, final, settings.duration);

        context.save();
        rotate(angle);
        context.restore();

        if (time >= settings.duration) {
          resolve(result);
          isSpinning = false;
          return;
        }

        requestAnimationFrame(animate);
      }

      animate();

      isSpinning = true;
    });
  }

  if (settings.image) {
    const image = new Image();
    image.src = settings.image.src;

    settings.image.el = image;
    settings.image.el.onload = render;
  }

  // Vertical starting position
  rotate(270 - 360 / settings.segments.length / 2);

  if (settings.text.fontHref) {
    const image = new Image();

    image.src = settings.text.fontHref;
    image.onerror = render;
  }

  return {
    canvas,
    el,
    settings,
    render,
    rotate,
    spin,
  };
}
