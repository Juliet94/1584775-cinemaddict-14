import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

import {UserRank} from '../const';

const UserRankScore = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatCommentDate = (date) => {
  return `${dayjs(date).toNow(true)} ago`;
};

export const formatFilmDuration = (duration) => {

  const durationParse = dayjs.duration(duration, 'minutes');

  return `${durationParse.hours()}h ${durationParse.minutes()}m`;
};

export const formatReleaseDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const getReleaseYear = (date) => {
  return dayjs(date).year();
};

export const generateUserRank = (films) => {

  const watchedFilmsCount = films.filter((film) => film.isWatched).length;

  if (watchedFilmsCount > UserRankScore.NOVICE && watchedFilmsCount <= UserRankScore.FAN) {
    return UserRank.NOVICE;
  }
  if (watchedFilmsCount > UserRankScore.FAN && watchedFilmsCount <= UserRankScore.MOVIE_BUFF) {
    return UserRank.FAN;
  }
  if (watchedFilmsCount > UserRankScore.MOVIE_BUFF) {
    return UserRank.MOVIE_BUFF;
  }
  return '';
};
