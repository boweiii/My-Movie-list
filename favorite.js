const baseUrl = 'https://movie-list.alphacamp.io'
const indexUrl = baseUrl + '/api/v1/movies/'
const postUrl = baseUrl + '/posters/'
const movies = JSON.parse(localStorage.getItem('FavoriteMovies'))
const MOVIES_PER_PAGE = 12 //一頁顯示12筆資料
const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const paginator = document.querySelector('#paginator')
let pageNumber = 1 //預設目前頁面為1，用於刪除最愛時停留在此頁面而不重新為第一頁

showMovieList(getMoviesByPage(1))
renderPaginator(movies.length)


// 監聽More Button以及Delete Button
dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-delete-favorite')) {
    deleteFavorite(Number(event.target.dataset.id))
  }
})
// 監聽分頁器
paginator.addEventListener('click', function onPaginatorClick(event) {
  const page = Number(event.target.dataset.page)  //找目前按到頁數號碼
  // const page = event.target.innerText  //此種方法也可找到頁數
  pageNumber = page //將目前頁面設定為點選之頁數，用於刪除最愛時停留在此頁面而不重新為第一頁
  showMovieList(getMoviesByPage(page))
})


// Render Movie
function showMovieList(data) {
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
//Render pagination 依照資料量顯示對應的分頁數目
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let pages = ''
  for (page = 1; page <= numberOfPages; page++) {
    pages += `
    <li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
  }
  paginator.innerHTML = pages
}

// showMovieModal
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDesc = document.querySelector('#movie-modal-description')

  axios.get(indexUrl + id)
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
function deleteFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)
  showMovieList(getMoviesByPage(pageNumber))  //重新render目前頁面，而不是render(movies)，因為會回到第一頁內容
  renderPaginator(movies.length)
  // 將新資料存回localStorage
  localStorage.setItem('FavoriteMovies', JSON.stringify(movies))
}
function getMoviesByPage(page) {
  //計算起始 index 
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return movies.slice(startIndex, page * MOVIES_PER_PAGE)
}