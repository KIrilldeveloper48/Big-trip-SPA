import {createElement} from "../utils";

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

class Filters {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createFiltersTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Filters;
