function Games(){
    document.getElementById("gameframe").src="/games/";
    }
function Search(){
    //getting iframed elemenet
    const iframe = document.getElementById("gameframe");
    const iWindow = iframe.contentWindow;
    const iDocument = iWindow.document;
    iDocument.body.style.backgroundColor = "black";
    const search = iDocument.getElementById('search')
    const game = iDocument.getElementById('gameslist');
    const list = iDocument.getElementById('main-games').style.display = 'none';
    setTimeout(() => {  search.id = 'search-final'; }, 100);

}
function Apps(){
        document.getElementById("gameframe").src="./game_flash.html";
}
function Cloud() {
    document.getElementById("gameframe").src="./game.html";
}
function Custom(){
    
}