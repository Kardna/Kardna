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
        let src = "https://" + url + "/uv.html#" + temp_url2
        window.open(src,"_self")
    }
    function verycoolfuntion(){
        let win = window.open('./plyr/')
        let temp_url2 = btoa(name);
        let src = "https://" + url + "/uv.html#" + temp_url2
        setTimeout(function(){let iframe = win.document.createElement('iframe'); iframe.style.position = "absolute"; iframe.style.top = "0"; iframe.style.bottom = "0"; iframe.style.left = "0"; iframe.style.right = "0"; iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.style.margin = "none"; iframe.style.zIndex = "999999"; iframe.src = src; win.document.body.appendChild(iframe)}, 100); 
    }
    };


setTimeout(function(){
    var id = document.getElementById("divbreo");
    if (id !== null && typeof id === "object") {
      console.log("All good");
    } else {
      console.log("Element is null or not an object");
      console.log(id)
    }
    hot();
    newer();
    all();
    //New
    function newer(){
        var cardArr = [

        ]
        cardArr.sort(function(a, b) {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
              
          // sort in an ascending order
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });
          cardArr.forEach(function(arrayItem) {
            var shhh = arrayItem.url;
                   let link2 = arrayItem.url;
                   let name2 = arrayItem.name;
                   document.getElementById("new").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>New</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick="var url2 = '${shhh}';gamelaunch(url2);"class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;  
                } );
               cardArr.forEach(function(arrayItem) {
                var shhh = arrayItem.url; 
                let link2 = arrayItem.url;
                let name2 = arrayItem.name;
                document.getElementById("all").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>New</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick="var url2 = '${shhh}';gamelaunch(url2);"class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;  
            } );
    }
    //Hot
    function hot(){
    
        var cardArr2 = [
            {
                "name": "Moto x3m",
                "url": "https://www.coolmathgames.com/0-moto-x3m/play",
                "desc": "Run, skate and jump through a brand new galaxy!",
            }, 
            {
                "name": "Krunker",
                "url": "https://krunker.io",
                "desc": "Krunker is a Multiplayer Online Game.",
            },
            {
                "name": "Run 3",
                "url": "https://www.coolmathgames.com/0-run-3/play",
                "desc": "Run, skate and jump through a brand new galaxy!",
            },
        ]
        cardArr2.sort(function(a, b) {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
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
    function all(){
        var cardArr3 = [
            {
                "name": "Moto x3m",
                "url": "https://www.coolmathgames.com/0-moto-x3m/play",
                "desc": "Run, skate and jump through a brand new galaxy!",
            }, 
            {
                "name": "Krunker",
                "url": "https://krunker.io",
                "desc": "Krunker is a Multiplayer Online Game.",
            },
            {
                "name": "Run 3",
                "url": "https://www.coolmathgames.com/0-run-3/play",
                "desc": "Run, skate and jump through a brand new galaxy!",
            },
            {
                "name": "Tiny Fishing",
                "url": "https://www.coolmathgames.com/0-tiny-fishing/play;",
                "desc": "Cast your line and reel in a legendary fish!",
            },
            {
                "name": "Fortnite",
                "url": "",
                "desc": "Fortnite is a Multiplayer Online Game.",
            },
            {
                "name": "Penalty Kick Online",
                "url": "https://www.coolmathgames.com/0-penalty-kick-online/play",
                "desc": "Hit a screamer into the top corner in Penalty Kick Online. Take your skills online, earn XP, level up, and become world champion.",
            },
            {
                "name": "Idle Breakout",
                "url": "https://www.coolmathgames.com/0-idle-breakout/play",
                "desc": "Build the ultimate brick-busting machine to destroy billions of bricks. Idle breakout combines classic brick breaking with an insanely addicting idle loop.",
            },
            {
                "name": "8 pool",
                "url": "https://www.coolmathgames.com/0-8-ball-pool/play",
                "desc": "Take your skills online and sink the 8 ball!",
            },
            {
                "name": "Chess.com",
                "url": "https://chess.com",
                "desc": "Play Chess against the computer or your friends!",
            },
            {
                "name": "checkers",
                "url": "https://www.coolmathgames.com/0-checkers/play",
                "desc": "Play Checkers against the computer or your friends!",
            },
            {
                "name": "hexanaut.io",
                "url": "https://www.coolmathgames.com/0-hexanaut-io/play",
                "desc": "Rank up & unlock skins!",
            },
            {
                "name": "snake",
                "url": "https://www.google.com/fbx?fbx=snake_arcade",
                "desc": "Snake is a sub-genre of action video games where the player maneuvers the end of a growing line, often themed as a snake. The player must keep the snake from colliding with both other obstacles and itself, which gets harder as the snake lengthens.",
            },
            {
                "name": "bloxorz",
                "url": "https://www.coolmathgames.com/0-bloxorz/play",
                "desc": "Flip the block over and over to get it in the hole.",
            },
            {
                "name": "Curve Ball 3D",
                "url": "https://www.coolmathgames.com/0-curve-ball-3d/play",
                "desc": "Bounce, curve, and score!",
            },
            {
                "name": "basketball stars",
                "url": "https://www-ig-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/basketballlegendunblocked/basketball_stars.xml",
                "desc": "",
            },
            {
                "name": "shellshock.io",
                "url": "https://shellshock.io/;",
                "desc": "",
            }
        ]
        cardArr3.sort(function(a, b) {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          // sort in an ascending order
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
          cardArr3.forEach(function(arrayItem) {

                   //cardArr.push(arrayItem.name);
                   var shhh = arrayItem.url;
                   let name2 = arrayItem.name;
                   let check = arrayItem.extra;
                   if (check = "undefined"){
                    arrayItem.extra = "";
                   }
                   else{
                    console.log(arrayItem.extra)
                   }
                   document.getElementById("all").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'></span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick="var url2 = '${shhh}';gamelaunch(url2);"class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;  
                } );
    }       
    }, .0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001);

    // End Of Cards //

