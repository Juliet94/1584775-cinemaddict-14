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
import {generateFilmCard} from './mock/film-card';
import {getCommentLength, render, RenderPosition} from './utils';
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

render(siteHeaderElement, new UserRatingView(userRank).getElement());
render(siteMainElement, new MenuView(filters).getElement());
render(siteMainElement, new SortView().getElement());
render(siteMainElement, new FilmsListView().getElement());

const filmsElement = siteMainElement.querySelector('.films');
const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

const createPopup = (filmCard) => {
  const popupElement = new PopupView(filmCard);

  render(siteFooterElement, popupElement.getElement(), RenderPosition.AFTERBEGIN);

  siteBodyElement.classList.add('hide-overflow');

  const commentListElement = popupElement.getElement().querySelector('.film-details__comments-list');
  const closeButton = popupElement.getElement().querySelector('.film-details__close-btn');

  for (let i = 0; i < getCommentLength(filmCard.comments); i++) {
    render(commentListElement, new CommentView(filmCard.comments[i]).getElement());
  }

  const onClickButtonClose = (evt) => {
    evt.preventDefault();

    popupElement.getElement().remove();
    popupElement.removeElement();
    siteBodyElement.classList.remove('hide-overflow');
  };

  const onEscButtonClose = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      onClickButtonClose(evt);
      document.removeEventListener('keydown', onEscButtonClose);
    }
  };

  closeButton.addEventListener('click', onClickButtonClose);
  document.addEventListener('keydown', onEscButtonClose);
};

const addListenersOnFilmCard = (filmComponent, filmCard) => {
  const poster = filmComponent.querySelector('.film-card__poster');
  const title = filmComponent.querySelector('.film-card__title');
  const commentTitle = filmComponent.querySelector('.film-card__comments');

  poster.addEventListener('click', () => {
    createPopup(filmCard);
  });
  title.addEventListener('click', () => {
    createPopup(filmCard);
  });
  commentTitle.addEventListener('click', () => {
    createPopup(filmCard);
  });
};

for (let i = 0; i < TaskCount.PER_STEP; i++) {
  const filmCard = new FilmCardView(filmCards[i]);
  render(filmsListContainerElement, filmCard.getElement());
  addListenersOnFilmCard(filmCard.getElement(), filmCards[i]);
}

if (filmCards.length > TaskCount.PER_STEP) {
  let renderedFilmCount = TaskCount.PER_STEP;

  const buttonShowMoreComponent = new ButtonShowMoreView();

  render(filmsListElement, buttonShowMoreComponent.getElement());

  buttonShowMoreComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCount, renderedFilmCount + TaskCount.PER_STEP)
      .forEach((filmCard) => {
        const newFilmCard = new FilmCardView(filmCard);
        render(filmsListContainerElement, newFilmCard.getElement());
        addListenersOnFilmCard(newFilmCard.getElement(), filmCard);
      });

    renderedFilmCount += TaskCount.PER_STEP;

    if (renderedFilmCount >= filmCards.length) {
      buttonShowMoreComponent.getElement().remove();
      buttonShowMoreComponent.removeElement();
    }
  });
}

render(filmsElement, new FilmsListExtraView(Title.RATE, AdditionalClass.RATED).getElement());
render(filmsElement, new FilmsListExtraView(Title.COMMENT, AdditionalClass.COMMENTED).getElement());

const filmsListRatedElement = filmsElement.querySelector('.films-list__container--rated');
const filmsListCommentedElement = filmsElement.querySelector('.films-list__container--commented');

for (let i = 0; i < TaskCount.EXTRA; i++) {
  render(filmsListRatedElement, new FilmCardView(filmCards[i]).getElement());
}

for (let i = 0; i < TaskCount.EXTRA; i++) {
  render(filmsListCommentedElement, new FilmCardView(filmCards[i]).getElement());
}

render(siteFooterElement, new FooterStatisticsView(filmCards.length).getElement());
