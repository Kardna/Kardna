// Welcome To Kardna v4!
// This Code Was Made 100% Zenfy
// So If You Steal It Thats Not Pushing P
// Thanks!
// -Zenfy


// Start of Cards //
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
            {
                "name": "Moto x3m",
                "url": "motox3m();",
                "desc": "Run, skate and jump through a brand new galaxy!",
            }, 
            {
                "name": "Krunker",
                "url": "krunker();",
                "desc": "Krunker is a Multiplayer Online Game.",
            },
            {
                "name": "Run 3",
                "url": "run3();",
                "desc": "Run, skate and jump through a brand new galaxy!",
            },
            {
                "name": "Tiny Fishing",
                "url": "tinyfishing();",
                "desc": "Cast your line and reel in a legendary fish!",
            },
            {
                "name": "Fortnite",
                "url": "fortnite();",
                "desc": "Fortnite is a Multiplayer Online Game.",
            },
            {
                "name": "Penalty Kick Online",
                "url": "Hit a screamer into the top corner in Penalty Kick Online. Take your skills online, earn XP, level up, and become world champion.",
                "desc": "penaltykickonline();",
            },
            {
                "name": "Idle Breakout",
                "url": "idlebreakout();",
                "desc": "Build the ultimate brick-busting machine to destroy billions of bricks. Idle breakout combines classic brick breaking with an insanely addicting idle loop.",
            },
            {
                "name": "8 pool",
                "url": "eightpool();",
                "desc": "Take your skills online and sink the 8 ball!",
            },
            {
                "name": "Chess.com",
                "url": "chess();",
                "desc": "Play Chess against the computer or your friends!",
            },
            {
                "name": "checkers",
                "url": "checkers();",
                "desc": "Play Checkers against the computer or your friends!",
            },
            {
                "name": "hexanaut.io",
                "url": "hexanautio();",
                "desc": "Rank up & unlock skins!",
            },
            {
                "name": "snake",
                "url": "snake();",
                "desc": "Snake is a sub-genre of action video games where the player maneuvers the end of a growing line, often themed as a snake. The player must keep the snake from colliding with both other obstacles and itself, which gets harder as the snake lengthens.",
            },
            {
                "name": "bloxorz",
                "url": "bloxorz();",
                "desc": "Flip the block over and over to get it in the hole.",
            },
            {
                "name": "Curve Ball 3D",
                "url": "curveball3d();",
                "desc": "Bounce, curve, and score!",
            },
            {
                "name": "basketball stars",
                "url": "basketballstars();",
                "desc": "",
            },
            {
                "name": "shellshock.io",
                "url": "shellshockersio();",
                "desc": "",
            },
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
                   //cardArr.push(arrayItem.name);
                   let link2 = arrayItem.url;
                   let name2 = arrayItem.name;
                   document.getElementById("new").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>New</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick='${arrayItem.url}'class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;
               } );
               cardArr.forEach(function(arrayItem) {
                //cardArr.push(arrayItem.name);
                let link2 = arrayItem.url;
                let name2 = arrayItem.name;
                document.getElementById("all").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>New</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick='${arrayItem.url}'class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;
            } );
    }
    //Hot
    function hot(){
    
        var cardArr2 = [
            {
                "name": "Moto x3m",
                "url": "motox3m();",
                "desc": "Run, skate and jump through a brand new galaxy!",
            }, 
            {
                "name": "Krunker",
                "url": "krunker();",
                "desc": "Krunker is a Multiplayer Online Game.",
            },
            {
                "name": "Run 3",
                "url": "run3();",
                "desc": "Run, skate and jump through a brand new galaxy!",
            },
            {
                "name": "Curve Ball 3D",
                "url": "curveball3d();",
                "desc": "Bounce, curve, and score!",
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
                   //cardArr.push(arrayItem.name);
                   let link2 = arrayItem.url;
                   let name2 = arrayItem.name;
                   document.getElementById("hot").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>Hot 🔥</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick='${arrayItem.url}'class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;  
               } );
    }
    function all(){
        var cardArr3 = []
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
                   let link2 = arrayItem.url;
                   let name2 = arrayItem.name;
                   let check = arrayItem.extra;
                   if (check = "undefined"){
                    arrayItem.extra = "";
                   }
                   else{
                    console.log(arrayItem.extra)
                   }
                   document.getElementById("all").innerHTML += `<li><div class='game-card'><div class='game-card__front'><div class='game-card__header'><div class='game-card__cover'><div class='game-card__image-placeholder two'></div><span class='game-card__cover-badge new' aria-hiddden='true'>${arrayItem.extra}</span></div><div class='game-card__title'>${arrayItem.name}</div></div></div><div class='game-card__back'><div class='game-card__content'><div class='game-card__metadata'>${arrayItem.desc}</div><div class='game-card__buttons'><button onclick='${arrayItem.url}'class='game-card__button -play'><i class='fa fa-play' aria-hidden='true'></i>Play</button></div></div></div></div></li> `;
               } );
    }
    }, .0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001);



// End Of Cards //