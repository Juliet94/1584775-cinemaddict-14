import SortView from '../view/sort';
import FilmsListView from '../view/films-list';
import FilmCardView from '../view/film-card';
import ButtonShowMoreView from '../view/button-show-more';
import FilmsListExtraView from '../view/films-list-extra';
import PopupView from '../view/popup';
import CommentView from '../view/comment';
import NoFilmView from '../view/no-film';
import NewCommentView from '../view/new-comment';
import CommentCountView from '../view/comment-count';
import LoadingView from '../view/loading';

import {render, remove, replace, RenderPosition} from '../utils/render';
import {getCommentLength, sortByRating, sortByDate, getRandomArrayElement, sortByCommentsLength} from '../utils/common';
import {FilmCount, SortType, UserAction, UpdateType, FilterType} from '../const';
import {filter} from '../utils/filter';
import {NAMES} from '../mock/film-card';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import UserRatingView from '../view/user-rating';

const Title = {
  RATE : 'Top rated',
  COMMENT : 'Most commented',
};

const AdditionalClass = {
  RATED : 'films-list__container--rated',
  COMMENTED : 'films-list__container--commented',
};

export default class FilmsList {
  constructor(filmsListContainer, userRankContainer, filterModel, filmsModel, api) {

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._api = api;

    this._filmsListContainer = filmsListContainer;
    this._userRankContainer = userRankContainer;
    this._renderedFilmCount = FilmCount.PER_STEP;
    this._renderedFilmCards = {};
    this._renderedTopRated = {};
    this._renderedMostCommented = {};
    this._renderedComments = [];
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._comments = [];

    this._filmsListComponent = new FilmsListView();
    this._sortComponent = new SortView();
    this._noFilmComponent = new NoFilmView();
    this._buttonShowMoreComponent = new ButtonShowMoreView();
    this._topRatedComponent = new FilmsListExtraView(Title.RATE, AdditionalClass.RATED);
    this._mostCommentedComponent = new FilmsListExtraView(Title.COMMENT, AdditionalClass.COMMENTED);
    this._loadingComponent = new LoadingView();

    this._userRankComponent = null;
    this._filmCardComponent = null;
    this._popupComponent = null;
    this._newCommentComponent = null;
    this._commentComponent = null;
    this._commentCountComponent = null;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
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

  destroy() {
    this._clearFilmList({resetSortType: true});

    remove(this._sortComponent);
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
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
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
          this._replaceFilm(response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.addComment(updateType, update);
        this._updateComments(update.filmCard);
        this._replaceFilm(update.filmCard);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.deleteComment(updateType, update);
        this._updateComments(update.filmCard);
        this._replaceFilm(update.filmCard);
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
        this._clearFilmList({resetSortType: true});
        this._renderFilmCards();
        break;
      case UpdateType.POPUP:
        this._updateComments(data);
        this._replaceFilm(data);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsList();
        break;
    }
  }

  _renderSort() {
    render(this._filmsListContainer, this._sortComponent);
    this._sortComponent.setSortTypeClickHandler(this._handleSortTypeClick);
  }

  _clearFilmList(resetSortType = false, resetRenderedFilmsCount = true) {

    Object.values(this._renderedFilmCards).forEach((filmCard) => {
      remove(filmCard);
    });

    this._renderedFilmCards = {};

    if (resetRenderedFilmsCount) {
      this._renderedFilmCount = FilmCount.PER_STEP;
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

  _clearMostCommented() {

    Object.values(this._renderedMostCommented).forEach((filmCard) => {
      remove(filmCard);
    });

    this._renderedMostCommented = {};
  }

  _renderFilmCard(filmCard) {

    const filmComponent = this._createFilmComponent(filmCard);

    render(this._filmsListContainerElement, filmComponent);

    this._renderedFilmCards[filmCard.id] = filmComponent;
  }

  _createFilmComponent(filmCard) {

    this._filmCardComponent = new FilmCardView(filmCard);

    this._filmCardComponent.setOpenPopupClickHandler(() => this._handleOpenPopupClick(filmCard));
    this._filmCardComponent.setWatchlistClickHandler(() => this._handleButtonWatchlistClick(filmCard));
    this._filmCardComponent.setWatchedClickHandler(() => this._handleButtonWatchedClick(filmCard));
    this._filmCardComponent.setFavoriteClickHandler(() => this._handleButtonFavoriteClick(filmCard));

    return this._filmCardComponent;
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

  _renderLoading() {
    render(this._filmsListContainer, this._loadingComponent);
  }

  _renderUserRank() {

    if (this._userRankComponent) {
      remove(this._userRankComponent);
    }

    this._userRankComponent = new UserRatingView(this._filmsModel.getFilms());
    render(this._userRankContainer, this._userRankComponent);
  }

  _handleButtonShowMoreClick() {

    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FilmCount.PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilmCards(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._buttonShowMoreComponent);
    }
  }

  _renderButtonShowMore() {

    render(this._filmsListElement, this._buttonShowMoreComponent);

    this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMoreClick);
  }

  _renderTopRatedFilms() {

    this._filmsElement = this._filmsListContainer.querySelector('.films');

    render(this._filmsElement, this._topRatedComponent);

    const topRatedFilms = this._filmsModel.getFilms().slice().sort(sortByRating);

    const filmsListRatedElement = this._filmsElement.querySelector('.films-list__container--rated');

    for (let i = 0; i < FilmCount.EXTRA; i++) {
      const filmComponent = this._createFilmComponent(topRatedFilms[i]);
      render(filmsListRatedElement, filmComponent);
      this._renderedTopRated[topRatedFilms[i].id] = filmComponent;
    }
  }

  _renderMostCommentedFilms() {

    this._filmsElement = this._filmsListContainer.querySelector('.films');

    const mostCommentedFilms = this._filmsModel.getFilms().slice().sort(sortByCommentsLength);

    if (getCommentLength(mostCommentedFilms[0].comments) !== 0) {

      render(this._filmsElement, this._mostCommentedComponent);
      const filmsListCommentedElement = this._filmsElement.querySelector('.films-list__container--commented');

      for (let i = 0; i < FilmCount.EXTRA; i++) {
        const filmComponent = this._createFilmComponent(mostCommentedFilms[i]);
        render(filmsListCommentedElement, filmComponent);
        this._renderedMostCommented[mostCommentedFilms[i].id] = filmComponent;
      }
    } else {
      remove(this._mostCommentedComponent);
    }
  }

  _renderFilmsList() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const filmCount = this._getFilms().length;

    if (filmCount !== 0) {
      this._renderUserRank();
      this._renderSort();
      render(this._filmsListContainer, this._filmsListComponent);
      this._renderFilmCards();
      this._renderTopRatedFilms();
      this._renderMostCommentedFilms();
    } else {
      this._renderNoFilm();
    }
  }

  _renderPopup(filmCard) {

    const siteFooterElement = document.querySelector('.footer');
    const siteBodyElement = document.querySelector('body');

    const removePopup = () => {
      siteBodyElement.classList.remove('hide-overflow');
      remove(this._popupComponent);
      this._renderedComments = [];
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

    this._renderCommentCount(filmCard);
    this._renderComments(filmCard);
    this._renderNewComment(filmCard);

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

    const commentListElement = this._popupComponent.getElement().querySelector('.film-details__comments-list');

    for (let i = 0; i < this._comments.length; i++) {
      this._commentComponent = new CommentView(this._comments[i]);
      this._renderedComments.push(this._commentComponent);
      render(commentListElement, this._commentComponent);
      this._commentComponent.setDeleteCommentClickHandler(() => this._handleCommentDeleteClick(filmCard, filmCard.comments[i]));
    }
  }

  _renderCommentCount(filmCard) {

    const filmFormElement = this._popupComponent.getElement().querySelector('.film-details__inner');
    this._commentCountComponent = new CommentCountView(filmCard);

    render(filmFormElement, this._commentCountComponent);
  }

  _renderNewComment(filmCard) {
    this._newCommentComponent = new NewCommentView(filmCard);
    const commentsWrapperElement = this._popupComponent.getElement().querySelector('.film-details__comments-wrap');
    render(commentsWrapperElement, this._newCommentComponent);
    this._newCommentComponent.setEmojiChangeHandler();
    this._newCommentComponent.setAddCommentKeydownHandler(() => this._handleCommentAddKeydown(filmCard));
  }

  _handleOpenPopupClick(filmCard) {
    this._api.getComments(filmCard.id)
      .then((comments) => {
        this._comments = comments;
        this._renderPopup(filmCard);
      })
      .catch(() => {
        this._comments = [];
        this._renderPopup([]);
      });
  }

  _handleButtonWatchlistClick(filmCard) {

    filmCard.isInWatchlist = !filmCard.isInWatchlist;

    if (this._filterModel.getFilter() === FilterType.ALL) {
      this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, filmCard);
    } else {
      this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmCard);
    }
  }

