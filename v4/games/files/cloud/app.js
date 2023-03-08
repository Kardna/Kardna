// This script is use to connect with kardna's backend //

// By Zenfy //

console.log(url);

// Start Of Games //

function krunker(){
    var win = window.open('./plyr/')
    let temp_url = "https://krunker.io"
    console.log(url);
    let temp_url2 = btoa(url);
    var url =  "https://krunker.io";
    setTimeout(function(){var iframe = win.document.createElement('iframe'); iframe.style.position = "absolute"; iframe.style.top = "0"; iframe.style.bottom = "0"; iframe.style.left = "0"; iframe.style.right = "0"; iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.style.margin = "none"; iframe.style.zIndex = "999999"; iframe.src = url; win.document.body.appendChild(iframe)}, 100); 
}
