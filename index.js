function createWheelJS(el, options) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }

  options = {
    counterclockwise: false,
    duration: 6000,
    timing: 'ease',
    size: 100,
    scale: 3,
    speed: 1,
    ...options,
    stroke:
      options.stroke === false
        ? false
        : {
            color: 'black',
            width: 2,
            ...options.stroke,
          },
    text: {
      color: 'black',
      font: 'Arial, Helvetica',
      offset: 12,
      size: 16,
      style: 'normal',
      ...options.text,
    },
    threshold: 5,
  };

  if (options.stroke === false) {
    options.stroke = { color: 'transparent', width: 0 };
  }

  options.segments.map((segment, i) => {
    return {
      ...segment,
      size: 360 / options.segments.length,
      angles: {
        start: length * i,
        end: length * i + length,
      },
    };
  });

  let width = el.clientWidth * options.scale;
  let height = el.clientHeight * options.scale;

  const strokeWidth = width * (options.stroke.width / 300);
  const textSize = width * (options.text.size / 300);
  const textOffset = width * (options.text.offset / 300);

  const size = width * (options.size / 100) - strokeWidth;
  const radius = size / 2;
  const center = {
    x: width / 2,
    y: height / 2,
  };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  el.append(canvas);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getWeightedResult(array) {
    let resultArray = [];

    array.forEach(obj => {
      for (let i = 0; i < obj.weight * 10; i++) {
        resultArray.push(obj);
      }
    });

    shuffleArray(resultArray);

    return resultArray[Math.floor(Math.random() * resultArray.length)];
  }

  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function polarToCartesian(degrees, r) {
    const radians = degreesToRadians(degrees);

    return {
      x: center.x + r * Math.cos(radians),
      y: center.y + r * Math.sin(radians),
    };
  }

  function render() {
    context.clearRect(0, 0, width, height);

    function drawImage() {
      context.save();

      if (options.image.rotation) {
        context.translate(center.x, center.y);
        context.rotate(options.image.rotation);
        context.translate(-center.x, -center.y);
      }

      context.drawImage(options.image.el, 0, 0, width, height);
      context.restore();
    }

    options.segments = options.segments.map((segment, i) => {
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
    });

    function drawSegments() {
      options.segments.forEach(segment => {
        const point = polarToCartesian(segment.angles.start, radius);

        function drawSegmentShape() {
          context.fillStyle = segment.fill;
          context.lineWidth = strokeWidth;
          context.strokeStyle = options.stroke.color;

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

        function drawSegmentText() {
          const angle = segment.angles.start + segment.length / 2 + 180;
          const point = polarToCartesian(
            segment.angles.start + segment.length / 2,
            radius
          );

          context.save();

          context.font = `${options.text.style} ${textSize}px ${options.text.font}, sans-serif`;
          context.fillStyle = segment.color || options.text.color;
          context.textBaseline = 'middle';
          context.textAlign = options.text.flip ? 'right' : 'left';

          context.translate(point.x, point.y);
          context.rotate(
            degreesToRadians(options.text.flip ? angle - 180 : angle)
          );
          context.translate(-point.x, -point.y);

          context.fillText(
            segment.text,
            options.text.flip ? point.x - textOffset : point.x + textOffset,
            point.y
          );

          context.restore();
        }

        drawSegmentShape();

        drawSegmentText();
      });
    }

    if (options.image) {
      drawImage();
    } else {
      drawSegments();
    }
  }

  function rotate(degrees) {
    context.translate(center.x, center.y);
    context.rotate(degreesToRadians(degrees));
    context.translate(-center.x, -center.y);

    render();
  }

  // Quintic easing out
  // https://spicyyoghurt.com/tools/easing-functions
  function ease(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  }

  let isSpinning = false;

  async function spin() {
    return new Promise(resolve => {
      if (isSpinning) {
        return;
      }

      const start = new Date();
      const result = getWeightedResult(options.segments);

      let offset = (360 / options.segments.length - options.threshold) / 2;
      offset *= Math.random();
      offset *= Math.random() > 0.5 ? 1 : -1;

      let final = (options.duration / 1000) * options.speed * 360 + offset;

      if (options.counterclockwise) {
        final += result.angles.start;
        final *= -1;
      } else {
        final -= result.angles.start;
      }

      final = Math.floor(final);

      function animate() {
        const now = new Date();
        const time = now - start;
        const angle = ease(time, 0, final, options.duration);

        context.save();
        rotate(angle);
        context.restore();

        if (time >= options.duration) {
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

  if (options.image) {
    const image = new Image();
    image.src = options.image.src;

    options.image.el = image;
    options.image.onload = () => {
      render();
    };
  }

  // Vertical starting position
  rotate(270 - 360 / options.segments.length / 2);

  if (options.text.fontHref) {
    const image = new Image();

    image.src = options.text.fontHref;
    image.onerror = render;
  }

  return {
    canvas,
    el,
    options,
    render,
    rotate,
    spin,
    shuffleArray,
    getWeightedResult,
    degreesToRadians,
    polarToCartesian,
  };
}
