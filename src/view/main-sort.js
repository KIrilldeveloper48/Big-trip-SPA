import {createElement} from "../utils";

import {SortListDisable} from '../mocks/const';

// Генерация разметки для типов сортировки точек
const generateSortListTemplate = (sortList) => {

  return sortList.reduce((result, type) => {
    result += `<div class="trip-sort__item  trip-sort__item--${type.toLowerCase()}">
                <input ${type === SortListDisable.EVENT || type === SortListDisable.OFFERS ? `disabled` : ``} id="sort-${type.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type.toLowerCase()}">
                <label class="trip-sort__btn" for="sort-${type.toLowerCase()}">${type}</label>
              </div>`;
    return result;
  }, ``);

};

const createSortTemplate = (serverData) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
           ${generateSortListTemplate(serverData)}
          </form>`;
};

export default class Sort {
  constructor(data) {
    this._element = null;
    this._data = data;
    this._header = `<h2 class="visually-hidden">Trip events</h2>`;
  }

  getTemplate() {
    return createSortTemplate(this._data);
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
