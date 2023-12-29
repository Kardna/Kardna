// Time logic
function updateTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const is24HourFormat = !twelveHourFormat;
  let formattedHours = hours;
  let amPm = '';
  if (twelveHourFormat) {
    formattedHours = hours % 12 || 12;
    amPm = hours >= 12 ? 'PM' : 'AM';
  }
  const timeString = `${formattedHours}:${padZero(minutes)}:${padZero(seconds)} ${amPm}`;
  document.getElementById('time').textContent = timeString;
}

function padZero(number) {
  return (number < 10 ? '0' : '') + number;
}
let twelveHourFormat = localStorage.getItem('twelveHourFormat') === 'true';

function toggleTimeFormat() {
  twelveHourFormat = !twelveHourFormat;
  localStorage.setItem('twelveHourFormat', twelveHourFormat.toString());
  updateTime();
}
updateTime();
setInterval(updateTime, 1000);

// Fullscreen shit

const fullscreenElement = document.getElementById('fullscreen');
fullscreenElement.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  } else {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}

// settinglist basic functionalitie

document.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.getElementById("togglesettinglist");
  const settingslist = document.getElementById("settingslist");
  settingslist.style.zIndex = "9999";
  let altKeyPressed = false;

  function toggleSettingsList() {
    if (!settingslist.classList.contains("visible")) {
      settingslist.style.animation = "fadeIn 0.5s";
    }
    settingslist.classList.toggle("visible");
  }

  toggleButton.addEventListener("click", toggleSettingsList);

  document.addEventListener("keydown", function(event) {
    if (event.altKey && event.key === "s") {
      altKeyPressed = true;
      toggleSettingsList();
    }
  });

  document.addEventListener("keyup", function(event) {
    if (event.key === "Alt") {
      altKeyPressed = false;
    }
  });

  document.addEventListener("keyup", function(event) {
    if (!altKeyPressed && event.key === "s" && settingslist.classList.contains("visible")) {
      settingslist.style.animation = "fadeOut 0.5s";
      setTimeout(() => {
        settingslist.classList.remove("visible");
        settingslist.style.animation = "";
      }, 500);
    }
  });

  document.addEventListener("click", function(event) {
    if (!settingslist.contains(event.target) && !toggleButton.contains(event.target)) {
      if (settingslist.classList.contains("visible")) {
        settingslist.style.animation = "fadeOut 0.5s";
        setTimeout(() => {
          settingslist.classList.remove("visible");
          settingslist.style.animation = "";
        }, 500);
      }
    }
  });
});

window.addEventListener("load", function() {
  var loader = document.getElementById("loader");
  var content = document.getElementById("content");

  setTimeout(function() {
    loader.style.transition = "opacity 1s";
    loader.style.opacity = "0";
    content.style.display = "block";
    document.body.style.overflow = "auto";
  }, 3500);

  setTimeout(function() {
    loader.style.display = "none";
  }, 4500);
});


// Code for notifications
const notification = document.getElementById('notification');
const notifhistory = document.getElementById('notifhistory');
let notificationClickFunction = null;
let hideTimeout;

function showNotification(title, message, clickFunction) {
  const notificationTitle = notification.querySelector('.notification-title');
  const notificationMessage = notification.querySelector('.notification-message');
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;
  notification.style.display = 'block';
  notification.style.animation = 'slideIn 0.5s ease-in-out';


  const notifHistoryItem = document.createElement('div');
  notifHistoryItem.className = 'notif-history-item';
  notifHistoryItem.id = 'notification-history-block';
  notifHistoryItem.innerHTML = `<strong>${title}:</strong> ${message}`;

  const removeButton = document.createElement('button');
  removeButton.id = 'removenotifhistorybtn';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    notifHistoryItem.classList.add('removing');
    notifHistoryItem.addEventListener('transitionend', () => {
      notifhistory.removeChild(notifHistoryItem);
    });
  });

  notifHistoryItem.appendChild(removeButton);
  notifhistory.appendChild(notifHistoryItem);

  notificationClickFunction = clickFunction;

  // Clear any previous timeout and set a new one
  clearHideTimeout();
  setHideTimeout();
}

function hideNotification(event) {
  if (event) {
    event.stopPropagation();
  }
  notification.style.animation = 'slideOut 0.5s ease-in-out';
  setTimeout(() => {
    notification.style.display = 'none';
    notification.style.animation = '';
  }, 500);
}

function executeNotificationFunction() {
  if (notificationClickFunction) {
    notificationClickFunction();
  }
}

function clearHideTimeout() {
  clearTimeout(hideTimeout);
}

function setHideTimeout() {
  hideTimeout = setTimeout(() => {
    hideNotification();
  }, 3000);
}

// Example usage:
setTimeout(function() {
  showNotification("Welcome to Oasis!", "New Updates Will Be In The Future & Stay Up To Date In Our Discord!");
}, 4500);




// Panic

let currentLink = localStorage.getItem("configuredLink") || "https://classroom.google.com";

function handleKeyPress(event) {
  if (event.key === "`") {
    const linkInput = document.getElementById("linkInput");
    const newLink = linkInput.value.trim();
    if (newLink !== "") {
      currentLink = newLink;
      localStorage.setItem("configuredLink", currentLink);
    }
    window.location.href = currentLink;
  }
}

const linkInput = document.getElementById("linkInput");
linkInput.addEventListener("input", function() {
  currentLink = linkInput.value.trim();
  localStorage.setItem("configuredLink", currentLink);
});

linkInput.value = currentLink;

document.addEventListener("keydown", handleKeyPress);


