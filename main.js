const API_KEY = '5cde0df'; // Use your OMDb API Key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

let ticketCount = 0; // Keep track of added tickets
let favoriteCount = 0; // Keep track of favorite movies

document.addEventListener("DOMContentLoaded", function () {
    fetchMovies("Action");

    document.querySelector('.search-bar button').addEventListener('click', () => {
        const searchQuery = document.querySelector('.search-bar input').value.trim();
        if (searchQuery) {
            fetchMovies(searchQuery);
        }
    });

    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', () => {
            fetchMovies(category.textContent);
        });
    });

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("purchase-button")) {
            handleTicketPurchase(e.target);
        }
    });

    // Add slider functionality
    document.getElementById("next").addEventListener("click", () => slideMovies("next"));
    document.getElementById("prev").addEventListener("click", () => slideMovies("prev"));
});

// Function to fetch movies from OMDb API
async function fetchMovies(searchQuery) {
    try {
        const response = await fetch(`${API_URL}&s=${searchQuery}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            document.getElementById('movie-slider').innerHTML = "<h3>No results found.</h3>";
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Function to display movies dynamically
function displayMovies(movies) {
    const movieSlider = document.getElementById('movie-slider');
    movieSlider.innerHTML = ''; 

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-slide');
        movieItem.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "images/default-poster.jpg"}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <button class="purchase-button">Buy Ticket <span class="ticket-icon" style="display: none;">✔️</span></button>
                <span class="favorite-icon" onclick="toggleFavorite(this)">❤️</span>
            </div>
        `;
        movieSlider.appendChild(movieItem);
    });
}

// Function to handle ticket purchase
function handleTicketPurchase(button) {
    let ticketIcon = button.querySelector(".ticket-icon");

    if (ticketIcon.style.display === "none" || ticketIcon.style.display === "") {
        ticketIcon.style.display = "inline"; // Show icon
        button.style.backgroundColor = "green"; // Change button color
        button.innerHTML = 'Added <span class="ticket-icon">✔️</span>';
        ticketCount++;
    } else {
        ticketIcon.style.display = "none"; // Hide icon
        button.style.backgroundColor = "#e94560"; // Reset button color
        button.innerHTML = 'Buy Ticket <span class="ticket-icon" style="display: none;">✔️</span>';
        ticketCount--;
    }

    updateTicketCount();
}

// Function to toggle favorite status and count favorites
function toggleFavorite(icon) {
    icon.classList.toggle('active');

    let favoriteCountElement = document.getElementById("favorite-counter");
    
    // Ensure favorite counter exists
    if (!favoriteCountElement) {
        console.error("Element with ID 'favorite-counter' not found.");
        return;
    }

    // Get current count safely
    let favoriteCount = parseInt(favoriteCountElement.textContent.replace(/\D/g, "")) || 0;

    // Update count based on class state
    favoriteCount += icon.classList.contains('active') ? 1 : -1;

    // Ensure count doesn't go negative
    favoriteCount = Math.max(favoriteCount, 0);

    // Update display
    favoriteCountElement.textContent = `Favorites: ${favoriteCount}`;
}


// Function to update ticket count display
function updateTicketCount() {
    document.getElementById("ticket-counter").textContent = `Tickets: ${ticketCount}`;
}

// Function to implement slider movement
function slideMovies(direction) {
    const slider = document.getElementById("movie-slider");
    const scrollAmount = 300; // Adjust based on movie card width

    if (direction === "next") {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    } else {
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
}
