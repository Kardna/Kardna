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
                "name": "Roblox",
                "url": "https://now.gg/play/roblox-corporation/5349/roblox",
                "desc": "An online game platform and game creation system.",
            }, 
            {
                "name": "Retro Bowl",
                "url": "https://vtn5c31dcjtimmb9o2lm882bk13i56hh-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://274079163-174037128449362058.preview.editmysite.com/uploads/b/139890129-899796311729593176/files/rtbl.xml&container=enterprise&view=default&lang=en&country=ALL&sanitize=0&v=47de4fda4ad4448b&libs=core&mid=88&parent=https://sites.google.com/site/unblockedgame76/retrobowl#st=e%3DAIHE3cDyozo9x%252FN9wMuEvbPFc%252B3xMKv3kcoVLA9avoMO5VQNCII429OV%252B5NB038VwhOY5Ht567auiLNC4IpAMCvNwl5%252FzBD9DbkBFDJoEkB%252BPa3E2AKFvmO0Bpvmay%252BFKwQ%252FQN6C6HRk%26c%3Denterprise&rpctoken=8154240860593526676",
                "desc": "HTML5",
            }, 
            {
                "name": "Slope",
                "url": "/games/slope",
                "desc": "",
            }, 
        ]

        var cardArr3 = [
            {
                "name": "2048",
                "url": "/games/2048",
                "desc": "",
            },            {
                "name": "Astray",
                "url": "/games/astray",
                "desc": "",
            },  
            {
                "name": "Tomb of the Mask",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@4487c13b114e3b97c0d1e18dd381193bf62175f5/d5fuh3d/tomb_of_the_mask.xml",
                "desc": "",
            },  
            {
                "name": "2048 Cupcakes",
                "url": "https://0x0800.github.io/2048-CUPCAKES/",
                "desc": "",
            },
            {
                "name": "Penalty Challenge Multiplayer",
                "url": "https://html5.gamemonetize.co/czy29ldafw7pdecjo7irqipcld83ovn1/?gd_sdk_referrer_url=https%253A%252F%252Fdoodoo.love%252Fpenalty-challenge-multiplayer-game",
                "desc": "",
            },
            {
                "name": "Penalty shooters 2",
                "url": "https://html5.gamedistribution.com/571b9df027e449f78e3869ba19658754/?gd_sdk_referrer_url=https://penaltyshooters2.com",
                "desc": "",
            },
            {
                "name": "Papa's Freezeria",
                "url": "https://dffve3q5is4huusnmos6kv7n9mthc3vk-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://729483016-359174802648164068.preview.editmysite.com/uploads/b/139890129-569829031530007438/files/pf.xml",
                "desc": "",
            },
            {
                "name": "Papa's Pizzeria",
                "url": "https://0scl04omv9lhemvauk2tc5g284ba2o3p-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%252Fpapa-s-pizzeria.xml",
                "desc": "",
            },
            {
                "name": "Papa's Sushiria",
                "url": "https://isgames.github.io/papassushiria/",
                "desc": "",
            },
            {
                "name": "Papa's Wingeria",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fpapa-s-wingeria.xml",
                "desc": "",
            },
            {
                "name": "Basketball Legends",
                "url": "https://script.google.com/macros/s/AKfycbw2PBCxg0orOBJVxFwjwpJ5Nt3R6oPh4bNnujiA_dYKOMXIa7k/exec",
                "desc": "",
            },
            {
                "name": "Crossy Road",
                "url": "https://www-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/s011h5fk/crossy-road.xml",
                "desc": "",
            },
            {
                "name": "DuckLife 5",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fduck-life-5.xml",
                "desc": "",
            },
            {
                "name": "DuckLife: Treasure Hunt",
                "url": "https://gamefilez.mofunzone.com/gamefilez/duck-life-games/ducklifetreasurehunt/index.html",
                "desc": "",
            },
            {
                "name": "DuckLife Space",
                "url": "https://www.mathplayground.com/duck5/index.html",
                "desc": "",
            },
            {
                "name": "Duck Life: Battle",
                "url": "https://f.kbhgames.com/2018/09/duck-life-battle/",
                "desc": "",
            },
            {
                "name": "Duck Life: Adventure",
                "url": "https://gamefilez.mofunzone.com/gamefilez/duck_life_adventure/",
                "desc": "",
            },
            {
                "name": "Soccer Skills Euro Cup",
                "url": "https://html5.gamedistribution.com/899c82ac71ba4dd5a571fc9bc35f55f8/",
                "desc": "",
            },
              {
                "name": "Breaklock",
                "url": "/games/breaklock",
                "desc": "",
            },            {
                "name": "btd4",
                "url": "/games/btd4",
                "desc": "",
            },
            {
                "name": "Chroma",
                "url": "/games/chroma",
                "desc": "",
            },            {
                "name": "Cookie Clicker",
                "url": "/games/cookie",
                "desc": "",
            },            {
                "name": "Cubefield",
                "url": "/games/cubefield",
                "desc": "",
            },            {
                "name": "Dinosour Game",
                "url": "/games/dinosaur",
                "desc": "",
            },            {
                "name": "Doodle Jump",
                "url": "/games/doodle-jump",
                "desc": "",
            },            {
                "name": "Ducklife",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@1036762f19f81e71d8caf90f96ecb17c2543ea40/hjpqx4/duck-life.xml",
                "desc": "",
            },            {
                "name": "Ducklife 2",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@db7c558f6d366da74fcbbf98407d81120c76221e/0aynf57j/duck-life-2.xml",
                "desc": "",
            },
            {
                "name": "Ducklife 3",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@07697277b06353fcdb759699d0c8b5f2f9303975/lft6d3g/ducklife-3.xml",
                "desc": "",
            },  
            {
                "name": "Ducklife 4",
                "url": "https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fduck-life-4.xml",
                "desc": "",
            },    {
                "name": "2048 Flappy",
                "url": "/games/flappy-2048",
                "desc": "",
            },            {
                "name": "Flappy Bird",
                "url": "/games/flappybird",
                "desc": "",
            },            {
                "name": "Geometry Dash",
                "url": "/games/geometry",
                "desc": "Scratch",
            },            {
                "name": "Gopher Kart",
                "url": "/games/gopher-kart",
                "desc": "",
            },            {
                "name": "HexGL",
                "url": "/games/hexgl",
                "desc": "",
            },            {
                "name": "Minecraft Classic",
                "url": "/games/mc-classic",
                "desc": "",
            },
            {
                "name": "Microft Flight Sim",
                "url": "/games/microsoft-flight-simulator",
                "desc": "HTML",
            },            {
                "name": "Pacman",
                "url": "/games/pacman",
                "desc": "",
            },            {
                "name": "Radius Raid",
                "url": "/games/radius-raid",
                "desc": "",
            },            {
                "name": "Retro Bowl",
                "url": "https://vtn5c31dcjtimmb9o2lm882bk13i56hh-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://274079163-174037128449362058.preview.editmysite.com/uploads/b/139890129-899796311729593176/files/rtbl.xml&container=enterprise&view=default&lang=en&country=ALL&sanitize=0&v=47de4fda4ad4448b&libs=core&mid=88&parent=https://sites.google.com/site/unblockedgame76/retrobowl#st=e%3DAIHE3cDyozo9x%252FN9wMuEvbPFc%252B3xMKv3kcoVLA9avoMO5VQNCII429OV%252B5NB038VwhOY5Ht567auiLNC4IpAMCvNwl5%252FzBD9DbkBFDJoEkB%252BPa3E2AKFvmO0Bpvmay%252BFKwQ%252FQN6C6HRk%26c%3Denterprise&rpctoken=8154240860593526676",
                "desc": "HTML5",
            },            {
                "name": "Ritz",
                "url": "/games/ritz",
                "desc": "",
            },            {
                "name": "Slope",
                "url": "/games/slope",
                "desc": "",
            },            {
                "name": "SM64",
                "url": "/games/sm64",
                "desc": "",
            },
            {
                "name": "Space Invaders",
                "url": "/games/spaceinvaders",
                "desc": "",
            },            {
                "name": "1v1 Soccer",
                "url": "/games/swfs/gp.html#1on1soccer",
                "desc": "",
            },            {
                "name": "Portal 2d",
                "url": "/games/swfs/gp.html#portal2d",
                "desc": "",
            },            {
                "name": "Vex3",
                "url": "/games/vex3",
                "desc": "",
            },            {
                "name": "Vex4",
                "url": "/games/vex4",
                "desc": "",
            },            {
                "name": "Vex5",
                "url": "/games/vex5",
                "desc": "",
            },
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
            },
            {
                "name": "Roblox",
                "url": "https://now.gg/play/roblox-corporation/5349/roblox",
                "desc": "An online game platform and game creation system.",
            }, 
            {
                "name": "Minecraft",
                "url": "https://now.gg/play/mojang/2534/minecraft-trial",
                "desc": "Build blocks!",
            }, 
            {
                "name": "Fifa Mobile",
                "url": "https://now.gg/play/electronic-arts/1353/fifa-soccer",
                "desc": "Play Soccer!",
            }, 
            {
                "name": "Rocket League",
                "url": "https://now.gg/play/psyonix-studios/4656/rocket-league",
                "desc": "Sideswipe",
            },
            {
                "name": "Rocket League Desktop",
                "url": "https://play.geforcenow.com/games?game-id=9bcbf5b4-c460-4091-931c-a5a2a1fd9cc2&lang=en_US&asset-id=01_fbb8002b-3a9d-49e9-bd64-9a929c5ae55f",
                "desc": "Desktop - GFN Account Required",
            },
            {
                "name": "Fortnite",
                "url": "https://play.geforcenow.com/games?game-id=46bfab06-d864-465d-9e56-2d9e45cdee0a&lang=en_US&asset-id=01_febf2f3d-9ba1-4d44-a777-f8261b05e498",
                "desc": "GFN Account Required",
            },
            {
                "name": "Subway Surfers",
                "url": "https://now.gg/play/sybo-games/4875/subway-surfers",
                "desc": "",
            },
            {
                "name": "Retro Bowl (Mobile)",
                "url": "https://now.gg/play/new-star/6391/retro-bowl",
                "desc": "",
            },
            {
                "name": "T$^#@ Race 3d",
                "url": "https://html5.gamedistribution.com/rvvASMiM/ee9d0aca859145178e7bc19530b0518b/index.html",
                "desc": "ok duud",
            },
            {
                "name": "Hole.io",
                "url": "https://hole-io.com/",
                "desc": "",
            },
            {
                "name": "Tallman Run",
                "url": "https://html5.gamedistribution.com/rvvASMiM/7980c23fbbae4af6851e01052fce3cce/index.html?gd_zone_config=eyJwYXJlbnRVUkwiOiJodHRwczovL2h0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tLzc5ODBjMjNmYmJhZTRhZjY4NTFlMDEwNTJmY2UzY2NlLyIsInBhcmVudERvbWFpbiI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidG9wRG9tYWluIjoiaHRtbDUuZ2FtZWRpc3RyaWJ1dGlvbi5jb20iLCJoYXNJbXByZXNzaW9uIjpmYWxzZSwibG9hZGVyRW5hYmxlZCI6dHJ1ZSwiaG9zdCI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidmVyc2lvbiI6IjEuNS4xNiJ9",
                "desc": "",
            },
            {
                "name": "Doodle God",
                "url": "https://html5.gamedistribution.com/rvvASMiM/cd33ecc7b752408ab44036d0c8c1b91f/index.html?gd_zone_config=eyJwYXJlbnRVUkwiOiJodHRwczovL2h0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tL2NkMzNlY2M3Yjc1MjQwOGFiNDQwMzZkMGM4YzFiOTFmLyIsInBhcmVudERvbWFpbiI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidG9wRG9tYWluIjoiaHRtbDUuZ2FtZWRpc3RyaWJ1dGlvbi5jb20iLCJoYXNJbXByZXNzaW9uIjpmYWxzZSwibG9hZGVyRW5hYmxlZCI6dHJ1ZSwiaG9zdCI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidmVyc2lvbiI6IjEuNS4xNiJ9",
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
    newer();
    all();
    //New
    function newer(){
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
    }
    //Hot
    function hot(){
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
    var combinedArr = [].concat(cardArr, cardArr2, cardArr3);
    
