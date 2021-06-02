const baseUrl = 'https://movie-list.alphacamp.io'
const indexUrl = baseUrl + '/api/v1/movies/'
const postUrl = baseUrl + '/posters/'
const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

axios.get(indexUrl)
  .then(function (response) {
    // handle success
    console.log(response.data.results)
    //(...)展開運算子，將每一元素展開，中間用逗號分隔，push內可放無限組參數，再依序推進去
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    console.log(movies)
    showMovieList(getMoviesByPage(1))
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

// 監聽Search Button
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()  //阻止瀏覽器預設行為(這邊是阻止submit所產生的自動整理頁面行為)
  const keyword = searchInput.value.trim().toLowerCase()


  //sol1
  // movies.forEach(movie => {
  //   if(movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // })
  //////////////////////////////////////////////////////

  //sol2
  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyword)
  })
  //////////////////////////////////////////////////////

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  showMovieList(getMoviesByPage(1))
  renderPaginator(filteredMovies.length)

})


// 監聽More Button以及Favorite Button
dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 監聽分頁器
paginator.addEventListener('click', function onPaginatorClick(event) {
  const page = Number(event.target.dataset.page)  //找目前按到頁數號碼
  // const page = event.target.innerText  //此種方法也可找到頁數
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
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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
// 新增最愛清單至localStorage
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('FavoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    alert('此電影已經在收藏清單中！')
  } else {
    list.push(movie)
  }

  localStorage.setItem('FavoriteMovies', JSON.stringify(list))
  console.log(list)
}

//計算第幾頁所對應的資料編號幾到幾，用slice切割每頁12筆資料
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  //計算起始 index 
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, page * MOVIES_PER_PAGE)
}