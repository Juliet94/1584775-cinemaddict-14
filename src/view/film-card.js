import {getCommentLength} from '../utils/common';
import {getReleaseYear, formatFilmDuration} from '../utils/film-card';
import AbstractView from './abstract';

const createFilmCardTemplate = (filmCard) => {

  const DESC_LENGTH = 140;
  const ACTIVE_CLASS = 'film-card__controls-item--active';

  const {
    title,
    poster,
    description,
    rate,
    production,
    duration,
    genres,
    isWatched,
    isFavorite,
    isInWatchlist,
    comments,
  } = filmCard;

  const cutDescription = (description) => {
    let desc = description.slice(0, DESC_LENGTH - 1).trim();
    while ((desc.trim().charAt(desc.length - 1) === ',') || (desc.trim().charAt(desc.length - 1) === '.')) {
      desc = desc.slice(0, desc.length - 1).trim();
    }
    return desc.trim() + '...';
  };

  return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rate}</p>
          <p class="film-card__info">
            <span class="film-card__year">${getReleaseYear(production)}</span>
            <span class="film-card__duration">${formatFilmDuration(duration)}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description.length >= DESC_LENGTH ? cutDescription(description) : description}</p>
          <a class="film-card__comments">${getCommentLength(comments)} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isInWatchlist ? ACTIVE_CLASS : ''}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? ACTIVE_CLASS : ''}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? ACTIVE_CLASS : ''}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;

    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }
  _openPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._filmCard);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setOpenPopupClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;

    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;

    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }
}
