import dayjs from 'dayjs';

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

export const getRandomInteger = function (min = 0, max = 1) {
  return Math.floor(getRandomNumber(min, max));
};

export const getRandomFloat = (min = 1, max = 9, digit = 1) => {
  return getRandomNumber(min, max).toFixed(digit);
};

export const getRandomArrayElement = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

export const getRandomArray = (elements, length = elements.length) => {
  const similarArray = new Array(getRandomInteger(1, length)).fill(null).map(() => getRandomArrayElement(elements));
  return similarArray.filter((item, index) => similarArray.indexOf(item) === index);
};

export const getCommentLength = (comments) => {
  return Object.keys(comments).length;
};

export const sortByRating = (cardA, cardB) => {
  return (cardB.rate) - (cardA.rate);
};

export const sortByDate = (cardA, cardB) => {
  return dayjs(cardB.production).diff(dayjs(cardA.production));
};
