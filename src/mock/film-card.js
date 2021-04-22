import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray} from '../utils/common';

const FILM_TITLES = [
  'Made for Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm',
];
const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];
const GENRES = ['Romance', 'Drama', 'Comedy', 'Musical', 'Horror', 'Cartoon', ' Mystery', 'Western'];
const NAMES = ['John Doe', 'Jane Doe', 'John Roe', 'Jane Roe'];
const EMOTION = ['angry.png', 'puke.png', 'sleeping.png', 'smile.png'];
const COMMENT_COUNT = 5;
const COUNTRIES = ['USA', 'Russia', 'France', 'England', 'Germany'];
const AGE_MAX = 18;
const Description = {
  DESCRIPTIONS : ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ],
  DESC_COUNT : 5,
};
const FilmDuration = {
  MIN_H : 0,
  MAX_H: 3,
  MIN_M: 5,
  MAX_M: 59,
};
const ReleaseDate = {
  YEAR: [dayjs().year(), 1900],
  MONTH: [11, 0],
};

const getFilmDuration =() => {
  return `${getRandomInteger(FilmDuration.MIN_H, FilmDuration.MAX_H)}h ${getRandomInteger(FilmDuration.MIN_M, FilmDuration.MAX_M)}m`;
};

const getCommentDate = () => {
  return dayjs().format('YYYY[/]/MM[/]DD HH[:]mm');
};

const getReleaseDate = () => {
  const year = getRandomInteger(...ReleaseDate.YEAR);
  const month = getRandomInteger(...ReleaseDate.MONTH);
  const day = getRandomInteger(dayjs(month).daysInMonth());

  return dayjs(new Date(year, month, day)).format('DD MMMM YYYY');
};

const generateComment = () => {
  return  {
    text: getRandomArrayElement(Description.DESCRIPTIONS),
    author: getRandomArrayElement(NAMES),
    emoji: getRandomArrayElement(EMOTION),
    date: getCommentDate(),
  };
};

const generateFilmCard = () => {

  return {
    id: nanoid(),
    title: getRandomArrayElement(FILM_TITLES),
    poster: getRandomArrayElement(POSTERS),
    description: getRandomArray(Description.DESCRIPTIONS, Description.DESC_COUNT).join(' '),
    rate: getRandomFloat(),
    production: getReleaseDate(),
    duration: getFilmDuration(),
    genres : getRandomArray(GENRES),
    isWatched : Boolean(getRandomInteger()),
    isFavorite : Boolean(getRandomInteger()),
    isInWatchlist : Boolean(getRandomInteger()),
    comments : new Array(getRandomInteger(0, COMMENT_COUNT)).fill().map(generateComment),
    director: getRandomArrayElement(NAMES),
    writers : getRandomArray(NAMES),
    actors: getRandomArray(NAMES),
    country: getRandomArrayElement(COUNTRIES),
    age: getRandomInteger(0, AGE_MAX),
  };
};

export {generateFilmCard};
