import AbstractView from "./abstract";

// Генерация разметки для фильтрации точек
const generateFiltersListTemplate = (filtersList) => {

  return filtersList.reduce((result, filter) => {

    const filterLowerCase = filter.toLowerCase();

    result += `<div class="trip-filters__filter">
                <input id="filter-${filterLowerCase}" class="trip-filters__filter-input  visually-hidden" 
                type="radio" name="trip-filter" value="${filterLowerCase}">
                <label class="trip-filters__filter-label" for="filter-${filterLowerCase}">${filter}</label>
              </div>`;
    return result;
  }, ``);

};

const createFiltersTemplate = (serverData) => {
  return `<form class="trip-filters" action="#" method="get">
            ${generateFiltersListTemplate(serverData)}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

class Filters extends AbstractView {
  getTemplate() {
    return createFiltersTemplate(this._data);
  }
}

export default Filters;
