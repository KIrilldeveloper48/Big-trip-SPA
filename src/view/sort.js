import AbstractView from "./abstract";

import {SortListDisable} from '../const';

const generateSortListTemplate = (sortList, currentSort) => {
  return sortList.reduce((result, type) => {
    const typeLowerCase = type.toLowerCase();
    const isDisabled = type === SortListDisable.EVENT || type === SortListDisable.OFFERS ? `disabled` : ``;
    const isChecked = typeLowerCase === currentSort ? `checked` : ``;

    result += `<div class="trip-sort__item  trip-sort__item--${typeLowerCase}">
                <input ${isDisabled} id="sort-${typeLowerCase}" 
                class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${typeLowerCase}" data-sort-type="${typeLowerCase}" ${isChecked}>
                <label class="trip-sort__btn" for="sort-${typeLowerCase}">${type}</label>
              </div>`;
    return result;
  }, ``);

};

const createSortTemplate = (serverData, currentSort) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${generateSortListTemplate(serverData, currentSort)}
          </form>`;
};

class Sort extends AbstractView {
  constructor(serverData, currentSort) {
    super(serverData);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._currentSort = currentSort;
  }

  getTemplate() {
    return createSortTemplate(this._data, this._currentSort);
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
