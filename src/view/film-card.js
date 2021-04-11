import {getCommentLength, createElement} from '../utils';

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
            <span class="film-card__year">${production.slice(-4)}</span>
            <span class="film-card__duration">${duration}</span>
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

export default class FilmCard {
  constructor(filmCard) {
    this._filmCard = filmCard;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
