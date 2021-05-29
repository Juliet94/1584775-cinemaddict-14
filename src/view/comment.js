import SmartView from './smart';
import {formatCommentDate} from '../utils/film-card';
import {SHAKE_ANIMATION_TIMEOUT} from '../const';

const createCommentTemplate = (comments, isDeleting) => {

  const {
    text,
    author,
    emoji,
    date,
  } = comments;

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${formatCommentDate(date)}</span>
                <button class="film-details__comment-delete" ${isDeleting ? 'disabled' : ''}>
                ${isDeleting ? 'Deleting...' : 'Delete'}</button>
              </p>
            </div>
          </li>`;
};

export default class Comment extends SmartView {
  constructor(comments) {
    super();
    this._comments = comments;
    this._isDeleting = false;

    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comments, this._isDeleting);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    this.setStateDeleting();
    this._callback.deleteComment();
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteComment = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._deleteCommentClickHandler);
  }

  setStateDeleting(state = true) {
    this._isDeleting = state;
    this.updateElement();
  }

  restoreHandlers() {
    this.setDeleteCommentClickHandler(this._callback.deleteComment);
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
