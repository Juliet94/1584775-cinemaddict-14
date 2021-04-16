import MenuView from './view/menu';
import UserRatingView from './view/user-rating';
import SortView from './view/sort';
import FilmsListView from './view/films-list';
import FilmCardView from './view/film-card';
import ButtonShowMoreView from './view/button-show-more';
import FilmsListExtraView from './view/films-list-extra';
import FooterStatisticsView from './view/footer-statistics';
import PopupView from './view/popup';
import CommentView from './view/comment';
import NoFilmView from './view/no-film';

import {generateFilmCard} from './mock/film-card';
import {render, remove, RenderPosition} from './utils/render';
import {getCommentLength} from './utils/common';
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

const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new UserRatingView(userRank));
render(siteMainElement, new MenuView(filters));
render(siteMainElement, new SortView());

const renderPopup = (filmCard) => {
  const popupElement = new PopupView(filmCard);

  render(siteFooterElement, popupElement, RenderPosition.AFTERBEGIN);

  siteBodyElement.classList.add('hide-overflow');

  const commentListElement = popupElement.getElement().querySelector('.film-details__comments-list');

  for (let i = 0; i < getCommentLength(filmCard.comments); i++) {
    render(commentListElement, new CommentView(filmCard.comments[i]));
  }

  const removePopup = () => {
    siteBodyElement.classList.remove('hide-overflow');
    remove(popupElement);
  };

  const onEscButtonClose = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      removePopup();
      document.removeEventListener('keydown', onEscButtonClose);
    }
  };

  popupElement.setClickHandler(removePopup);
  document.addEventListener('keydown', onEscButtonClose);
};

const renderFilms = (filmsList) => {

  render(siteMainElement, filmsList);

  const filmsListElement = filmsList.querySelector('.films-list');
  const filmsListContainerElement = filmsList.querySelector('.films-list__container');

  for (let i = 0; i < TaskCount.PER_STEP; i++) {
    const filmCard = new FilmCardView(filmCards[i]);
    render(filmsListContainerElement, filmCard);
    filmCard.setClickHandler(renderPopup);
  }

  if (filmCards.length > TaskCount.PER_STEP) {
    let renderedFilmCount = TaskCount.PER_STEP;

    const buttonShowMoreComponent = new ButtonShowMoreView();

    render(filmsListElement, buttonShowMoreComponent);

    buttonShowMoreComponent.setClickHandler(() => {
      filmCards
        .slice(renderedFilmCount, renderedFilmCount + TaskCount.PER_STEP)
        .forEach((filmCard) => {
          const newFilmCard = new FilmCardView(filmCard);
          render(filmsListContainerElement, newFilmCard);
          newFilmCard.setClickHandler(renderPopup);
        });

      renderedFilmCount += TaskCount.PER_STEP;

      if (renderedFilmCount >= filmCards.length) {
        remove(buttonShowMoreComponent);
      }
    });
  }
};

const renderExtraFilms = () => {

  const filmsElement = siteMainElement.querySelector('.films');

  render(filmsElement, new FilmsListExtraView(Title.RATE, AdditionalClass.RATED));
  render(filmsElement, new FilmsListExtraView(Title.COMMENT, AdditionalClass.COMMENTED));

  const filmsListRatedElement = filmsElement.querySelector('.films-list__container--rated');
  const filmsListCommentedElement = filmsElement.querySelector('.films-list__container--commented');

  for (let i = 0; i < TaskCount.EXTRA; i++) {
    const filmCard = new FilmCardView(filmCards[i]);
    render(filmsListRatedElement, filmCard);
    filmCard.setClickHandler(renderPopup);
  }

  for (let i = 0; i < TaskCount.EXTRA; i++) {
    const filmCard = new FilmCardView(filmCards[i]);
    render(filmsListCommentedElement, filmCard);
    filmCard.setClickHandler(renderPopup);
  }
};

const filmsCatalog = new FilmsListView();

if (filmCards.length !== 0) {
  renderFilms(filmsCatalog.getElement());
  renderExtraFilms();
} else {
  render(siteMainElement, new NoFilmView());
}

render(siteFooterElement, new FooterStatisticsView(filmCards.length));
