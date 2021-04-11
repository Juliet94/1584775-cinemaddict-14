import {createElement} from '../utils';

const createFilmsListExtraTemplate = (titleText, additionalClass) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${titleText}</h2>
      <div class="films-list__container ${additionalClass}">
      </div>
    </section>`;
};

export default class FilmsListExtra {
  constructor(titleText, additionalClass) {
    this._titleText = titleText;
    this._additionalClass = additionalClass;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._titleText, this._additionalClass);
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

