import {createTripInfoTemplate} from "./view/header-trip-info";
import {createTripCostTemplate} from "./view/header-trip-cost";
import {createTripMenuTemplate} from "./view/header-trip-menu";
import {createTripFiltersTemplate} from "./view/header-trip-filters";

import {createTripSortTemplate} from "./view/main-trip-sort";
import {createTripListEventsTemplate} from "./view/main-trip-list-events";
import {createTripListEventsItemTemplate} from "./view/main-trip-list-events";
import {createTripNewPointTemplate} from "./view/main-trip-new-point";
import {createTripEditPointTemplate} from "./view/main-trip-edit-point";
import {createTripPointTemplate} from "./view/main-trip-point";

import {generateTripPoints} from './mocks/trip-point';

import {SORT_LIST} from './mocks/const';
import {FILTERS_LIST} from './mocks/const';
import {MENU_LIST} from './mocks/const';

const POINTS_COUNT = 20;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Сортировка точек маршрута по дате
const sortTripPointList = (list) => {
  const sortList = (a, b) => {
    if (a.startDate.getTime() > b.startDate.getTime()) {
      return 1;
    }
    if (a.startDate.getTime() < b.startDate.getTime()) {
      return -1;
    }
    return 0;
  };

  return list.sort(sortList);
};

// Получаем массив с точками маршрута
const getTripPointList = () => {
  let tripPointList = [];
  for (let i = 0; i < POINTS_COUNT; i++) {
    tripPointList.push(generateTripPoints());
  }
  tripPointList = sortTripPointList(tripPointList);

  return tripPointList;
};

const tripPointsList = getTripPointList();

const siteMainElement = document.querySelector(`.page-body`);

// --- Отрисовка в header ---
// Отрисовка информации
const mainHeaderElement = siteMainElement.querySelector(`.trip-main`);
render(mainHeaderElement, createTripInfoTemplate(tripPointsList), `afterbegin`);

// Отрисовка цены
const tripInfoElement = mainHeaderElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(tripPointsList), `beforeend`);

// Отрисовка меню и фильтров
const tripControlsElement = siteMainElement.querySelector(`.trip-controls`);
render(tripControlsElement, createTripMenuTemplate(MENU_LIST), `afterbegin`);
render(tripControlsElement, createTripFiltersTemplate(FILTERS_LIST), `beforeend`);

// --- Отрисовка в main ---
// Отрисовка сортировки и списка (ul)
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
render(tripEventsElement, createTripSortTemplate(SORT_LIST), `afterbegin`);
render(tripEventsElement, createTripListEventsTemplate(), `beforeend`);

// Нахождение последнего элемента li в списке для вставки в него контента
const tripListEventsElement = tripEventsElement.querySelector(
    `.trip-events__list`
);
const getLastEventsItem = () => {
  render(
      tripListEventsElement,
      createTripListEventsItemTemplate(),
      `beforeend`
  );
  return tripListEventsElement.lastChild;
};

// Отрисовка формы создания точки маршрута
const newPointElement = getLastEventsItem();
render(newPointElement, createTripNewPointTemplate(generateTripPoints()), `beforeend`);

// Отрисовка точек маршрута и формы редактирования
for (let i = 0; i < tripPointsList.length; i++) {
  if (i === 0) {
    const editPointElement = getLastEventsItem();
    render(editPointElement, createTripEditPointTemplate(tripPointsList[i]), `beforeend`);
    continue;
  }
  const pointElement = getLastEventsItem();
  render(pointElement, createTripPointTemplate(tripPointsList[i]), `beforeend`);
}
