import {createMenuTemplate} from './view/menu';
import {createUserRatingTemplate} from './view/user-rating';
import {createFilterTemplate} from './view/filter';
import {createFilmsListTemplate} from './view/films-list';
import {createFilmCardTemplate} from './view/film-card';
import {createButtonShowMoreTemplate} from './view/button-show-more';
import {createFilmsListExtraTemplate} from './view/films-list-extra';
import {createFooterStatisticsTemplate} from './view/footer';
import {createPopupTemplate} from './view/popup';

const Title = {
  RATE : 'Top rated',
  COMMENT : 'Most commented',
};

const AdditionalClass = {
  RATED : 'films-list__container--rated',
  COMMENTED : 'films-list__container--commented',
};

const TaskCount = {
  CONTENT : '5',
  EXTRA : '2',
};

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, createUserRatingTemplate());
render(siteMainElement, createMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createFilmsListTemplate());

const filmsElement = siteMainElement.querySelector('.films');
const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < TaskCount.CONTENT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate());
}

render(filmsListElement, createButtonShowMoreTemplate());
render(filmsElement, createFilmsListExtraTemplate(Title.RATE, AdditionalClass.RATED));
render(filmsElement, createFilmsListExtraTemplate(Title.COMMENT, AdditionalClass.COMMENTED));

const filmsListRatedElement = filmsElement.querySelector('.films-list__container--rated');
const filmsListCommentedElement = filmsElement.querySelector('.films-list__container--commented');

for (let i = 0; i < TaskCount.EXTRA; i++) {
  render(filmsListRatedElement, createFilmCardTemplate());
}

for (let i = 0; i < TaskCount.EXTRA; i++) {
  render(filmsListCommentedElement, createFilmCardTemplate());
}

render(siteFooterElement, createFooterStatisticsTemplate());
render(siteFooterElement, createPopupTemplate(), 'afterend');
