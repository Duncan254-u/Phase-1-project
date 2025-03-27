const API_KEY = '5cde0df'; // Use your OMDb API Key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// Function to fetch movies by search
async function fetchMovies(searchQuery) {
    try {
        const response = await fetch(`${API_URL}&s=${searchQuery}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            console.error("No movies found.");
            document.getElementById('movie-slider').innerHTML = "<h3>No results found.</h3>";
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Function to display movies
function displayMovies(movies) {
    const movieSlider = document.getElementById('movie-slider');
    movieSlider.innerHTML = ''; // Clear existing content

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-slide');
        movieItem.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "images/default-poster.jpg"}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <button class="purchase-button">Buy Ticket</button>
                <span class="favorite-icon" onclick="toggleFavorite(this)">❤️</span>
            </div>
        `;
        movieSlider.appendChild(movieItem);
    });
}

// Function to toggle favorite status
function toggleFavorite(icon) {
    icon.classList.toggle('active'); 
}

// Event Listener for Search
document.querySelector('.search-bar button').addEventListener('click', () => {
    const searchQuery = document.querySelector('.search-bar input').value.trim();
    if (searchQuery) {
        fetchMovies(searchQuery);
    }
});

// Fetch movies by category
document.querySelectorAll('.category').forEach(category => {
    category.addEventListener('click', () => {
        fetchMovies(category.textContent);
    });
});