  _handleButtonWatchedClick(filmCard) {

    filmCard.isWatched = !filmCard.isWatched;
    filmCard.watchingDate = filmCard.isWatched ? dayjs().format() : null;

    this._renderUserRank();

    if (this._filterModel.getFilter() === FilterType.ALL) {
      this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, filmCard);
    } else {
      this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmCard);
    }
  }

  _handleButtonFavoriteClick(filmCard) {

    filmCard.isFavorite = !filmCard.isFavorite;

    if (this._filterModel.getFilter() === FilterType.ALL) {
      this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, filmCard);
    } else {
      this._handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, filmCard);
    }
  }

  _handleSortTypeClick(sortType) {

    if (this._currentSortType !== sortType) {
      this._currentSortType = sortType;
      this._clearFilmList();
      this._renderedFilmCount = FilmCount.PER_STEP;
      this._renderFilmCards();
    }
  }

  _handleCommentDeleteClick(filmCard, comment) {

    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.POPUP,
      {
        filmId: filmCard.id,
        commentId: comment.id,
        filmCard,
      },
    );
  }

  _handleCommentAddKeydown(filmCard) {

    this._handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.POPUP,
      {
        filmId: filmCard.id,
        comment: {
          id: nanoid(),
          text: this._newCommentComponent.getWrittenComment(),
          author: getRandomArrayElement(NAMES),
          emoji: this._newCommentComponent.getCheckedEmoji(),
          date: dayjs(),
        },
        filmCard,
      },
    );
  }

  _replaceFilm(filmCard) {

    if (this._renderedFilmCards[filmCard.id]) {
      const filmCardComponent = this._createFilmComponent(filmCard);

      replace(filmCardComponent, this._renderedFilmCards[filmCard.id]);
      this._renderedFilmCards[filmCard.id] = filmCardComponent;
    }

    if (this._renderedTopRated[filmCard.id]) {
      const filmCardComponent = this._createFilmComponent(filmCard);

      replace(filmCardComponent, this._renderedTopRated[filmCard.id]);
      this._renderedTopRated[filmCard.id] = filmCardComponent;
    }

    if (this._renderedMostCommented[filmCard.id]) {
      const filmCardComponent = this._createFilmComponent(filmCard);

      replace(filmCardComponent, this._renderedMostCommented[filmCard.id]);
      this._renderedMostCommented[filmCard.id] = filmCardComponent;
    }
  }

  _updateComments(filmCard) {

    this._renderedComments.forEach((comment) => {
      remove(comment);
    });
    remove(this._commentCountComponent);
    this._renderedComments = [];
    this._renderCommentCount(filmCard);
    this._renderComments(filmCard);
    this._renderNewComment(filmCard);

    this._clearMostCommented();
    this._renderMostCommentedFilms();
  }
}
