function createWheel(el, options) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }

  console.log(options.stroke);

  options = {
    duration: 8000,
    timing: 'ease',
    size: 100,
    scale: 3,
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
      font: 'Arial, Helvetica, sans-serif',
      offset: 15,
      size: 20,
      style: 'normal',
      ...options.text,
    },
  };

  if (options.stroke === false) {
    options.stroke = { color: 'transparent', width: 0 };
  }

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

  function cubicBezier(t, initial, p1, p2, final) {
    return (
      (1 - t) * (1 - t) * (1 - t) * initial +
      3 * (1 - t) * (1 - t) * t * p1 +
      3 * (1 - t) * t * t * p2 +
      t * t * t * final
    );
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

  function draw() {
    context.clearRect(0, 0, width, height);

    options.segments.forEach((segment, i) => {
      const length = 360 / options.segments.length;

      const angles = {
        start: length * i,
        end: length * i + length,
      };

      const point = polarToCartesian(angles.start, radius);

      function drawSegmentShape() {
        context.fillStyle = segment.fill;
        context.lineWidth = strokeWidth;
        context.strokeStyle = options.stroke.color;

        context.beginPath();
        context.arc(
          center.x,
          center.y,
          radius,
          Math.PI * (angles.start / 180),
          Math.PI * (angles.end / 180),
          false
        );
        context.lineTo(center.x, center.y);
        context.lineTo(point.x, point.y);

        context.fill();

        context.stroke();
      }

      function drawSegmentText() {
        const angle = angles.start + length / 2;
        const point = polarToCartesian(angles.start + length / 2, radius);

        context.save();

        context.font = `${options.text.style} ${textSize}px ${options.text.font}`;
        context.fillStyle = segment.color || options.text.color;
        context.textBaseline = 'middle';
        context.textAlign = 'right';

        context.translate(point.x, point.y);
        context.rotate(degreesToRadians(angle));
        context.translate(-point.x, -point.y);

        context.fillText(segment.text, point.x - textOffset, point.y);

        context.restore();
      }

      drawSegmentShape();
      drawSegmentText();
    });
  }

  function rotate(degrees) {
    context.translate(center.x, center.y);
    context.rotate(degreesToRadians(degrees));
    context.translate(-center.x, -center.y);

    draw();
  }

  async function spin() {
    let frame;
    let time = new Date();
    const end = new Date(time.getTime() + 8000);

    function animate() {
      time = new Date();
      const angle = ((2 * Math.PI) / 60) * time.getSeconds();

      context.clearRect(0, 0, width, height);

      rotate(angle);

      frame = window.requestAnimationFrame(animate);
    }

    // animate();
  }

  draw();

  return {
    el,
    canvas,
    draw,
    rotate,
    spin,
    degreesToRadians,
    polarToCartesian,
  };
}
