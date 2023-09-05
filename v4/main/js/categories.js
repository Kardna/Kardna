function Games(){
    document.getElementById("gameframe").src="/v4/games";
    }
function Search(){
    let site1 = getCurrentURL();
    var name = new URL(site1).host;
    console.log(name);
    var d = atob("aHR0cHM6Ly8=");
    var u = url;
    var bs = atob("L3V2Lmh0bWwjYUhSMGNITTZMeTkzZDNjdVoyOXZaMnhsTG1OdmJTOD0=");
    const encodedData = "WyJrYXJkbmE0bGlmZS5jZiIsImthcmRuYTRsaWZlLmdhIiwia2FyZG5hNGxpZmUuZ3EiLCJrYXJkbmE0bGlmZS5tbCIsImthcmRuYTRsaWZlLnRrIiwia2FyZG5hLmNmIiwia2FyZG5hLm1sIiwia2FyZG5hLnh5eiIsInJpcGthcmRuYS5jZiIsInJpcGthcmRuYS5tbCIsInJpcGthcmRuYS50ayIsInJpcGthcmRuYS5ncSIsInJpcGthcmRuYS5nYSIsInJpcHJpcGthcmRuYS5nYSIsInJpcHJpcGthcmRuYS5ncSIsInJpcHJpcGthcmRuYS50ayIsInJpcHJpcGthcmRuYS5tbCIsInJpcHJpcGthcmRuYS5jZiIsInRleGFzZmVldC5nYSJd"; // Encoded data
    const decodedString = atob(encodedData);
    const myArray = JSON.parse(decodedString);
    const myVariable = name;
    const supduud = "YmcubWthcmRuYS5kZQ=="
    const okduud = atob(supduud)
    if (myArray.includes(myVariable)) {
        var url = 'bg.' + name;
    } else {
        console.log("Its working!!!")
        var url = okduud;
    }
    function getCurrentURL () {
    return window.location.href
    }
    var google = d + url + bs
    document.getElementById("gameframe").src = google;
}
function Apps(){
        document.getElementById("gameframe").src="./game_flash.html";
}
function Consoles() {
    document.getElementById("gameframe").src="../consoles/";
}
function Custom(){
    
}