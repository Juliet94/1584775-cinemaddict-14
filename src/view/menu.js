import {createElement} from '../utils';

const createMenuFilterTemplate = (filters) => {

  return filters.map(({link, text, count}) => {
    return `<a href="#${link}" class="main-navigation__item">${text} ${text === 'all' ? '' : `<span  class="main-navigation__item-count">${count}</span>`}</a>`;
  }).join('\n');
};

const createMenuTemplate = (filters) => {

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${createMenuFilterTemplate(filters)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
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
