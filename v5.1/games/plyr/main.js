

/* Please ❤ this if you like it! */
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "http://code.jquery.com/jquery-2.2.1.min.js";

// Then bind the event to the callback function.
// There are several events for cross browser compatibility.
script.onreadystatechange = handler;
script.onload = handler;

// Fire the loading
head.appendChild(script);

function handler(){
   console.log('jquery added :)');
}


  //Page cursors

  document.getElementsByTagName("body")[0].addEventListener("mousemove", function (n) {
    t.style.left = n.clientX + "px",
    t.style.top = n.clientY + "px",
    e.style.left = n.clientX + "px",
    e.style.top = n.clientY + "px",
    i.style.left = n.clientX + "px",
    i.style.top = n.clientY + "px";
  });
  var t = document.getElementById("cursor"),
  e = document.getElementById("cursor2"),
  i = document.getElementById("cursor3");
  function n(t) {
    e.classList.add("hover"), i.classList.add("hover");
  }
  function s(t) {
    e.classList.remove("hover"), i.classList.remove("hover");
  }
  s();
  for (var r = document.querySelectorAll(".hover-target"), a = r.length - 1; a >= 0; a--) {if (window.CP.shouldStopExecution(0)) break;
    o(r[a]);
  }window.CP.exitedLoop(0);
  function o(t) {
    t.addEventListener("mouseover", n), t.addEventListener("mouseout", s);
  }

  //Navigation

  var app = function () {
    var body = undefined;
    var menu = undefined;
    var menuItems = undefined;
    var init = function init() {
      body = document.querySelector('body');
      menu = document.querySelector('.menu-icon');
      menuItems = document.querySelectorAll('.nav__list-item');
      applyListeners();
    };
    var applyListeners = function applyListeners() {
      menu.addEventListener('click', function () {
        return toggleClass(body, 'nav-active');
      });
    };
    var toggleClass = function toggleClass(element, stringClass) {
      if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
    };
    init();
  }();


  //Switch light/dark

  $("#switch").on('click', function () {
    if ($("body").hasClass("light")) {
      $("body").removeClass("light");
      $("#switch").removeClass("switched");
    } else
    {
      $("body").addClass("light");
      $("#switch").addClass("switched");
    }
  });
