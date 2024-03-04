const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTVlMzY2ZDhhZjA0YzkwM2RhZjA3NDM2OWJjYjI3NSIsInN1YiI6IjY1ZTQxNjRlYzk5ODI2MDE2MjYxNjcyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mUcPZSKYl7KNN_EqWQhg5nJajcdUcQ-5-Fc8I2gsqOw'
  }
};

let movies;

fetch('https://api.themoviedb.org/3/movie/changes?page=1', options)
  .then(response => response.json())
  .then(response => {
    // Assuming the results are in a property called 'results'
    movies = response.results;
    console.log(movies);
  })
  .catch(err => console.error(err));

