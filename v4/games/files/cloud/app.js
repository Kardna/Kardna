// This script is use to connect with kardna's backend //

// By Zenfy //

console.log(url);

// Start Of Games //

function krunker(){
    let url2 =  "https://krunker.io";
    var win = window.open('./plyr/')
    var temp_url2 = btoa(url2);
    let src = "https://" + url + "/uv.html#" + temp_url2
    setTimeout(function(){var iframe = win.document.createElement('iframe'); iframe.style.position = "absolute"; iframe.style.top = "0"; iframe.style.bottom = "0"; iframe.style.left = "0"; iframe.style.right = "0"; iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.style.margin = "none"; iframe.style.zIndex = "999999"; iframe.src = src; win.document.body.appendChild(iframe)}, 100); 
}

function motox3m(){
    let url2 = "https://www.coolmathgames.com/0-moto-x3m/play";
    var win = window.open('./plyr/')
    var temp_url2 = btoa(url2);
    let src = "https://" + url + "/uv.html#" + temp_url2
    setTimeout(function(){var iframe = win.document.createElement('iframe'); iframe.style.position = "absolute"; iframe.style.top = "0"; iframe.style.bottom = "0"; iframe.style.left = "0"; iframe.style.right = "0"; iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.style.margin = "none"; iframe.style.zIndex = "999999"; iframe.src = src; win.document.body.appendChild(iframe)}, 100); 
}



