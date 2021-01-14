import AbstractView from "./abstract";

const generateFiltersListTemplate = (filtersList, currentFilter, isDisabled) => {
  return filtersList.reduce((result, filter) => {

    const filterType = filter.type;
    const isChecked = currentFilter === filterType ? `checked` : ``;
    const disabled = isDisabled || filter.count === 0 ? `disabled` : ``;

    result += `<div class="trip-filters__filter">
                <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" 
                type="radio" name="trip-filter" value="${filterType}" ${isChecked} ${disabled}>
                <label class="trip-filters__filter-label" for="filter-${filterType}">${filter.name}</label>
              </div>`;
    return result;
  }, ``);

};

const createFiltersTemplate = (serverData, currentFilter, isDisabled) => {
  return `<form class="trip-filters" action="#" method="get">
            ${generateFiltersListTemplate(serverData, currentFilter, isDisabled)}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

class Filters extends AbstractView {
  constructor(serverData, currentFilterType, isDisabled) {
    super(serverData);
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._isDisabled = isDisabled;
  }

  getTemplate() {
    return createFiltersTemplate(this._data, this._currentFilter, this._isDisabled);
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
