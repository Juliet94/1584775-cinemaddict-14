import AbstractView from './abstract';

const createFilmsListExtraTemplate = (titleText, additionalClass) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${titleText}</h2>
      <div class="films-list__container ${additionalClass}">
      </div>
    </section>`;
};

export default class FilmsListExtra extends AbstractView {
  constructor(titleText, additionalClass) {
    super();
    this._titleText = titleText;
    this._additionalClass = additionalClass;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._titleText, this._additionalClass);
  }
}

