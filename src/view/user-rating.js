import AbstractView from './abstract';
import {generateUserRank} from '../utils/film-card';

const createUserRatingTemplate = (films) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${generateUserRank(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRating extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserRatingTemplate(this._films);
  }
}
