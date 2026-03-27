const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const movieList = document.getElementById("movieList");
const loading = document.getElementById("loading");
const message = document.getElementById("message");

const hero = document.querySelector(".hero");
const heroTitle = document.getElementById("heroTitle");
const heroYear = document.getElementById("heroYear");

const movieModal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

const apiKey = "dcfb25eb";

const featuredMovies = [
  "Inception",
  "Interstellar",
  "Titanic",
  "Avatar",
  "The Dark Knight",
  "Gladiator",
  "La La Land",
  "Frozen"
];

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    message.textContent = "Please enter a movie name.";
    return;
  }

  movieList.innerHTML = "";
  message.textContent = "";
  loading.classList.remove("hidden");

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`
    );
    const data = await response.json();

    loading.classList.add("hidden");

    if (data.Response === "False") {
      message.textContent = data.Error;
      return;
    }

    displayMovies(data.Search);
  } catch (error) {
    loading.classList.add("hidden");
    message.textContent = "Something went wrong. Please try again.";
    console.error(error);
  }
});

function displayMovies(movies) {
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    movieCard.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Type:</strong> ${movie.Type}</p>
    `;

    movieCard.addEventListener("click", function () {
      getMovieDetails(movie.imdbID);
    });

    movieList.appendChild(movieCard);
  });
}

async function getMovieDetails(imdbID) {
  loading.classList.remove("hidden");
  message.textContent = "";

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`
    );
    const data = await response.json();

    loading.classList.add("hidden");

    if (data.Response === "False") {
      message.textContent = "Could not load movie details.";
      return;
    }

    openModal(data);
  } catch (error) {
    loading.classList.add("hidden");
    message.textContent = "Something went wrong while loading details.";
    console.error(error);
  }
}

function openModal(movie) {
  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  modalBody.innerHTML = `
    <div class="modal-movie">
      <img src="${poster}" alt="${movie.Title}">
      <div class="modal-info">
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
      </div>
    </div>
  `;

  movieModal.classList.remove("hidden");
}

function closeMovieModal() {
  movieModal.classList.add("hidden");
}

closeModal.addEventListener("click", closeMovieModal);

movieModal.addEventListener("click", function (event) {
  if (event.target === movieModal) {
    closeMovieModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !movieModal.classList.contains("hidden")) {
    closeMovieModal();
  }
});

async function loadFeaturedMovie(title) {
  try {
    hero.classList.add("fade-out");

    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      setTimeout(() => {
        const poster =
          data.Poster !== "N/A"
            ? data.Poster
            : "https://via.placeholder.com/1200x600?text=No+Image";

        hero.style.backgroundImage = `url('${poster}')`;
        heroTitle.textContent = data.Title;
        heroYear.textContent = `${data.Year} • ${data.Genre}`;
        hero.classList.remove("fade-out");
      }, 500);
    }
  } catch (error) {
    console.error("Featured movie error:", error);
  }
}

let featuredIndex = 0;

function startFeaturedSlider() {
  loadFeaturedMovie(featuredMovies[featuredIndex]);

  setInterval(() => {
    featuredIndex = (featuredIndex + 1) % featuredMovies.length;
    loadFeaturedMovie(featuredMovies[featuredIndex]);
  }, 4000);
}

startFeaturedSlider();