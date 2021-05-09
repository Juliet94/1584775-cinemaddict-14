import SortView from '../view/sort';
import FilmsListView from '../view/films-list';
import FilmCardView from '../view/film-card';
import ButtonShowMoreView from '../view/button-show-more';
import FilmsListExtraView from '../view/films-list-extra';
import PopupView from '../view/popup';
import CommentView from '../view/comment';
import NoFilmView from '../view/no-film';
import NewCommentView from '../view/new-comment';

import {render, remove, replace, RenderPosition} from '../utils/render';
import {getCommentLength, sortByRating, sortByDate} from '../utils/common';
import {FilmCount, SortType, UserAction, UpdateType} from '../const';
import {filter} from '../utils/filter';

const Title = {
  RATE : 'Top rated',
  COMMENT : 'Most commented',
};

const AdditionalClass = {
  RATED : 'films-list__container--rated',
  COMMENTED : 'films-list__container--commented',
};

export default class FilmsList {
  constructor(filmsListContainer, filterModel, filmsModel) {

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filmsListContainer = filmsListContainer;
    this._renderedTaskCount = FilmCount.PER_STEP;
    this._renderedFilmCards = {};
    this._currentSortType = SortType.DEFAULT;

    this._filmsListComponent = new FilmsListView();
    this._sortComponent = new SortView();
    this._noFilmComponent = new NoFilmView();
    this._buttonShowMoreComponent = new ButtonShowMoreView();

    this._filmCardElement = null;
    this._popupComponent = null;
    this._newCommentComponent = null;

    this._handleButtonShowMoreClick = this._handleButtonShowMoreClick.bind(this);
    this._handleButtonWatchlistClick = this._handleButtonWatchlistClick.bind(this);
    this._handleButtonWatchedClick = this._handleButtonWatchedClick.bind(this);
    this._handleButtonFavoriteClick = this._handleButtonFavoriteClick.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsListElement = this._filmsListComponent.getElement().querySelector('.films-list');
    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');
  }

  init() {

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsList();
  }

  _getFilms() {

    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms().slice();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case  SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        this._replaceFilm(update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {

    switch (updateType) {
      case UpdateType.PATCH:
        this._replaceFilm(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmCards();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetShownMoviesCount: true, resetSortType: true});
        this._renderFilmCards();
        break;
    }
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent);
    this._sortComponent.setSortTypeClickHandler(this._handleSortTypeClick);
  }

  _clearFilmList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    Object.values(this._renderedFilmCards).forEach((filmCard) => {
      remove(filmCard);
    });

    if (resetRenderedFilmsCount) {
      this._renderedTaskCount = FilmCount.PER_STEP;
    }

    if (resetSortType) {

      const previousSortComponent = this._sortComponent;

      this._sortComponent = new SortView();
      this._currentSortType = SortType.DEFAULT;

      replace(this._sortComponent, previousSortComponent);
      remove(previousSortComponent);

      this._sortComponent.setSortTypeClickHandler(this._handleSortTypeClick);
    }

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

  _renderFilmCards(filmCards = this._getFilms().slice(0, Math.min(this._getFilms().length, FilmCount.PER_STEP))) {

    const filmCount = this._getFilms().length;

    filmCards.forEach((filmCard) => this._renderFilmCard(filmCard));

    if (filmCount > FilmCount.PER_STEP) {
      this._renderButtonShowMore();
    }
  }

  _renderNoFilm() {
    render(this._filmsListContainer, this._noFilmComponent);
  }

  _handleButtonShowMoreClick() {

    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedTaskCount + FilmCount.PER_STEP);
    const films = this._getFilms().slice(this._renderedTaskCount, newRenderedFilmCount);

    this._renderFilmCards(films);
    this._renderedTaskCount = newRenderedFilmCount;

    if (this._renderedTaskCount >= filmCount) {
      remove(this._buttonShowMoreComponent);
    }
  }

  _renderButtonShowMore() {

    render(this._filmsListElement, this._buttonShowMoreComponent);

    this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMoreClick);
  }

  _renderFilmsList() {

    const filmCount = this._getFilms().length;

    if (filmCount !== 0) {
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

    for (let i = 0; i < FilmCount.EXTRA; i++) {
      this._filmCardElement = new FilmCardView(this._getFilms()[i]);
      render(filmsListRatedElement, this._filmCardElement);
      this._filmCardElement.setOpenPopupClickHandler(this._renderPopup);
    }

    for (let i = 0; i < FilmCount.EXTRA; i++) {
      this._filmCardElement = new FilmCardView(this._getFilms()[i]);
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

    this._popupComponent.setClickButtonCloseHandler(removePopup);

    render(siteFooterElement, this._popupComponent, RenderPosition.AFTERBEGIN);

    siteBodyElement.classList.add('hide-overflow');

    this._renderComments(filmCard);

    const onEscButtonClose = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();

        removePopup();
        document.removeEventListener('keydown', onEscButtonClose);
      }
    };

    document.addEventListener('keydown', onEscButtonClose);
  }

  _renderComments(filmCard) {

    this._newCommentComponent = new NewCommentView(filmCard);

    const commentListElement = this._popupComponent.getElement().querySelector('.film-details__comments-list');
    const commentsWrapperElement = this._popupComponent.getElement().querySelector('.film-details__comments-wrap');

    for (let i = 0; i < getCommentLength(filmCard.comments); i++) {
      render(commentListElement, new CommentView(filmCard.comments[i]));
    }

    render(commentsWrapperElement, this._newCommentComponent);
    this._newCommentComponent.setEmojiChangeHandler();
  }

  _handleButtonWatchlistClick(filmCard) {

    filmCard.isInWatchlist = !filmCard.isInWatchlist;
    this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmCard);
  }

  _handleButtonWatchedClick(filmCard) {

    filmCard.isWatched = !filmCard.isWatched;
    this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmCard);
  }

  _handleButtonFavoriteClick(filmCard) {

    filmCard.isFavorite = !filmCard.isFavorite;
    this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmCard);
  }

  _handleSortTypeClick(sortType) {

    const filmCount = this._getFilms().length;

    if (this._currentSortType !== sortType) {
      this._currentSortType = sortType;
      this._clearFilmList();
      this._renderedTaskCount = FilmCount.PER_STEP;
      this._renderFilmCards(this._getFilms().slice(0, Math.min(filmCount, FilmCount.PER_STEP)));
    }
  }

  _replaceFilm(film) {
    if (this._renderedFilmCards[film.id]) {
      const filmCardComponent = this._createFilmComponent(film);

      replace(filmCardComponent, this._renderedFilmCards[film.id]);
      this._renderedFilmCards[film.id] = filmCardComponent;
    }
  }
}
