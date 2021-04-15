import AbstractView from './abstract';

const createButtonShowMoreTemplate = () => {
  return `<button class="films-list__show-more">
    Show more
    </button>`;
};

export default class ButtonShowMore extends AbstractView {
  getTemplate() {
    return createButtonShowMoreTemplate();
  }
}
