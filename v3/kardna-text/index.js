let so = 0;

const pathAnimation = () => {
  requestAnimationFrame(pathAnimation);
  tp.setAttributeNS(null, "startOffset", so + "%");
  if (so >= 50) {
    so = 0;
  }
  so += 0.05;
};

const customCursor = () => {
  window.addEventListener("mousemove", (e) => {
    rotateImage(e);

    let top = e.clientY;
    let left = e.clientX;

    customCursorEl.style.opacity = 1;
    customCursorEl.style.top = top + "px";
    customCursorEl.style.left = left + "px";
  });
};

const rotateImage = (event) => {
  var x = event.clientX;
  var w = window.innerWidth;
  var midpoint = w / 2;
  var pos = x - midpoint;
  var val = (pos / midpoint) * 10;
  loaderImage.style.transform =
    "scale(1.3) perspective(550px) rotateY(" + val + "deg)";
  customCursorEl.style.transform = val > 0 ? "scaleX(1)" : "scaleX(-1)";
};

// Init Animation
pathAnimation();
customCursor();
