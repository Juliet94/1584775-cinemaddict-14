import dayjs from 'dayjs';

export const getCommentLength = (comments) => {
  return Object.keys(comments).length;
};

export const sortByRating = (cardA, cardB) => {
  return (cardB.rate) - (cardA.rate);
};

export const sortByDate = (cardA, cardB) => {
  return dayjs(cardB.production).diff(dayjs(cardA.production));
};

export const sortByCommentsLength = (cardA, cardB) => {
  return (getCommentLength(cardB.comments)) - (getCommentLength(cardA.comments));
};
