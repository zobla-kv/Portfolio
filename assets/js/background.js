var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// confioguration variables
// space between each line
var lineSpacing = 30;

var lineColor = 'rgba(255, 255, 255, 1)'; // RGBA supported, last value = alpha (between 0 and 1)

// line length is calculated based on distance between mouse position and the position of a point
// min and max are taken into account so the length of the line does not go below or above these values
var lineMinLength = 2;
var lineMaxLength = 10;

// multiplier of the length of the line, the length of the line is the distance between the mouse and the point at which a line starts
// e.g. if you cursor is at the top left and the point is at the bottom right, the distance will be 1, which is multiplied by this value
// this value will not exceed the min/max defined above
var lineLengthMultiplier = 20;

var lineWidth = 0.15;

// runtime variables
var width;
var height;
var linesX;
var linesY;
var mouseX;
var mouseY;

var onResize = function () {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  linesX = Math.floor((width - lineSpacing / 2) / lineSpacing);
  linesY = Math.floor((height - lineSpacing / 2) / lineSpacing);
  canvas.width = width;
  canvas.height = height;
};

var draw = function () {
  requestAnimationFrame(draw);

  if (mouseX == void 0 || mouseY == void 0) {
    return;
  }

  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;

  for (var x = 0; x < linesX; x++) {
    for (var y = 0; y < linesY; y++) {
      var screenX = x * lineSpacing + lineSpacing;
      var screenY = y * lineSpacing + lineSpacing;
      var angle = Math.atan2(screenY - mouseY, screenX - mouseX);
      var distance = Math.sqrt(
        (mouseX - screenX) * (mouseX - screenX) +
          (mouseY - screenY) * (mouseY - screenY)
      );

      var length = Math.min(
        Math.max(
          lineMinLength,
          (distance / ((width + height) / 2)) * lineLengthMultiplier
        ),
        lineMaxLength
      );

      ctx.beginPath();
      ctx.moveTo(screenX, screenY);

      ctx.lineTo(
        screenX + length * Math.cos(angle),
        screenY + length * Math.sin(angle)
      );

      ctx.stroke();
    }
  }
};

window.addEventListener('resize', function () {
  onResize();
  draw();
});

canvas.addEventListener('mousemove', function (ev) {
  mouseX = ev.clientX;
  mouseY = ev.clientY;
});

onResize();

mouseX = width / 2;
mouseY = height / 2;

draw();
