import AbstractView from './abstract';

const createMenuFilterTemplate = (filters) => {

  return filters.map(({link, text, count}) => {
    return `<a href="${link}" class="main-navigation__item">${text} ${text === 'all' ? '' : `<span  class="main-navigation__item-count">${count}</span>`}</a>`;
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

export default class Menu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }
}
