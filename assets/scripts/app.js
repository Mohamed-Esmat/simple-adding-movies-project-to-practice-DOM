///////////////////////////////////////////////////////////
///////////// Constants///
///////////////////////////////////////////////////////////
// const addMovieModel = document.body.children[1];
const addMovieModal = document.getElementById('add-modal'); //This tends to have a bit better performance than querySelector().
// const startAddMovieButton = document.querySelector('header').lastElementChild;
const startAddMovieButton = document.querySelector('header button');
// const backdrop = document.body.firstElementChild;
const backdrop = document.getElementById('backdrop');
const cancelAddMovieButton = addMovieModal.querySelector('.btn--passive');
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll('input');
const entryTextSection = document.getElementById('entry-text');
const deleteMovieModal = document.getElementById('delete-modal');
const movies = [];

///////////////////////////////////////////////////////////
///////////// Functions///
///////////////////////////////////////////////////////////
const updateUI = () => {
  if (movies.length === 0) {
    entryTextSection.style.display = 'block';
  } else {
    entryTextSection.style.display = 'none';
  }
};

const closeMovieDeletionModal = () => {
  toggleBackdrop();
  deleteMovieModal.classList.remove('visible');
};

const deleteMovieHandler = (movieID) => {
  let movieIndex = 0;
  for (const movie of movies) {
    if (movie.id === movieID) {
      break;
    }
    movieIndex++;
  }
  movies.splice(movieIndex, 1);
  const listRoot = document.getElementById('movie-list');
  // listRoot.children[movieIndex].remove();
  listRoot.removeChild(listRoot.children[movieIndex]);
  closeMovieDeletionModal();
  updateUI()
};

const startDeleteMovieHandler = (movieID) => {
  deleteMovieModal.classList.add('visible');
  toggleBackdrop();
  const cancelDeletionButton = deleteMovieModal.querySelector('.btn--passive');

  // Starting from here I ma trying to solve some problem with the addEventListener [there is some conflict when i click the cancel button of the delete modal and then click the add button in the same modal]
  // I think it's happening when we delete an element from the dom and we have an EventListener listening to it
  let confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

  confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));

  confirmDeletionButton = deleteMovieModal.querySelector('.btn--danger');

  cancelDeletionButton.removeEventListener('click', closeMovieDeletionModal);
  // confirmDeletionButton.removeEventListener('click', deleteMovieHandler.bind(null, movieID));

  cancelDeletionButton.addEventListener('click', closeMovieDeletionModal);
  confirmDeletionButton.addEventListener('click', deleteMovieHandler.bind(null, movieID));
  // deleteMovie(movieID);
};

const renderNewMovieHandler = (id, title, imageUrl, rating) => {
  const newMovieELement = document.createElement('li');
  newMovieELement.className = 'movie-element';
  newMovieELement.innerHTML = `
  <div class="movie-element__image">
    <img src="${imageUrl}" alt="${title}">
  </div>
  <div class="movie-element__info">
    <h2>${title}</h2>
    <p>${rating}/5 stars</p>
  </div>
  `;
  newMovieELement.addEventListener('click', startDeleteMovieHandler.bind(null, id));
  const listRoot = document.getElementById('movie-list');
  listRoot.appendChild(newMovieELement);
};

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

const closeMovieModal = () => {
  addMovieModal.classList.remove('visible');
};

const showMovieModel = () => {
  addMovieModal.classList.add('visible');
  toggleBackdrop();
};

const clearMovieInputs = () => {
  for (const userInput of userInputs) {
    userInput.value = '';
  }
};

const cancelAddMovieHandler = () => {
  closeMovieModal();
  toggleBackdrop();
  clearMovieInputs();
};

const backdropClickHandler = () => {
  closeMovieModal();
  closeMovieDeletionModal();
  clearMovieInputs()
};

const addMovieHandler = () => {
  const titleValue = userInputs[0].value;
  const imageUrlValue = userInputs[1].value;
  const ratingValue = userInputs[2].value;

  if (
    titleValue.trim() === '' ||
    imageUrlValue.trim() === '' ||
    ratingValue.trim() === '' ||
    +ratingValue < 1 ||
    +ratingValue > 5
  ) {
    alert('Please enter valid values (rating between 1 and 5).');
    return;
  }

  const newMovie = {
    id: Math.random().toString(),
    title: titleValue,
    image: imageUrlValue,
    rating: ratingValue,
  };
  movies.push(newMovie);
  console.log(movies);
  closeMovieModal();
  toggleBackdrop();
  clearMovieInputs();
  renderNewMovieHandler(
    newMovie.id,
    newMovie.title,
    newMovie.image,
    newMovie.rating
  );
  updateUI();
};

///////////////////////////////////////////////////////////
///////////// EventListeners///
///////////////////////////////////////////////////////////
startAddMovieButton.addEventListener('click', showMovieModel);
backdrop.addEventListener('click', backdropClickHandler);
cancelAddMovieButton.addEventListener('click', cancelAddMovieHandler);
confirmAddMovieButton.addEventListener('click', addMovieHandler);
