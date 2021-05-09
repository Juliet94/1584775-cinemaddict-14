import MenuView from './view/menu';
import UserRatingView from './view/user-rating';
import FooterStatisticsView from './view/footer-statistics';

import FilmsListPresenter from './presenter/films-list';
import FilterPresenter from './presenter/filter';

import FilmsModel from './model/films';
import FilterModel from './model/filter';

import {FilmCount} from './const';
import {generateFilmCard} from './mock/film-card';
import {render} from './utils/render';

import {generateUserRank} from './mock/user-rank';

const filmCards = new Array(FilmCount.CONTENT).fill().map(generateFilmCard);
const userRank = generateUserRank(filmCards);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new UserRatingView(userRank));
render(siteMainElement, new MenuView());

const siteNavElement = document.querySelector('.main-navigation');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
filmsModel.setFilms(filmCards);

const filterPresenter = new FilterPresenter(siteNavElement, filterModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
filmsListPresenter.init();

render(siteFooterElement, new FooterStatisticsView(filmCards.length));
