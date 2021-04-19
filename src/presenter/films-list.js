import SortView from '../view/sort';
import FilmsListView from '../view/films-list';
import FilmCardView from '../view/film-card';
import ButtonShowMoreView from '../view/button-show-more';
import FilmsListExtraView from '../view/films-list-extra';
import PopupView from '../view/popup';
import CommentView from '../view/comment';
import NoFilmView from '../view/no-film';
import {render, remove, RenderPosition} from '../utils/render';
import {getCommentLength} from '../utils/common';

const TaskCount = {
  CONTENT : 23,
  EXTRA : 2,
  PER_STEP : 5,
};

const Title = {
  RATE : 'Top rated',
  COMMENT : 'Most commented',
};

const AdditionalClass = {
  RATED : 'films-list__container--rated',
  COMMENTED : 'films-list__container--commented',
};

export default class FilmsList {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;

    this._filmsListComponent = new FilmsListView();
    this._sortComponent = new SortView();
    this._noFilmComponent = new NoFilmView();

    this._filmsListElement = this._filmsListComponent.getElement().querySelector('.films-list');
    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');
  }

  init(filmCards) {
    this._filmCards = filmCards.slice();

    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent);
  }

  _renderFilmCards() {
    for (let i = 0; i < TaskCount.PER_STEP; i++) {
      const filmCard = new FilmCardView(this._filmCards[i]);
      render(this._filmsListContainerElement, filmCard);
      filmCard.setClickHandler(this._renderPopup);
    }

    if (this._filmCards.length > TaskCount.PER_STEP) {
      this._renderButtonShowMore();
    }
  }

  _renderNoFilm() {
    render(this._filmsListContainer, this._noFilmComponent);
  }

  _renderButtonShowMore() {
    let renderedFilmCount = TaskCount.PER_STEP;

    const buttonShowMoreComponent = new ButtonShowMoreView();

    render(this._filmsListElement, buttonShowMoreComponent);

    buttonShowMoreComponent.setClickHandler(() => {
      this._filmCards
        .slice(renderedFilmCount, renderedFilmCount + TaskCount.PER_STEP)
        .forEach((filmCard) => {
          const newFilmCard = new FilmCardView(filmCard);
          render(this._filmsListContainerElement, newFilmCard);
          newFilmCard.setClickHandler(this._renderPopup);
        });

      renderedFilmCount += TaskCount.PER_STEP;

      if (renderedFilmCount >= this._filmCards.length) {
        remove(buttonShowMoreComponent);
      }
    });
  }

  _renderFilmsList() {

    if (this._filmCards.length !== 0) {
      this._renderSort();
      render(this._filmsListContainer, this._filmsListComponent);
      this._renderFilmCards();
      this._renderFilmsListExtra();
    } else {
      this._renderNoFilm();
    }
  }

  _renderFilmsListExtra() {

    this._filmsElement = this._filmsListContainer.querySelector('.films');

    render(this._filmsElement, new FilmsListExtraView(Title.RATE, AdditionalClass.RATED));
    render(this._filmsElement, new FilmsListExtraView(Title.COMMENT, AdditionalClass.COMMENTED));

    const filmsListRatedElement = this._filmsElement.querySelector('.films-list__container--rated');
    const filmsListCommentedElement = this._filmsElement.querySelector('.films-list__container--commented');

    for (let i = 0; i < TaskCount.EXTRA; i++) {
      const filmCard = new FilmCardView(this._filmCards[i]);
      render(filmsListRatedElement, filmCard);
      filmCard.setClickHandler(this._renderPopup);
    }

    for (let i = 0; i < TaskCount.EXTRA; i++) {
      const filmCard = new FilmCardView(this._filmCards[i]);
      render(filmsListCommentedElement, filmCard);
      filmCard.setClickHandler(this._renderPopup);
    }
  }

  _renderPopup(filmCard) {

    this._popupComponent = new PopupView(filmCard);

    const siteFooterElement = document.querySelector('.footer');
    const siteBodyElement = document.querySelector('body');

    render(siteFooterElement, this._popupComponent, RenderPosition.AFTERBEGIN);

    siteBodyElement.classList.add('hide-overflow');

    const commentListElement = this._popupComponent.getElement().querySelector('.film-details__comments-list');

    for (let i = 0; i < getCommentLength(filmCard.comments); i++) {
      render(commentListElement, new CommentView(filmCard.comments[i]));
    }

    const removePopup = () => {
      siteBodyElement.classList.remove('hide-overflow');
      remove(this._popupComponent);
    };

    const onEscButtonClose = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();

        removePopup();
        document.removeEventListener('keydown', onEscButtonClose);
      }
    };

    this._popupComponent.setClickHandler(removePopup);
    document.addEventListener('keydown', onEscButtonClose);
  }
}
