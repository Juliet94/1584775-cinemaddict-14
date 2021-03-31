export const createFilmsListExtraTemplate = (titleText, additionalClass) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${titleText}</h2>
      <div class="films-list__container ${additionalClass}">
      </div>
    </section>`;
};
