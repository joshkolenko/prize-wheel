function createWheel(el, options) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }

  options = {
    centerPoint: false,
    size: 100,
    scale: 3,
    ...options,
    stroke: {
      color: 'black',
      width: 2,
      ...options.stroke,
    },
    text: {
      color: 'black',
      family: 'Arial, Helvetica, sans-serif',
      offset: 15,
      size: 16,
      style: 'normal',
      ...options.text,
    },
  };

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
  function drawCircle() {
    context.lineWidth = strokeWidth;
    context.strokeStyle = options.stroke.color;

    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    context.stroke();
  }

  function drawSegments() {
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

        context.font = `${options.text.style} ${textSize}px ${options.text.family}`;
        context.fillStyle = options.text.color;

        const textMetrics = context.measureText(segment.text);
        const textHeight = textMetrics.fontBoundingBoxAscent;
        const textWidth = textMetrics.width;

        context.translate(point.x, point.y);
        context.rotate(degreesToRadians(angle));
        context.translate(-point.x, -point.y);

        context.fillText(
          segment.text,
          point.x - textWidth - textOffset,
          point.y + textHeight / 3
        );
        context.restore();
      }

      drawSegmentShape();
      drawSegmentText();
    });
  }

  drawCircle();
  drawSegments();

  return {
    el,
  };
}

const wheel = createWheel('#wheel', {
  text: {
    size: 20,
    offset: 15,
  },
  segments: [
    { fill: 'blue', text: 'Prize 1' },
    { fill: 'red', text: 'Prize 2' },
    { fill: 'green', text: 'Prize 3' },
    { fill: 'yellow', text: 'Prize 3' },
    { fill: 'pink', text: 'Prize 5' },
    { fill: 'gray', text: 'Prize 6' },
    { fill: 'teal', text: 'Prize 7' },
    { fill: 'purple', text: 'Prize 8' },
  ],
});
