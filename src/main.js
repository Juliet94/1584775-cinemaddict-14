import MenuView from './view/menu';
import UserRatingView from './view/user-rating';
import FooterStatisticsView from './view/footer-statistics';

import FilmsListPresenter from './presenter/films-list';
import FilterPresenter from './presenter/filter';

import FilmsModel from './model/films';
import FilterModel from './model/filter';

import Api from './api';

import {render} from './utils/render';
import {UpdateType} from './const';

import {generateUserRank} from './mock/user-rank';

const AUTHORIZATION = 'Basic ef5rg3eg154d16sg';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
// const userRank = generateUserRank(filmsModel.getFilms());
const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteMainElement, new MenuView());

const siteNavElement = document.querySelector('.main-navigation');

const filterPresenter = new FilterPresenter(siteNavElement, filterModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filterModel, filmsModel, api);

filterPresenter.init();
filmsListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteHeaderElement, new UserRatingView(generateUserRank(films)));
    render(siteFooterElement, new FooterStatisticsView(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
