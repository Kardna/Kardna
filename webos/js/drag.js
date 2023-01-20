var div = document.getElementById("vscodewindow");
var x = 0, y = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0;

div.addEventListener("mousedown", function(e) {
  x1 = e.clientX;
  y1 = e.clientY;
  document.addEventListener("mousemove", moveDiv);
});

document.addEventListener("mouseup", function() {
  document.removeEventListener("mousemove", moveDiv);
});

function moveDiv(e) {
  x2 = x1 - e.clientX;
  y2 = y1 - e.clientY;
  x1 = e.clientX;
  y1 = e.clientY;
  x -= x2;
  y -= y2;
  div.style.left = x + "px";
  div.style.top = y + "px";
}