const splashTexts = [
  "Just Wait A Moment For Me To Find The Page!",
  "Kardna Is Dead I Know 😒",
  "Blitz Sucks At Fort & Goes To Fish School 🤓",
];


function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

const splashTextElement = document.getElementById("splashText");
const randomIndex = getRandomIndex(splashTexts.length);
splashTextElement.textContent = splashTexts[randomIndex];



const buttons = [
  { text: "Google Classroom", title: "Google Classroom", favicon: "/media/favicons/cloak/google.png" },
  { text: "Canvas", title: "Canvas  ||  Dashboard", favicon: "/media/favicons/cloak/canvas.png" },
  { text: "Defualt Title & Favicon", title: "Oasis", favicon: "" }
];

function changeTabTitleAndFavicon(title, favicon) {
  document.title = title;
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = favicon;
  document.getElementsByTagName('head')[0].appendChild(link);

  localStorage.setItem('tabTitle', title);
  localStorage.setItem('tabFavicon', favicon);
}

const buttonContainer = document.getElementById("buttonContainer");
buttons.forEach((buttonInfo) => {
  const button = document.createElement("button");
  button.textContent = buttonInfo.text;
  button.className = "disguisebtn";
  button.addEventListener("click", () => {
    changeTabTitleAndFavicon(buttonInfo.title, buttonInfo.favicon);
  });
  buttonContainer.appendChild(button);
});

const storedTabTitle = localStorage.getItem('tabTitle');
const storedTabFavicon = localStorage.getItem('tabFavicon');
if (storedTabTitle && storedTabFavicon) {
  changeTabTitleAndFavicon(storedTabTitle, storedTabFavicon);
}

const tabTitleInput = document.getElementById("tabTitleInput");
const faviconInput = document.getElementById("faviconInput");
const uploadFavicon = document.getElementById("uploadFavicon");
const setCustomFaviconButton = document.getElementById("setCustomFavicon");

setCustomFaviconButton.addEventListener("click", () => {
  const newTitle = tabTitleInput.value.trim();
  const newFavicon = faviconInput.value.trim();

  if (newTitle && newFavicon) {
    changeTabTitleAndFavicon(newTitle, newFavicon);
  }
});


// Clockwork

    (function() {
      var clockwork = document.querySelector('.clockwork');
      var isDragging = false;
      var offset = { x: 0, y: 0 };

      clockwork.addEventListener('mousedown', function(event) {
        isDragging = true;
        offset.x = event.clientX - clockwork.offsetLeft;
        offset.y = event.clientY - clockwork.offsetTop;
      });

      document.addEventListener('mouseup', function() {
        isDragging = false;
      });

      document.addEventListener('mousemove', function(event) {
        if (isDragging) {
          clockwork.style.left = event.clientX - offset.x + 'px';
          clockwork.style.top = event.clientY - offset.y + 'px';
        }
      });

      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var date = new Date();
      var day = date.getDay();
      var formattedDate = date.toDateString();

      document.querySelector('.day').textContent = days[day];
      document.querySelector('.date').textContent = formattedDate;

      var centerButton = document.querySelector('.centerclockworkbtn');
      centerButton.addEventListener('click', function() {
        clockwork.style.top = '20%';
        clockwork.style.left = '50%';
      });

      var slider = document.querySelector('.slider');
      slider.addEventListener('input', function() {
        var value = this.value;
        clockwork.style.transform = 'translate(-50%, -50%) scale(' + (value / 100) + ')';
      });

      var colorPicker = document.querySelector('#color-picker');
      colorPicker.addEventListener('input', function() {
        var colorValue = this.value;
        var rgbValues = colorValue.split(',').map(function(item) {
          return parseInt(item.trim());
        });

        var red = rgbValues[0];
        var green = rgbValues[1];
        var blue = rgbValues[2];

        var h1Element = document.querySelector('.clockwork h1.day');
        var pElement = document.querySelector('.clockwork p.date');

        h1Element.style.color = 'rgb(' + red + ',' + green + ',' + blue + ')';
        pElement.style.color = 'rgb(' + red + ',' + green + ',' + blue + ')';
      });
    })();
    function toggleClockwork() {
      var clockworkDiv = document.querySelector(".clockwork");
      if (clockworkDiv.style.display === "none") {
        clockworkDiv.style.display = "block";
      } else {
        clockworkDiv.style.display = "none";
      }
    }

// Panic Button
      document.addEventListener("keydown", function(event) {
  if (event.key === "`") {
    const redirectURL = document.getElementById("panicInput").value;
    const finalRedirectURL = redirectURL ? redirectURL : "https://bing.com";
    window.location.href = finalRedirectURL;
  }
});


// Notification Center
document.addEventListener('DOMContentLoaded', function () {
            const notificationTrigger = document.getElementById('notificationbtn');
            const notificationCenter = document.getElementById('notification-center');

            notificationTrigger.addEventListener('click', function () {
                notificationCenter.classList.toggle('open');
                if (notificationCenter.classList.contains('open')) {
                    document.body.style.marginRight = '20%';
                } else {
                    document.body.style.marginRight = '0';
                }
            });

            document.addEventListener('click', function (event) {
                if (!notificationCenter.contains(event.target) && event.target !== notificationTrigger) {
                    notificationCenter.classList.remove('open');
                    document.body.style.marginRight = '0';
                }
            });
        });



// Future secret page will be here

/*
let typedKeys = "";

document.addEventListener("keydown", function(event) {
  typedKeys += event.key;

  if (typedKeys === "842571") {
    window.location.href = "/directories/secret.html";
  } else if (typedKeys.length > 6) {
    typedKeys = "";
  }
});
*/

