import SmartView from './smart';
import {Emoji} from '../const';

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

    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
  }

  getTemplate() {
    return createNewCommentTemplate(this._data);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      checkedEmoji: evt.target.value,
      writtenComment: this.getElement().querySelector('.film-details__comment-input').value,
    });
  }

  setEmojiChangeHandler() {

    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emojiChangeHandler);
  }

  restoreHandlers() {
    this.setEmojiChangeHandler();
  }
}
