import AbstractView from "./abstract";

// Генерация разметки для фильтрации точек
const generateFiltersListTemplate = (filtersList, currentFilter) => {

  return filtersList.reduce((result, filter) => {

    const filterType = filter.type;
    const isChecked = currentFilter === filterType ? `checked` : ``;
    const isDisabled = filter.count === 0 ? `disabled` : ``;

    result += `<div class="trip-filters__filter">
                <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" 
                type="radio" name="trip-filter" value="${filterType}" ${isChecked} ${isDisabled}>
                <label class="trip-filters__filter-label" for="filter-${filterType}">${filter.name}</label>
              </div>`;
    return result;
  }, ``);

};

const createFiltersTemplate = (serverData, currentFilter) => {
  return `<form class="trip-filters" action="#" method="get">
            ${generateFiltersListTemplate(serverData, currentFilter)}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

class Filters extends AbstractView {
  constructor(serverData, currentFilterType) {
    super(serverData);
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._data, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

export default Filters;
