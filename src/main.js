import MenuView from './view/menu';
import FooterStatisticsView from './view/footer-statistics';
import StatsView from './view/stats';

import FilmsListPresenter from './presenter/films-list';
import FilterPresenter from './presenter/filter';

import FilmsModel from './model/films';
import FilterModel from './model/filter';
import Api from './api';

import {render} from './utils/render';
import {UpdateType, NAV_ACTIVE_CLASS} from './const';

const AUTHORIZATION = 'Basic ef5rg3eg154d16sg';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const menuComponent = new MenuView();

render(siteMainElement, menuComponent);

const siteNavElement = document.querySelector('.main-navigation');

const filmsListPresenter = new FilmsListPresenter(siteMainElement, siteHeaderElement, filterModel, filmsModel, api);
const filterPresenter = new FilterPresenter(siteNavElement, filterModel, filmsModel, filmsListPresenter);

const handleStatsClick = () => {

  if (filterPresenter.getStatsStatus() === false) {

    const statsComponent = new StatsView(filmsModel.getFilms());
    statsComponent.setPeriodChangeHandler((period) => {
      statsComponent.updateData({period});
      statsComponent.setChart();
    });
    filterPresenter.setStats(statsComponent);
    filterPresenter.resetActiveFilter();

    filmsListPresenter.destroy();
    render(siteMainElement, statsComponent);
    statsComponent.setChart();
    filterPresenter.setStatsStatus(true);
    filterPresenter.removeActiveClass();
    siteNavElement.querySelector('.main-navigation__additional').classList.add(NAV_ACTIVE_CLASS);
  }
};

filterPresenter.init();
filmsListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteFooterElement, new FooterStatisticsView(films.length));
    menuComponent.setStatsClickHandler(handleStatsClick);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
