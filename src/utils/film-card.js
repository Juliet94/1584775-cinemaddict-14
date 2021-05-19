import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

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
