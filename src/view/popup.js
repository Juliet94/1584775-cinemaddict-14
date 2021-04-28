import {getCommentLength} from '../utils/common';
import SmartView from './smart';
import {Emoji} from '../const';

const createPopupTemplate = (filmCard) => {

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
    director,
    writers,
    actors,
    country,
    age,
    isEmojiChecked,
    checkedEmoji,
    writtenComment,
  } = filmCard;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rate}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${production}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${genres.map((genre) => (`<span class="film-details__genre">${genre}</span>`)).join('')}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchlist ? 'checked' : ''}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? 'checked' : ''}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? 'checked' : ''}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${getCommentLength(comments)}</span></h3>

        <ul class="film-details__comments-list">

        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${isEmojiChecked ? `<img src="images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${writtenComment ? writtenComment : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${checkedEmoji === Emoji.SMILE ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${checkedEmoji === Emoji.SLEEPING ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${checkedEmoji === Emoji.PUKE ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${checkedEmoji === Emoji.ANGRY ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(filmCard) {
    super();
    this._data = filmCard;

    this._clickButtonCloseHandler = this._clickButtonCloseHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  _clickButtonCloseHandler(evt) {
    evt.preventDefault();
    this._callback.clickClose();
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();

  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();

  }

  _watchedClickHandler() {
    this._callback.watchedClick();

  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this._callback.emojiChange();

    const scroll = this.getElement().scrollTop;

    this.updateData({
      isEmojiChecked: true,
      checkedEmoji: evt.target.value,
      writtenComment: this.getElement().querySelector('.film-details__comment-input').value,
    });

    this.getElement().scrollTop = scroll;
  }

  setClickButtonCloseHandler(callback) {
    this._callback.clickClose = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickButtonCloseHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;

    this.getElement().querySelector('.film-details__control-label--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.getElement().querySelector('.film-details__control-label--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;

    this.getElement().querySelector('.film-details__control-label--watched').addEventListener('click', this._watchedClickHandler);
  }

  setEmojiChangeHandler(callback) {
    this._callback.emojiChange = callback;

    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emojiChangeHandler);
  }

  restoreHandlers() {
    this.setClickButtonCloseHandler(this._callback.clickClose);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setEmojiChangeHandler(this._callback.emojiChange);
  }
}
