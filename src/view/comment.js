import AbstractView from './abstract';
import {formatCommentDate} from '../utils/film-card';

const createCommentTemplate = (comments) => {

  const {
    text,
    author,
    emoji,
    date,
  } = comments;

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${formatCommentDate(date)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};

export default class Comment extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;

    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comments);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteComment();
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteComment = callback;

    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._deleteCommentClickHandler);
  }
}
