var div = document.getElementById("myDiv");
var resizer = document.createElement('div');
resizer.className = 'resizer';
div.appendChild(resizer);

var x = 0, y = 0, width = 0, height = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0;

resizer.addEventListener('mousedown', initResize, false);

function initResize(e) {
  x1 = e.clientX;
  y1 = e.clientY;
  document.addEventListener('mousemove', doResize, false);
  document.addEventListener('mouseup', stopResize, false);
}

function doResize(e) {
  x2 = e.clientX;
  y2 = e.clientY;
  width = x2 - x1;
  height = y2 - y1;
  div.style.width = width + 'px';
  div.style.height = height + 'px';
}

function stopResize(e) {
  document.removeEventListener('mousemove', doResize, false);
  document.removeEventListener('mouseup', stopResize, false);
}