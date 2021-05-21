import Observer from '../utils/observer';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {

    const filmIndex = this._films.findIndex((film) => film.id === update.filmId);

    this._films[filmIndex].comments = [
      ...this._films[filmIndex].comments,
      update.comment,
    ];

    this._notify(updateType, update.filmCard);
  }

  deleteComment(updateType, update) {

    const filmIndex = this._films.findIndex((film) => film.id === update.filmId);

    const commentIndex = this._films[filmIndex].comments.findIndex((comment) => comment.id === update.commentId);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._films[filmIndex].comments = [
      ...this._films[filmIndex].comments.slice(0, commentIndex),
      ...this._films[filmIndex].comments.slice(commentIndex + 1),
    ];
    this._notify(updateType, update.filmCard);
  }

  static adaptFilmToClient(film) {

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        title: film['film_info'].title,
        originalTitle: film['film_info']['alternative_title'],
        poster: film['film_info'].poster,
        description: film['film_info'].description,
        rate: film['film_info']['total_rating'],
        production: film['film_info'].release.date,
        duration: film['film_info'].runtime,
        genres: film['film_info'].genre,
        director: film['film_info'].director,
        writers: film['film_info'].writers,
        actors: film['film_info'].actors,
        country: film['film_info'].release['release_country'],
        age: film['film_info']['age_rating'],
        isInWatchlist: film['user_details'].watchlist,
        isWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
        isFavorite: film['user_details'].favorite,
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptCommentToClient(comment) {

    const adaptedComment = Object.assign(
      {},
      comment,
      {
        text: comment.comment,
        emoji: comment.emotion,
      },
    );

    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(film) {

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'title': film.title,
          'alternative_title': film.originalTitle,
          'poster': film.poster,
          'description': film.description,
          'total_rating': film.rate,
          'release': {
            'date': film.production,
            'release_country': film.country,
          },
          'runtime': film.duration,
          'genre': film.genres,
          'director': film.director,
          'writers': film.writers,
          'actors': film.actors,
          'age_rating': film.age,
        },
        'user_details': {
          'watchlist': film.isInWatchlist,
          'already_watched': film.isWatched,
          'watching_date': film.watchingDate,
          'favorite': film.isFavorite,
        },
      },
    );

    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.poster;
    delete adaptedFilm.description;
    delete adaptedFilm.rate;
    delete adaptedFilm.production;
    delete adaptedFilm.country;
    delete adaptedFilm.duration;
    delete adaptedFilm.genres;
    delete adaptedFilm.director;
    delete adaptedFilm.actors;
    delete adaptedFilm.age;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}
