const baseUrl = 'https://movie-list.alphacamp.io'
const indexUrl = baseUrl + '/api/v1/movies/'
const postUrl = baseUrl + '/posters/'
const movies = JSON.parse(localStorage.getItem('FavoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')

showMovieList(movies)


// 監聽More Button以及Delete Button
  dataPanel.addEventListener('click', function onPanelClick(event){
    if (event.target.matches('.btn-show-movie')){
      showMovieModal(event.target.dataset.id)
    }else if(event.target.matches('.btn-delete-favorite')){
      deleteFavorite(Number(event.target.dataset.id))
    }
  })


// Render Movie
function showMovieList(data){
  let movieList = ''
  data.forEach((item) => {
    movieList += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src=${postUrl + item.image}
            class="card-img-top" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-delete-favorite" data-id="${item.id}">x</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = movieList
}

// showMovieModal
function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDesc = document.querySelector('#movie-modal-description')

  axios.get(indexUrl+id)
  .then(function (response) {
    // handle success
    const data = response.data.results 
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDesc.innerText = data.description
    modalImage.innerHTML = `<img src=${postUrl + data.image} class="img-fluid" alt="">`
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

// 由localStorage移除最愛清單
function deleteFavorite(id){
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex,1)
  showMovieList(movies)
  // 將新資料存回localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
}