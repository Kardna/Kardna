
function togglefullscreen(){
    window.alert('Press ESC to exit fullscreen. Enjoy;)')
    const frame = document.getElementById('gameframe');
    console.log(frame);
    var el = frame,
      rfs = el.requestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen 
    ;

    rfs.call(el);
    zenfy();
    }
function zenfy(){
    
}