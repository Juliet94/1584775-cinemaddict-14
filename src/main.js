import MenuView from './view/menu';
import UserRatingView from './view/user-rating';
import FooterStatisticsView from './view/footer-statistics';

import FilmsListPresenter from './presenter/films-list';

import {TaskCount} from './const';
import {generateFilmCard} from './mock/film-card';
import {render} from './utils/render';

import {generateFilters} from './mock/filter';
import {generateUserRank} from './mock/user-rank';

const filmCards = new Array(TaskCount.CONTENT).fill().map(generateFilmCard);
const filters = generateFilters(filmCards);
const userRank = generateUserRank(filmCards);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new UserRatingView(userRank));
render(siteMainElement, new MenuView(filters));

const filmsListPresenter = new FilmsListPresenter(siteMainElement);

filmsListPresenter.init(filmCards);

render(siteFooterElement, new FooterStatisticsView(filmCards.length));
