let site1 = getCurrentURL();
var name = new URL(site1).host;
console.log(name);
const encodedData = "WyJrYXJkbmE0bGlmZS5jZiIsImthcmRuYTRsaWZlLmdhIiwia2FyZG5hNGxpZmUuZ3EiLCJrYXJkbmE0bGlmZS5tbCIsImthcmRuYTRsaWZlLnRrIiwia2FyZG5hLmNmIiwia2FyZG5hLm1sIiwia2FyZG5hLnh5eiIsInJpcGthcmRuYS5jZiIsInJpcGthcmRuYS5tbCIsInJpcGthcmRuYS50ayIsInJpcGthcmRuYS5ncSIsInJpcGthcmRuYS5nYSIsInJpcHJpcGthcmRuYS5nYSIsInJpcHJpcGthcmRuYS5ncSIsInJpcHJpcGthcmRuYS50ayIsInJpcHJpcGthcmRuYS5tbCIsInJpcHJpcGthcmRuYS5jZiIsInRleGFzZmVldC5nYSIsImthcmRuYS5uZXQiXQ=="; // Encoded data
const decodedString = atob(encodedData); // Decode the Base64 string
const myArray = JSON.parse(decodedString); // Convert the JSON string to an array
const myVariable = name;
if (myArray.includes(myVariable)) {
	var url = 'bg.' + name;
} else {
	console.log("Its working!!!")
	var url = 'bg.mkardna.de';
}
console.log(url);
function getCurrentURL () {
return window.location.href
}

function launch(name){
        let win = window.open('/games/plyr/')
        let temp_url2 = btoa(name);
        if (name.startsWith('http')) {
            var src = "https://" + url + "/uv.html#" + temp_url2
        } else {
            var src = name
        }
        setTimeout(function(){let iframe = win.document.createElement('iframe'); iframe.style.position = "absolute"; iframe.style.top = "0"; iframe.style.bottom = "0"; iframe.style.left = "0"; iframe.style.right = "0"; iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.style.margin = "none"; iframe.style.zIndex = "999999"; iframe.src = src; win.document.body.appendChild(iframe)}, 100); 
};