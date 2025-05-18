const apikey = import.meta.env.VITE_OMDB_API_KEY;


async function getMovie(title) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${title}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const movie = await response.json();
    return movie;
}

async function getMoviesByYear(year) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&y=${year}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const movies = await response.json();
    return movies;
}

function renderWatchList() {
    
}