import SortView from '../view/sort';
import FilmsListView from '../view/films-list';
import FilmCardView from '../view/film-card';
import ButtonShowMoreView from '../view/button-show-more';
import FilmsListExtraView from '../view/films-list-extra';
import PopupView from '../view/popup';
import CommentView from '../view/comment';
import NoFilmView from '../view/no-film';
import {render, remove, replace, RenderPosition} from '../utils/render';
import {getCommentLength, updateItem, sortByRating, sortByDate} from '../utils/common';
import {TaskCount, SortType} from '../const';

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
    this._renderedTaskCount = TaskCount.PER_STEP;
    this._renderedFilmCards = {};
    this._currentSortType = SortType.DEFAULT;

    this._filmsListComponent = new FilmsListView();
    this._sortComponent = new SortView();
    this._noFilmComponent = new NoFilmView();
    this._buttonShowMoreComponent = new ButtonShowMoreView();

    this._filmCardElement = null;
    this._popupComponent = null;

    this._handleButtonShowMoreClick = this._handleButtonShowMoreClick.bind(this);
    this._handleButtonWatchlistClick = this._handleButtonWatchlistClick.bind(this);
    this._handleButtonWatchedClick = this._handleButtonWatchedClick.bind(this);
    this._handleButtonFavoriteClick = this._handleButtonFavoriteClick.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);

    this._filmsListElement = this._filmsListComponent.getElement().querySelector('.films-list');
    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');
  }

  init(filmCards) {
    this._filmCards = filmCards.slice();
    this._sourcedFilmCards = filmCards.slice();

    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent);
    this._sortComponent.setSortTypeClickHandler(this._handleSortTypeClick);
  }

  _sortFilmCards(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._filmCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this._filmCards.sort(sortByRating);
        break;
      default:
        this._filmCards = this._sourcedFilmCards.slice();
    }

    this._currentSortType = sortType;
  }

  _clearFilmList() {
    Object.values(this._renderedFilmCards).forEach((filmCard) => {
      filmCard.getElement().remove();
      filmCard.removeElement();
    });

    this._buttonShowMoreComponent.getElement().remove();
  }

  _renderFilmCard(filmCard) {
    const filmComponent = this._createFilmComponent(filmCard);

    render(this._filmsListContainerElement, filmComponent);

    this._renderedFilmCards[filmCard.id] = filmComponent;
  }

  _createFilmComponent(filmCard) {

    this._filmCardElement = new FilmCardView(filmCard);

    this._filmCardElement.setOpenPopupClickHandler(() => this._renderPopup(filmCard));
    this._filmCardElement.setWatchlistClickHandler(() => this._handleButtonWatchlistClick(filmCard));
    this._filmCardElement.setWatchedClickHandler(() => this._handleButtonWatchedClick(filmCard));
    this._filmCardElement.setFavoriteClickHandler(() => this._handleButtonFavoriteClick(filmCard));

    return this._filmCardElement;
  }

  _renderFilmCards(from, to) {

    this._filmCards
      .slice(from, to)
      .forEach((filmCard) => {
        this._renderFilmCard(filmCard);
      });

    if (this._filmCards.length > TaskCount.PER_STEP) {
      this._renderButtonShowMore();
    }
  }

  _renderNoFilm() {
    render(this._filmsListContainer, this._noFilmComponent);
  }

  _handleButtonShowMoreClick() {

    this._renderFilmCards(this._renderedTaskCount, this._renderedTaskCount + TaskCount.PER_STEP);
    this._renderedTaskCount += TaskCount.PER_STEP;

    if (this._renderedTaskCount >= this._filmCards.length) {
      remove(this._buttonShowMoreComponent);
    }
  }

  _renderButtonShowMore() {

    render(this._filmsListElement, this._buttonShowMoreComponent);

    this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMoreClick);
  }

  _renderFilmsList() {

    if (this._filmCards.length !== 0) {
      this._renderSort();
      render(this._filmsListContainer, this._filmsListComponent);
      this._renderFilmCards(0, TaskCount.PER_STEP);
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
      this._filmCardElement = new FilmCardView(this._filmCards[i]);
      render(filmsListRatedElement, this._filmCardElement);
      this._filmCardElement.setOpenPopupClickHandler(this._renderPopup);
    }

    for (let i = 0; i < TaskCount.EXTRA; i++) {
      this._filmCardElement = new FilmCardView(this._filmCards[i]);
      render(filmsListCommentedElement, this._filmCardElement);
      this._filmCardElement.setOpenPopupClickHandler(this._renderPopup);
    }
  }

  _renderPopup(filmCard) {

    const siteFooterElement = document.querySelector('.footer');
    const siteBodyElement = document.querySelector('body');

    const removePopup = () => {
      siteBodyElement.classList.remove('hide-overflow');
      remove(this._popupComponent);
    };

    if (this._popupComponent) {
      removePopup();
    }

    this._popupComponent = new PopupView(filmCard);

    this._popupComponent.setWatchlistClickHandler(() => this._handleButtonWatchlistClick(filmCard));
    this._popupComponent.setWatchedClickHandler(() => this._handleButtonWatchedClick(filmCard));
    this._popupComponent.setFavoriteClickHandler(() => this._handleButtonFavoriteClick(filmCard));

    render(siteFooterElement, this._popupComponent, RenderPosition.AFTERBEGIN);

    siteBodyElement.classList.add('hide-overflow');

    const commentListElement = this._popupComponent.getElement().querySelector('.film-details__comments-list');

    for (let i = 0; i < getCommentLength(filmCard.comments); i++) {
      render(commentListElement, new CommentView(filmCard.comments[i]));
    }

    const onEscButtonClose = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();

        removePopup();
        document.removeEventListener('keydown', onEscButtonClose);
      }
    };

    this._popupComponent.setClickButtonCloseHandler(removePopup);
    document.addEventListener('keydown', onEscButtonClose);
  }

  _handleButtonWatchlistClick(filmCard) {

    filmCard.isInWatchlist = !filmCard.isInWatchlist;
    this._handleFilmUpdate(filmCard);
  }

  _handleButtonWatchedClick(filmCard) {

    filmCard.isWatched = !filmCard.isWatched;
    this._handleFilmUpdate(filmCard);
  }

  _handleButtonFavoriteClick(filmCard) {

    filmCard.isFavorite = !filmCard.isFavorite;
    this._handleFilmUpdate(filmCard);
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType !== sortType) {
      this._sortFilmCards(sortType);
      this._clearFilmList();
      this._renderedTaskCount = TaskCount.PER_STEP;
      this._renderFilmCards(0, TaskCount.PER_STEP);
    }
  }

  _handleFilmUpdate(updatedFilm) {
    this._filmCards = updateItem(this._filmCards, updatedFilm);
    this._replaceFilm(updatedFilm);
  }

  _replaceFilm(film) {
    if (this._renderedFilmCards[film.id]) {
      const filmCardComponent = this._createFilmComponent(film);

      replace(filmCardComponent, this._renderedFilmCards[film.id]);
      this._renderedFilmCards[film.id] = filmCardComponent;
    }
  }
}
