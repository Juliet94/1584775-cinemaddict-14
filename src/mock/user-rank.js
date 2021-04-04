const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const getUserRank = (count) => {
  if (count > 0 && count <= 10) {
    return UserRank.NOVICE;
  }
  if (count > 10 && count <= 20) {
    return UserRank.FAN;
  }
  if (count > 20) {
    return UserRank.MOVIE_BUFF;
  }
  return '';
};

export const generateUserRank = (films) => {
  const watchedFilmsCount = films.filter((film) => film.isWatched).length;

  return getUserRank(watchedFilmsCount);
};
