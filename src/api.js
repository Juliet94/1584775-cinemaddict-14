import FilmsModel from './model/films';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptFilmToClient));
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(FilmsModel.adaptCommentToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptFilmToClient);
  }

  deleteComment(data) {
    return this._load({
      url: `comments/${data.commentId}`,
      method: Method.DELETE,
    });
  }

  addComment(data) {
    return this._load({
      url: `comments/${data.filmId}`,
      method: Method.POST,
      body: JSON.stringify(FilmsModel.adaptCommentToServer(data.comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((response) => {
        return FilmsModel.adaptCommentToClient(response.comments[response.comments.length - 1]);
      });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
