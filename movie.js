const baseUrl = 'https://movie-list.alphacamp.io'
const indexUrl = baseUrl + '/api/v1/movies/'
const postUrl = baseUrl + '/posters/'
const movies = []

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')

axios.get(indexUrl)
  .then(function (response) {
    // handle success
    console.log(response.data.results)
    //(...)展開運算子，將每一元素展開，中間用逗號分隔，push內可放無限組參數，再依序推進去
    movies.push(...response.data.results) 
    console.log(movies)
    showMovieList(movies)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

// 監聽More Button
dataPanel.addEventListener('click', event => {
  if(event.target.matches('.btn-show-movie')){
    console.log(event.target)
    showMoreModal(event.target)
  }
})

// Render Movie
function showMovieList(data){
  let movieList = ''
  data.forEach((item) => {
    movieList += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card" data-id=${item.id}>
          <img
            src=${postUrl + item.image}
            class="card-img-top" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal">More</button>
            <button class="btn btn-info btn-add-favorite">+</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = movieList
}
// show More Modal
function showMoreModal(data){
  let post = data.parentElement.parentElement.children[0].src
  let title = data.parentElement.parentElement.children[1].children[0].innerText
  let movieId = data.parentElement.parentElement.dataset.id
  
  axios.get(indexUrl+movieId)
  .then(function (response) {
    // handle success
    console.log(response.data.results)
    let desc = response.data.results.description
    console.log(desc)
    let date = response.data.results.release_date
    showMovieModal()
    function showMovieModal(){
      let modalcontent = ''
      modalcontent = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">${title}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-6" id="movie-modal-image">
                <img
                  src=${post}
                  class="card-img-top" alt="Movie Poster" />
              </div>
              <div class="col-6">
                <p><em id="movie-modal-date">${date}</em></p>
                <p id="movie-modal-description">${desc}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>`
      movieModal.innerHTML = modalcontent
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}