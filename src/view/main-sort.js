import {createElement} from "../utils";

import {SortListDisable} from '../mocks/const';

// Генерация разметки для типов сортировки точек
const generateSortListTemplate = (sortList) => {

  return sortList.reduce((result, type) => {
    const typeLowerCase = type.toLowerCase();
    const isDisabled = type === SortListDisable.EVENT || type === SortListDisable.OFFERS ? `disabled` : ``;

    result += `<div class="trip-sort__item  trip-sort__item--${typeLowerCase}">
                <input ${isDisabled} id="sort-${typeLowerCase}" 
                class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${typeLowerCase}">
                <label class="trip-sort__btn" for="sort-${typeLowerCase}">${type}</label>
              </div>`;
    return result;
  }, ``);

};

const createSortTemplate = (serverData) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
           ${generateSortListTemplate(serverData)}
          </form>`;
};

class Sort {
  constructor(data) {
    this._element = null;
    this._data = data;
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

  removeElement() {
    this._element = null;
  }
}

export default Sort;
