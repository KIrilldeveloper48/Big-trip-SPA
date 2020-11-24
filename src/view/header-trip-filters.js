// Генерация разметки для фильтрации точек
const generateFiltersListTemplate = (filtersList) => {
  let filtersListTemplate = ``;
  for (let filter of filtersList) {
    filtersListTemplate += `<div class="trip-filters__filter">
                      <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}">
                      <label class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
                    </div>`;
  }
  return filtersListTemplate;
};

export const createTripFiltersTemplate = (serverData) => {
  return `<h2 class="visually-hidden">Filter events</h2>
          <form class="trip-filters" action="#" method="get">
            ${generateFiltersListTemplate(serverData)}

            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};
