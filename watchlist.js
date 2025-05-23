import { watchlist } from "./data";
const movieListContainer = document.getElementById('movie-list')

document.addEventListener('click', (event) => {
    if (event.target.dataset.id) {
        const movieId = event.target.dataset.id
        removeFromWatchlist(movieId)

        window.location.reload()
        
    }
})

function removeFromWatchlist(movieId) {
    const movieIndex = watchlist.findIndex((item) => item.imdbID === movieId)
    if (movieIndex !== -1) {
        watchlist.splice(movieIndex, 1)
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }
}

async function renderWatchList(movies) {
    movieListContainer.innerHTML = ''
    console.log(movies)
    
    const listHTMLPromises = movies.map(async (movie) => {
        
        return `
        <div class="movie-item">
            <div class="poster-container">
                <img src="${movie.Poster}" alt="${movie.Title}">
            </div>
   
            <div class="info-container">
                <div class="rating">
                    <h3>${movie.Title}</h3>
                    <div>
                        <i class="fa-solid fa-star" style="color:#FEC654;"></i>
                        <span>${movie.imdbRating}</span>
                    </div>
                </div>
                <div class="details">
                    <p class="runtime">${movie.Runtime}</p>
                    <p class="genre">${movie.Genre}</p>
                    <div class="list-container">
                        <i class="fa-solid fa-circle-minus"></i> 
                        <button class="watchlist-btn" data-id="${movie.imdbID}">Remove</button>
                    </div>
                </div>
                <div class="summary">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </div>`
    })

    Promise.all(listHTMLPromises).then((listHTML) => {
        movieListContainer.innerHTML = listHTML.join('')
    })
}

if (watchlist.length) {
    await renderWatchList(watchlist)
    document.querySelector('main').style.justifyContent = 'flex-start'
}

// movieListContainer.innerHTML = `
//             <p class="empty-list">Your watchlist is looking a little empty...</p>
//             <div class="list-container">
                    
//                 <a class="navigate" href="index.html"><span><i class="fa-solid fa-circle-plus"></i></span>Lets add some movies</a>
//             </div> 
//         `