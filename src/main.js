import { createTripInfoTemplate } from "./view/header-trip-info";
import { createTripCostTemplate } from "./view/header-trip-cost";
import { createTripMenuTemplate } from "./view/header-trip-menu";
import { createTripFiltersTemplate } from "./view/header-trip-filters";

import { createTripSortTemplate } from "./view/main-trip-sort";
import { createTripListEventsTemplate } from "./view/main-trip-list-events";
import { createTripListEventsItemTemplate } from "./view/main-trip-list-events";
import { createTripNewPointTemplate } from "./view/main-trip-new-point";
import { createTripEditPointTemplate } from "./view/main-trip-edit-point";
import { createTripPointTemplate } from "./view/main-trip-point";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(".page-body");

// --- Отрисовка в header ---
// Отрисовка информации
const mainHeaderElement = siteMainElement.querySelector(".trip-main");
render(mainHeaderElement, createTripInfoTemplate(), "afterbegin");

// Отрисовка цены
const tripInfoElement = mainHeaderElement.querySelector(".trip-info");
render(tripInfoElement, createTripCostTemplate(), "beforeend");

// Отрисовка меню и фильтров
const tripControlsElement = siteMainElement.querySelector(".trip-controls");
render(tripControlsElement, createTripMenuTemplate(), "afterbegin");
render(tripControlsElement, createTripFiltersTemplate(), "beforeend");

// --- Отрисовка в main ---
// Отрисовка сортировки и списка (ul)
const tripEventsElement = siteMainElement.querySelector(".trip-events");
render(tripEventsElement, createTripSortTemplate(), "afterbegin");
render(tripEventsElement, createTripListEventsTemplate(), "beforeend");

// Нахождение последнего элемента li в списке для вставки в него контента
const tripListEventsElement = tripEventsElement.querySelector(
  ".trip-events__list"
);
const getLastEventsItem = () => {
  render(
    tripListEventsElement,
    createTripListEventsItemTemplate(),
    "beforeend"
  );
  return tripListEventsElement.lastChild;
};

// Отрисовка формы создания точки маршрута
const newPointElement = getLastEventsItem();
render(newPointElement, createTripNewPointTemplate(), "beforeend");

// Отрисовка формы редактирования точки маршрута
const editPointElement = getLastEventsItem();
render(editPointElement, createTripEditPointTemplate(), "beforeend");

// Отрисовка точек маршрута
const POINTS_COUNT = 3;

for (let i = 0; i < POINTS_COUNT; i++) {
  const pointElement = getLastEventsItem();
  render(pointElement, createTripPointTemplate(), "beforeend");
}
