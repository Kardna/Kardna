  var url = atob("aHR0cHM6Ly9tZWRpYS5tYy1rYXJkbmEuY2YvYXBpL2dldF9zb3VyY2UvbW92aWU/aWQ9")
  var fragment = window.location.hash.substr(1);;
  var site = url + fragment
  console.log(site)
  fetch(site)
    .then(response => response.text())
    .then(data => {
      var responseObj = JSON.parse(data);
      var finalurl = responseObj.data.sources[0].file;
      console.log(finalurl);
      paa(finalurl);
    })
    .catch(error => {
      console.error('Error:', error);
    });