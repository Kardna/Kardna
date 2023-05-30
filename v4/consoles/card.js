// Welcome To Kardna v4!
// This Code Was Made 100% Zenfy
// So If You Steal It Thats Not Pushing P
// Thanks!
// -Zenfy
// Start of Cards //
let openinnewtab = 0;
var switch1 = document.getElementById("mySwitch");
document.addEventListener("DOMContentLoaded", function() {
	let mySwitch = document.getElementById("mySwitch");
  if (mySwitch) {
    mySwitch.addEventListener("change", function() {
      if (this.checked) {
        openinnewtab++;
      } else {
        openinnewtab--;
      }
      console.log(openinnewtab);
    });
  } else {
    console.error("Could not find element with ID 'mySwitch'");
  }
});

function gamelaunch(name){
    console.log(openinnewtab);
    if (openinnewtab === 1){
        verycoolfuntion();
    }
    else{
        let temp_url2 = btoa(name);
            if (name.startsWith('http')) {
                var src = "https://" + url + "/uv.html#" + temp_url2
            } else {
                var src = name
            }
        window.open(src,"_self")
    }
    function verycoolfuntion(){
        let win = window.open('./plyr/')
        let temp_url2 = btoa(name);
        if (name.startsWith('http')) {
            var src = "https://" + url + "/uv.html#" + temp_url2
        } else {
            var src = name
        }
        setTimeout(function(){let iframe = win.document.createElement('iframe'); iframe.style.position = "absolute"; iframe.style.top = "0"; iframe.style.bottom = "0"; iframe.style.left = "0"; iframe.style.right = "0"; iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.style.margin = "none"; iframe.style.zIndex = "999999"; iframe.src = src; win.document.body.appendChild(iframe)}, 100); 
    }
    };

  //  {
  //      "name": "",
  //      "url": "",
  //      "desc": "",
  //  }, 
    var cardArr = [

        ]

        var cardArr2 = [
            {
                "name": "Xbox",
                "url": "./xbox/",
                "desc": "Xbox is a video gaming brand created and owned by Microsoft.",
            }, 
            {
                "name": "Soon",
                "url": "",
                "desc": "",
            }, 
            {
                "name": "Soon",
                "url": "",
                "desc": "",
            }, 
        ]
setTimeout(function(){

    var id = document.getElementById("divbreo");
    if (id !== null && typeof id === "object") {
      console.log("All good");
    } else {
      console.log("Element is null or not an object");
      console.log(id)
    }
    hot();
    function hot(){
        cardArr2.sort(function(a, b) {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase

            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          });
          cardArr2.forEach(function(arrayItem) {
            var shhh = arrayItem.url;
                   let link2 = arrayItem.url;
                   let name2 = arrayItem.name;
                   document.getElementById("hot").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>Top 3</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick="var url2 = '${shhh}';gamelaunch(url2);"class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;  
               } );
    }
    }, .0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001);
    // End Of Cards //
    
