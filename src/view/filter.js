import AbstractView from './abstract';
import {FilterType, NAV_ACTIVE_CLASS} from '../const';

const createFilterItemTemplate = (filters, currentFilterType) => {

  const {
    type,
    name,
    count,
  } = filters;

  const getCount = () => {
    if (type === FilterType.ALL) {
      return '';
    }
    return `<span class="main-navigation__item-count">${count}</span>`;
  };

  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? NAV_ACTIVE_CLASS : ''}"
    data-type="${type}">
    ${name}
    ${getCount()}
   </a>`;
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterTemplate = filters
    .map((filters) => createFilterItemTemplate(filters, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
        ${filterTemplate}
    </div>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  removeActiveClass() {
    this.getElement().querySelectorAll('.main-navigation__item').forEach((button) => {
      button.classList.remove(NAV_ACTIVE_CLASS);
    });
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.type);
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }
}
