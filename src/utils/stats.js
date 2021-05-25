import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import {StatsPeriod} from '../const';

dayjs.extend(duration);

export const makeItemsUniq = (items) => [...new Set(items)];

export const countFilmsByGenre = (films, genre) => {
  return films.filter((film) => film.genres.some((genreItem) => genreItem === genre)).length;
};

export const getDurationHours = (durationTime) => {
  const durationTimeParse = dayjs.duration(durationTime, 'minutes');
  return durationTimeParse.asHours().toFixed(0);
};

export const getDurationMinutes = (durationTime) => {
  const durationTimeParse = dayjs.duration(durationTime, 'minutes');
  return durationTimeParse.minutes();
};

export const getPeriodFormat = (period) => {

  if (period === StatsPeriod.ALL_TIME) {
    return false;
  }

  if (period === StatsPeriod.TODAY) {
    return dayjs().set('hour', 0).set('minute', 0).set('second', 0).format();
  }

  return dayjs().subtract(1, period).format();
};

export const isAfter = (date, startDate) => {
  return dayjs(date).isAfter(dayjs(startDate));
};
