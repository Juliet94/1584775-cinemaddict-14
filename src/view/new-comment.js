import SmartView from './smart';
import {Emoji, SHAKE_ANIMATION_TIMEOUT} from '../const';
import he from 'he';

const createNewCommentTemplate = (filmCard) => {
  const {
    checkedEmoji,
    writtenComment,
  } = filmCard;

  return `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${checkedEmoji ? `<img src="images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` : ''}
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
        </div>`;
};

export default class NewComment extends SmartView {
  constructor(filmCard) {
    super();
    this._data = filmCard;
    this._emoji = null;

    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._addCommentKeydownHandler = this._addCommentKeydownHandler.bind(this);
  }

  getTemplate() {
    return createNewCommentTemplate(this._data);
  }

  getCheckedEmoji() {
    return this._emoji;
  }

  getWrittenComment() {
    return he.encode(this.getElement().querySelector('.film-details__comment-input').value);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();

    this._emoji = evt.target.value;

    this.updateData({
      checkedEmoji: this._emoji,
      writtenComment: this.getElement().querySelector('.film-details__comment-input').value,
    });
  }

  _addCommentKeydownHandler(evt) {

    if ((evt.ctrlKey && evt.code === 'Enter') &&
      (this.getWrittenComment()) &&
      (this._emoji)
    ) {
      this._callback.addComment();
    }
  }

  setEmojiChangeHandler() {

    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emojiChangeHandler);
  }

  setAddCommentKeydownHandler(callback) {
    this._callback.addComment = callback;

    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._addCommentKeydownHandler);
  }

  disableForm() {
    this.getElement().querySelector('.film-details__comment-input').setAttribute('disabled', 'disabled');
  }

  activateForm() {
    this.getElement().querySelector('.film-details__comment-input').removeAttribute('disabled');
  }

  restoreHandlers() {
    this.setEmojiChangeHandler();
    this.setAddCommentKeydownHandler(this._callback.addComment);
  }

  shake() {
    this.getElement().querySelector('.film-details__comment-input').style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().querySelector('.film-details__comment-input').style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
