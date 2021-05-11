import {getCommentLength} from '../utils/common';
import AbstractView from './abstract';

const createCommentCountTemplate = (filmCard) => {
  const {comments} = filmCard;

  return `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${getCommentLength(comments)}</span></h3>

        <ul class="film-details__comments-list">

        </ul>
      </section>
    </div>`;
};

export default class CommentCount extends AbstractView {
  constructor(filmCard) {
    super();
    this._film = filmCard;
  }

  getTemplate() {
    return createCommentCountTemplate(this._film);
  }
}
