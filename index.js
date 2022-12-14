const BASE_URL = "https://movie-list.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector("#data-panel");
const submitForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const listPanel = document.querySelector("#list-panel")
const changeMode = document.querySelector("#change-mode")
const paginator = document.querySelector("#paginator")

const movies = [];
let filteredMovies = []
let currentPage = 1



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
                <button class="btn btn-info btn-add-favorite" data-id="${item.id
      }">+</button>
              </div>
            </div>
          </div>
        </div>`;

    dataPanel.innerHTML = rawHtml;
  });
}

function renderMovieListInList(data) {
  let rawHtml = "";
  dataPanel.innerHTML = ""

  data.forEach((item) => {
    rawHtml += `<li class="list-group-item d-flex justify-content-between ">${item.title}
            <div class="">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
                data-id="${item.id}">
                More
              </button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </li>`
  })
  listPanel.innerHTML = rawHtml;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-Image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalImage.innerHTML = `<div class="col-sm-8" id="movie-modal-Image">
                <img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">
              </div>`;
    modalDate.innerText = data.release_date;
    modalDescription.innerText = data.description;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === parseInt(id))

  if (list.some((movie) => movie.id === parseInt(id))) {
    return alert('????????????????????????????????????')
  } 
  
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHtml = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHtml

}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(event.target.dataset.id);
  }
});

listPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(event.target.dataset.id);
  }
});

submitForm.addEventListener("submit", function onSearhFormSubmitted(event) {
  event.preventDefault();
  let keyword = searchInput.value.trim().toLowerCase();

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  //?????????????????????????????????????????????list mode??????card mode??? ?????????submit??????????????????????????????????????????
  if (filteredMovies.length === 0) {
    return alert(`can't find any movie with your keyword: ${keyword}`);
  } else if (listPanel.innerHTML === "") {
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(1))
  } else if (dataPanel.innerHTML === "") {
    renderPaginator(filteredMovies.length)
    renderMovieListInList(getMoviesByPage(1))
  }

});

//??????????????????????????????paginator????????????????????????list mode or card mode??????render?????????????????????
//??????currentPage?????????????????????paginator???????????????????????????????????????
paginator.addEventListener("click", function onPaginatorClicked(event) {
  const page = Number(event.target.dataset.page)
  if (event.target.tagName !== 'A') {
    return
  } else if (dataPanel.innerHTML === "") {
    renderMovieListInList(getMoviesByPage(page))
    return currentPage = page
  } else if (listPanel.innerHTML === "") {
    renderMovieList(getMoviesByPage(page))
    return currentPage = page
  }


})

//???????????????????????????list mode???card mode?????????????????????????????? filtered?????????????????????????????????????????????????????????mode????????? ??????????????????????????????????????????
//??????mode???????????????currentPage?????????render????????????????????????
changeMode.addEventListener("click", function onListModeBotton(event) {
  if (event.target.id.includes("list-mode-button")) {
    dataPanel.innerHTML = ""
    renderMovieListInList(getMoviesByPage(currentPage))
  } else if (event.target.id.includes("card-mode-button")) {
    listPanel.innerHTML = ""
    renderMovieList(getMoviesByPage(currentPage))
  }
})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
    listPanel.innerHTML = ""
  })
  .catch((err) => console.log(err))