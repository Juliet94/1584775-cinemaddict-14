import FilterView from '../view/filter';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {FilterType, UpdateType, NAV_ACTIVE_CLASS} from '../const';
import {filter} from '../utils/filter';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, filmsPresenter) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._isStatsShown = false;

    this._filterComponent = null;
    this._filmsListPresenter = filmsPresenter;
    this._statsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterClick = this._handleFilterClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterClickHandler(this._handleFilterClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterClick(filterType) {

    if (this._isStatsShown === true) {
      this._filterContainer.querySelector('.main-navigation__additional').classList.remove(NAV_ACTIVE_CLASS);
      remove(this._statsComponent);
      this._isStatsShown = false;
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
      this._filmsListPresenter.init();
      return;
    }

    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {

    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  getStatsStatus() {
    return this._isStatsShown;
  }

  setStatsStatus(statsStatus) {
    this._isStatsShown = statsStatus;
  }

  removeActiveClass() {
    this._filterComponent.removeActiveClass();
  }

  setStats(stats) {
    this._statsComponent = stats;
  }

  resetActiveFilter() {
    this._filterModel.resetActiveFilter();
  }
}
