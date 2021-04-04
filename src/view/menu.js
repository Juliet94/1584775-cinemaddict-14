const createMenuFilterTemplate = (filters) => {


  return filters.map(({link, text, count}) => {
    return `<a href="#${link}" class="main-navigation__item">${text} ${text === 'all' ? '' : `<span  class="main-navigation__item-count">${count}</span>`}</a>`;
  }).join('\n');
};

export const createMenuTemplate = (filters) => {

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${createMenuFilterTemplate(filters)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

