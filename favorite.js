const BASE_URL = "https://movie-list.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const dataPanel = document.querySelector("#data-panel");
const submitForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
console.log(movies)

function renderMovieList(data) {
  let rawHtml = "";
  data.forEach((item) => {
    rawHtml += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top" alt="Movie Poster" />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
      }">
                  More
                </button>
                <button class="btn btn-info btn-remove-favorite" data-id="${item.id
      }">X</button>
              </div>
            </div>
          </div>
        </div>`;

    dataPanel.innerHTML = rawHtml;
  });
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-Image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

}

function removeFromFavorite(id) {
  if (!movies || !movies.length) return

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  //刪除該筆電影
  movies.splice(movieIndex, 1)

  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)
}

renderMovieList(movies)

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});