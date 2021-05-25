import AbstractView from './abstract';

const createMenuTemplate = () => {

  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statsClickHandler);
  }
}
