async function getMovies(title) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${title}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const movies = await response.json();
    return movies;
}

getMovies()