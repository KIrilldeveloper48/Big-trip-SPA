// Генерация разметки для типов сортировки точек
const generateSortListTemplate = (sortList) => {
  let sortListTemplate = ``;
  for (let type of sortList) {
    sortListTemplate += `<div class="trip-sort__item  trip-sort__item--${type.toLowerCase()}">
              <input id="sort-${type.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type.toLowerCase()}">
              <label class="trip-sort__btn" for="sort-${type.toLowerCase()}">${type}</label>
            </div>`;
  }
  return sortListTemplate;
};

export const createTripSortTemplate = (serverData) => {
  return `<h2 class="visually-hidden">Trip events</h2>

          <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
           ${generateSortListTemplate(serverData)}
          </form>`;
};
