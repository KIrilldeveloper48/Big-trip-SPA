import {SortListDisable} from '../mocks/const';
import AbstractView from "./abstract";

// Генерация разметки для типов сортировки точек
const generateSortListTemplate = (sortList) => {

  return sortList.reduce((result, type) => {
    const typeLowerCase = type.toLowerCase();
    const isDisabled = type === SortListDisable.EVENT || type === SortListDisable.OFFERS ? `disabled` : `data-sort-type="${typeLowerCase}"`;

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

class Sort extends AbstractView {
  constructor(serverData) {
    super(serverData);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._data);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

export default Sort;
