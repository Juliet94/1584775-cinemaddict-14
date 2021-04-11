const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

const getRandomInteger = function (min = 0, max = 1) {
  return Math.floor(getRandomNumber(min, max));
};

const getRandomFloat = (min = 1, max = 9, digit = 1) => {
  return getRandomNumber(min, max).toFixed(digit);
};

const getRandomArrayElement = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

const getRandomArray = (elements, length = elements.length) => {
  const similarArray = new Array(getRandomInteger(1, length)).fill(null).map(() => getRandomArrayElement(elements));
  return similarArray.filter((item, index) => similarArray.indexOf(item) === index);
};

const getCommentLength = (comments) => {
  return Object.keys(comments).length;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};

export {getRandomInteger,
  getRandomFloat,
  getRandomArrayElement,
  getRandomArray,
  getCommentLength,
  render,
  createElement,
  RenderPosition
};
