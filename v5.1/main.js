// Function to create a card element
let site1 = getCurrentURL();
var name = new URL(site1).host;
console.log(name);
const encodedData = "WyJrYXJkbmEubmV0Iiwia2FyZG5hbmV0d29yay5jb20iLCJrYXJkbmEub3JnIiwia2FyZG5hLXJldml2ZS5jb20iXQ=="; // Encoded data
const decodedString = atob(encodedData); // Decode the Base64 string
const myArray = JSON.parse(decodedString); // Convert the JSON string to an array
const myVariable = name;
if (myArray.includes(myVariable)) {
    var url22 = 'bg.' + name;
} else {
    console.log("Its working!!!")
    var url22 = 'bg.kardna.net';
}
console.log(url22);
function getCurrentURL () {
return window.location.href
}
const cardData = [
{
id: 'mid-card',
rows: 1,
cols: 4,
    items: [
      { content: '2048', click: '/games/2048' },
      { content: 'Astray', click: '/games/astray' },
      { content: 'Tomb of the Mask', click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@4487c13b114e3b97c0d1e18dd381193bf62175f5/d5fuh3d/tomb_of_the_mask.xml' },
      { content: '2048 Cupcakes', click: 'https://0x0800.github.io/2048-CUPCAKES/' },
      { content: 'Penalty Challenge Multiplayer', click: 'https://html5.gamemonetize.co/czy29ldafw7pdecjo7irqipcld83ovn1/?gd_sdk_referrer_url=https%253A%252F%252Fdoodoo.love%252Fpenalty-challenge-multiplayer-game' },
      { content: 'Penalty shooters 2', click: 'https://html5.gamedistribution.com/571b9df027e449f78e3869ba19658754/?gd_sdk_referrer_url=https://penaltyshooters2.com' },
      { content: "Papa's Freezeria", click: 'https://dffve3q5is4huusnmos6kv7n9mthc3vk-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://729483016-359174802648164068.preview.editmysite.com/uploads/b/139890129-569829031530007438/files/pf.xml' },
      { content: "Papa's Pizzeria", click: 'https://0scl04omv9lhemvauk2tc5g284ba2o3p-a-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%252Fpapa-s-pizzeria.xml' },
      { content: "Papa's Sushiria", click: 'https://isgames.github.io/papassushiria/' },
      { content: "Papa's Wingeria", click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fpapa-s-wingeria.xml' },
      { content: 'Basketball Legends', click: 'https://google-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/r3tq6l1/to9d2if3dv@6a3aa6b5b121c4c1f7da6cc5bfd9e71b40f1262b/zm48hw/bs.xml' },
      { content: 'Crossy Road', click: 'https://www-sites-opensocial.googleusercontent.com/gadgets/ifr?url=https://sites.google.com/site/s011h5fk/crossy-road.xml' },
      { content: 'DuckLife 5', click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fduck-life-5.xml' },
      { content: 'DuckLife: Treasure Hunt', click: 'https://gamefilez.mofunzone.com/gamefilez/duck-life-games/ducklifetreasurehunt/index.html' },
      { content: 'DuckLife Space', click: 'https://www.mathplayground.com/duck5/index.html' },
      { content: 'Duck Life: Battle', click: 'https://f.kbhgames.com/2018/09/duck-life-battle/' },
      { content: 'Duck Life: Adventure', click: 'https://gamefilez.mofunzone.com/gamefilez/duck_life_adventure/' },
      { content: 'Soccer Skills Euro Cup', click: 'https://html5.gamedistribution.com/899c82ac71ba4dd5a571fc9bc35f55f8/' },
      { content: 'Breaklock', click: '/games/breaklock' },
      { content: 'btd4', click: '/games/btd4' },
      { content: 'Chroma', click: '/games/chroma' },
      { content: 'Cookie Clicker', click: '/games/cookie' },
      { content: 'Cubefield', click: '/games/cubefield' },
      { content: 'Dinosour Game', click: '/games/dinosaur' },
      { content: 'Doodle Jump', click: '/games/doodle-jump' },
      { content: 'Ducklife', click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@1036762f19f81e71d8caf90f96ecb17c2543ea40/hjpqx4/duck-life.xml' },
      { content: 'Ducklife 2', click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@db7c558f6d366da74fcbbf98407d81120c76221e/0aynf57j/duck-life-2.xml' },
      { content: 'Ducklife 3', click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/fr6ks8ab/vi9syd1rm@07697277b06353fcdb759699d0c8b5f2f9303975/lft6d3g/ducklife-3.xml' },
      { content: 'Ducklife 4', click: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/1ee20621-61bc-4ec8-a8ec-5e839c2e6edc%2Fduck-life-4.xml' },
      { content: '2048 Flappy', click: '/games/flappy-2048' },
      { content: 'Flappy Bird', click: '/games/flappybird' },
      { content: 'Geometry Dash', click: '/games/geometry' },
      { content: 'Gopher Kart', click: '/games/gopher-kart' },
      { content: 'HexGL', click: '/games/hexgl' },
      { content: 'Minecraft Classic', click: '/games/mc-classic' },
      { content: 'Microft Flight Sim', click: '/games/microsoft-flight-simulator' },
      { content: 'Pacman', click: '/games/pacman' },
      { content: 'Radius Raid', click: '/games/radius-raid' },
      { content: 'Retro Bowl', click: '/games/retro-bowl' },
      { content: 'Ritz', click: '/games/ritz' },
      { content: 'Slope', click: '/games/slope' },
      { content: 'SM64', click: '/games/sm64' },
      { content: 'Space Invaders', click: '/games/spaceinvaders' },
      { content: '1v1 Soccer', click: '/games/swfs/gp.html#1on1soccer' },
      { content: 'Portal 2d', click: '/games/swfs/gp.html#portal2d' },
      { content: 'Vex3', click: '/games/vex3' },
      { content: 'Vex4', click: '/games/vex4' },
      { content: 'Vex5', click: '/games/vex5' },
      { content: 'Moto x3m', click: 'https://www.coolmathgames.com/0-moto-x3m/play' },
      { content: 'Krunker', click: 'https://krunker.io' },
      { content: 'Run 3', click: 'https://www.coolmathgames.com/0-run-3/play' },
      { content: 'Tiny Fishing', click: 'https://www.coolmathgames.com/0-tiny-fishing/play;' },
      { content: 'Idle Breakout', click: 'https://www.coolmathgames.com/0-idle-breakout/play' },
      { content: '8 Ball pool', click: 'https://ubg98.github.io/8BallPool/' },
      { content: 'Chess.com', click: 'https://chess.com' },
      { content: 'checkers', click: 'https://www.coolmathgames.com/0-checkers/play' },
      { content: 'hexanaut.io', click: 'https://www.coolmathgames.com/0-hexanaut-io/play' },
      { content: 'snake', click: 'https://www.google.com/fbx?fbx=snake_arcade' },
      { content: 'bloxorz', click: 'https://www.coolmathgames.com/0-bloxorz/play' },
      { content: 'Curve Ball 3D', click: 'https://www.coolmathgames.com/0-curve-ball-3d/play' },
      { content: 'basketball stars', click: 'https://google-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/r3tq6l1/to9d2if3dv@b60a8d7ea307865b358c0f3ba78ade795aef026f/jd70s3/bl2020.xml' },
      { content: 'shellshock.io', click: 'https://shellshock.io/;' },
      { content: 'Roblox', click: 'https://now.gg/play/roblox-corporation/5349/roblox' },
      { content: 'Minecraft', click: 'https://now.gg/play/mojang/2534/minecraft-trial' },
      { content: 'Fifa Mobile', click: 'https://now.gg/play/electronic-arts/1353/fifa-soccer' },
      { content: 'Rocket League', click: 'https://now.gg/play/psyonix-studios/4656/rocket-league' },
      { content: 'Rocket League Desktop', click: 'https://play.geforcenow.com/games?game-id=9bcbf5b4-c460-4091-931c-a5a2a1fd9cc2&lang=en_US&asset-id=01_fbb8002b-3a9d-49e9-bd64-9a929c5ae55f' },
      { content: 'Fortnite', click: 'https://play.geforcenow.com/games?game-id=46bfab06-d864-465d-9e56-2d9e45cdee0a&lang=en_US&asset-id=01_febf2f3d-9ba1-4d44-a777-f8261b05e498' },
      { content: 'Subway Surfers', click: 'https://now.gg/play/sybo-games/4875/subway-surfers' },
      { content: 'Retro Bowl', click: 'https://now.gg/play/new-star/6391/retro-bowl' },
      { content: 'Hole.io', click: 'https://hole-io.com/' },
      { content: 'Tallman Run', click: 'https://html5.gamedistribution.com/rvvASMiM/7980c23fbbae4af6851e01052fce3cce/index.html?gd_zone_config=eyJwYXJlbnRVUkwiOiJodHRwczovL2h0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tLzc5ODBjMjNmYmJhZTRhZjY4NTFlMDEwNTJmY2UzY2NlLyIsInBhcmVudERvbWFpbiI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidG9wRG9tYWluIjoiaHRtbDUuZ2FtZWRpc3RyaWJ1dGlvbi5jb20iLCJoYXNJbXByZXNzaW9uIjpmYWxzZSwibG9hZGVyRW5hYmxlZCI6dHJ1ZSwiaG9zdCI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidmVyc2lvbiI6IjEuNS4xNiJ9' },
      { content: 'Doodle God', click: "https://html5.gamedistribution.com/rvvASMiM/cd33ecc7b752408ab44036d0c8c1b91f/index.html?gd_zone_config=eyJwYXJlbnRVUkwiOiJodHRwczovL2h0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tL2NkMzNlY2M3Yjc1MjQwOGFiNDQwMzZkMGM4YzFiOTFmLyIsInBhcmVudERvbWFpbiI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidG9wRG9tYWluIjoiaHRtbDUuZ2FtZWRpc3RyaWJ1dGlvbi5jb20iLCJoYXNJbXByZXNzaW9uIjpmYWxzZSwibG9hZGVyRW5hYmxlZCI6dHJ1ZSwiaG9zdCI6Imh0bWw1LmdhbWVkaXN0cmlidXRpb24uY29tIiwidmVyc2lvbiI6IjEuNS4xNiJ9"},
      { content: 'Poppy Playtime', click: "https://now.gg/play/mob-games-studio/1293/poppy-playtime",},
      { content: 'PowerWash® Simulator', click: 'https://play.geforcenow.com/games?game-id=a6a5b4a9-2eb6-4fe6-aede-4063bf32032c&lang=en_US&asset-id=01_48dca8fb-862b-4e83-af2b-c3105e9de63d'},
     // { content: '', click: ''},
    ],
},
{
id: 'low-card',
rows: 2,
cols: 3,
items: [
]
},
];

// Function to create a card element
function createCard(data) {
const cardDiv = document.createElement('div');
cardDiv.id = data.id;
cardDiv.className = 'relative rounded-xl overflow-auto p-8';

const gridDiv = document.createElement('div');
gridDiv.className = `grid grid-rows-${data.rows} grid-cols-${data.cols} gap-4 font-mono text-white text-sm text-center font-bold rounded-lg`;

data.items.forEach((item) => {
const itemDiv = document.createElement('div');
itemDiv.className = `p-4 rounded-lg shadow-lg bg-black`;
itemDiv.style = "font-family: durk; font-size: 16px;"
itemDiv.textContent = item.content;

// Add onclick event to redirect to the specified URL
itemDiv.onclick = function () {
    if (item.click.startsWith('/')) {
        window.location.href = item.click
      } else if (item.click.startsWith('http') || item.click.startsWith('www')) {
        window.location.href = "https://" + url22 + "/uv.html#" + btoa(item.click);
      } else {
        window.alert("Error, Please Contact Zenfy.")
      }
};

gridDiv.appendChild(itemDiv);
});

cardDiv.appendChild(gridDiv);
return cardDiv;
}

// Function to append cards to the game-menu
function appendCards() {
const gameMenu = document.getElementById('game-menu');
cardData.forEach((card) => {
const cardElement = createCard(card);
gameMenu.appendChild(cardElement);
});
}

// Call the function to append cards
appendCards();
