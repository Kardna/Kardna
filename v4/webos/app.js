function Card({ title, content }) {
    return (
      '<div class="card">' +
        '<h2>' + title + '</h2>' +
        '<p>' + content + '</p>' +
      '</div>'
    );
  }

  function Launcher() {
    return (
      '<div class="launcher">' +
        '<h2>Launcher</h2>' +
        '<ul>' +
          '<li><a href="#">Home</a></li>' +
          '<li><a href="#">Cards</a></li>' +
        '</ul>' +
      '</div>'
    );
  }

  function Home() {
    return (
      '<div>' +
        '<h1>Welcome to WebOS</h1>' +
      '</div>'
    );
  }

  function renderComponent(component, containerId) {
    document.getElementById(containerId).innerHTML = component();
  }

  renderComponent(Launcher, 'app');
  renderComponent(Home, 'app');