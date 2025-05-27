import { watchlist } from './data.js'
const apikey = import.meta.env.VITE_OMDB_API_KEY
const movieListContainer = document.getElementById('movie-list')

document.addEventListener('click', (event) => {
    if (event.target.dataset.id ) {
        const movieId = event.target.dataset.id
        addToWatchlist(movieId)

        event.target.parentNode.innerHTML = '<i class="fa-solid fa-check"></i>'
    }
})

document.getElementById('search-button').addEventListener('click', async () => {
    
    const searchEl = document.getElementById('search-input')
    const title = document.getElementById('search-input').value

    try {
        if (title) {
            const movies = await getMovies(title)
            searchEl.value = ''
            
            if (movies.Response === 'True') {
                await renderWatchList(movies)
            } else {
                handleNoMoviesFound()
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
});

async function getMovies(title) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${title}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    const movies = await response.json()
    return movies
}

async function getMovieByID(id) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&i=${id}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    const movie = await response.json()
    return movie
}

function checkWatchlist() {
    console.log('checkWatchlist')
    const watchlistItems = watchlist.map((item) => item.imdbID)

    //TODO: check if the movie is in the watchlist
    const buttons = document.querySelectorAll('.watchlist-btn')
    console.log(watchlistItems)
    console.log(buttons)

    buttons.forEach((button) => {
        console.log(button.dataset.id)
        if (watchlistItems.includes(button.dataset.id)) {
            button.parentNode.innerHTML = '<i class="fa-solid fa-check"></i>'
        }
    })
}

function addToWatchlist(movieId) {
    const movie = watchlist.find((item) => item.imdbID === movieId)
    if (!movie) {
        getMovieByID(movieId).then((movie) => {
            watchlist.push(movie)
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
        })
    }
}

function handleNoMoviesFound() {
    movieListContainer.innerHTML = `
        <div class="error-item">
            <p>Unable to find what you're looking for. Please try another search</p>
        <div class="error-item">
    `
}

async function renderWatchList(movies) {
    movieListContainer.innerHTML = ''
    
    const listHTMLPromises = movies.Search.map(async (item) => {
        
        const movie = await getMovieByID(item.imdbID)

        return `
        <div class="movie-item">
            <div class="poster-container">
                <img src="${movie.Poster}" alt="${movie.Title}">
            </div>
   
            <div class="info-container">
                <div class="rating">
                    <h3>${item.Title}</h3>
                    <div>
                        <i class="fa-solid fa-star" style="color:#FEC654;"></i>
                        <span>${movie.imdbRating}</span>
                    </div>
                </div>
                <div class="details">
                    <p class="runtime">${movie.Runtime}</p>
                    <p class="genre">${movie.Genre}</p>
                    <div class="list-container">
                        <i class="fa-solid fa-circle-plus"></i>
                        <button class="watchlist-btn" data-id="${item.imdbID}">Watchlist</button>
                    </div>
                </div>
                <div class="summary">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </div>`
    })

    await Promise.all(listHTMLPromises).then((listHTML) => {
        movieListContainer.innerHTML = listHTML.join('')
    })

    //TODO: Await for the listHTMLPromises to finish before calling checkWatchlist
    checkWatchlist()
}

