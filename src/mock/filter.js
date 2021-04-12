const filterTypeNames = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const filterTypes = {
  [filterTypeNames.ALL]: {
    link: '#all',
    text: 'All movies',
  },
  [filterTypeNames.WATCHLIST]: {
    link: '#watchilst',
    text: 'Watchlist',
  },
  [filterTypeNames.HISTORY]: {
    link: '#history',
    text: 'History',
  },
  [filterTypeNames.FAVORITES]: {
    link: '#favorites',
    text: 'Favorites',
  },
};

const filmToFilterMap = {
  [filterTypeNames.ALL]: (films) => films.length,
  [filterTypeNames.WATCHLIST]: (films) => films.filter((film) => film.isInWatchlist).length,
  [filterTypeNames.HISTORY]: (films) => films.filter((film) => film.isWatched).length,
  [filterTypeNames.FAVORITES]: (films) => films.filter((film) => film.isFavorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterTypeName, getCount]) => {
    return {
      text: filterTypes[filterTypeName].text,
      link: filterTypes[filterTypeName].link,
      count: getCount(films),
    };
  });
};
