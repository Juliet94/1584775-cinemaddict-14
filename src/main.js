import {createMenuTemplate} from './view/menu';
import {createUserRatingTemplate} from './view/user-rating';
import {createFilterTemplate} from './view/filter';
import {createFilmsListTemplate} from './view/films-list';
import {createFilmCardTemplate} from './view/film-card';
import {createButtonShowMoreTemplate} from './view/button-show-more';
import {createFilmsListExtraTemplate} from './view/films-list-extra';
import {createFooterStatisticsTemplate} from './view/footer';
import {createPopupTemplate} from './view/popup';
import {createCommentTemplate} from './view/comment';
import {generateFilmCard} from './mock/film-card';
import {getCommentLength} from './utils';
import {generateFilters} from './mock/filter';
import {generateUserRank} from './mock/user-rank';

const Title = {
  RATE : 'Top rated',
  COMMENT : 'Most commented',
};

const AdditionalClass = {
  RATED : 'films-list__container--rated',
  COMMENTED : 'films-list__container--commented',
};

const TaskCount = {
  CONTENT : 23,
  EXTRA : 2,
  PER_STEP : 5,
};

const filmCards = new Array(TaskCount.CONTENT).fill().map(generateFilmCard);
const filters = generateFilters(filmCards);
const userRank = generateUserRank(filmCards);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, createUserRatingTemplate(userRank));
render(siteMainElement, createMenuTemplate(filters));
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createFilmsListTemplate());

const filmsElement = siteMainElement.querySelector('.films');
const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < TaskCount.PER_STEP; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(filmCards[i]));
}

if (filmCards.length > TaskCount.PER_STEP) {
  let renderedFilmsCount = TaskCount.PER_STEP;

  render(filmsListElement, createButtonShowMoreTemplate());
  const buttonShowMore = filmsListElement.querySelector('.films-list__show-more');

  buttonShowMore.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + TaskCount.PER_STEP)
      .forEach((filmCard) => render(filmsListContainerElement, createFilmCardTemplate(filmCard)));

    renderedFilmsCount += TaskCount.PER_STEP;

    if (renderedFilmsCount >= filmCards.length) {
      buttonShowMore.remove();
    }
  });
}

render(filmsElement, createFilmsListExtraTemplate(Title.RATE, AdditionalClass.RATED));
render(filmsElement, createFilmsListExtraTemplate(Title.COMMENT, AdditionalClass.COMMENTED));

const filmsListRatedElement = filmsElement.querySelector('.films-list__container--rated');
const filmsListCommentedElement = filmsElement.querySelector('.films-list__container--commented');

for (let i = 0; i < TaskCount.EXTRA; i++) {
  render(filmsListRatedElement, createFilmCardTemplate(filmCards[i]));
}

for (let i = 0; i < TaskCount.EXTRA; i++) {
  render(filmsListCommentedElement, createFilmCardTemplate(filmCards[i]));
}

render(siteFooterElement, createFooterStatisticsTemplate(filmCards.length));
render(siteFooterElement, createPopupTemplate(filmCards[0]), 'afterend');

const commentListElement = document.querySelector('.film-details__comments-list');

for (let i = 0; i < getCommentLength(filmCards[0].comments); i++) {
  render(commentListElement, createCommentTemplate(filmCards[0].comments[i]));
}
