import {createElement} from "../utils";

// Генерация разметки для фильтрации точек
const generateFiltersListTemplate = (filtersList) => {

  return filtersList.reduce((result, filter) => {
    result += `<div class="trip-filters__filter">
                      <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}">
                      <label class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
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

export default class Filters {
  constructor(data) {
    this._element = null;
    this._data = data;
    this._header = `<h2 class="visually-hidden">Filter events</h2>`;
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

  getHeader() {
    return createElement(this._header);
  }

  removeElement() {
    this._element = null;
  }
}
