import InfoView from "./view/header-info";
import CostView from "./view/header-cost";
import MenuView from "./view/header-menu";
import FiltersView from "./view/header-filters";
import SortView from "./view/main-sort";
import EventsListContainer from "./view/main-list-events";
// import NewPointView from "./view/main-new-point";
import PointEditView from "./view/main-edit-point";
import PointView from "./view/main-point";

import {SORT_LIST, FILTERS_LIST, MENU_LIST} from './mocks/const';
import {generateTripPoints} from './mocks/trip-point';

import {render, RenderPosition} from './utils';

const POINTS_COUNT = 20;

// Получаем массив с точками маршрута
const getPointList = () => {
  let pointList = [];
  for (let i = 0; i < POINTS_COUNT; i++) {
    pointList.push(generateTripPoints());
  }

  return pointList;
};

// Сортировка точек маршрута по дате
const getSortList = (a, b) => {
  return a.startDate.getTime() - b.startDate.getTime();
};

const getPointListSort = () => {
  const pointListCopy = pointsList.slice();
  return pointListCopy.sort(getSortList);
};


// --- Отрисовка ---
const pointsList = getPointList();
const pointListSort = getPointListSort();

const siteMainElement = document.querySelector(`.page-body`);

// --- Отрисовка в header ---
const renderHeader = () => {
  // Отрисовка информации
  const mainHeaderElement = siteMainElement.querySelector(`.trip-main`);
  render(mainHeaderElement, new InfoView(pointListSort).getElement(), RenderPosition.AFTERBEGIN);

  // Отрисовка цены
  const tripInfoElement = mainHeaderElement.querySelector(`.trip-info`);
  render(tripInfoElement, new CostView(pointListSort).getElement(), RenderPosition.BEFOREEND);

  // Отрисовка меню и фильтров
  const tripControlsElement = siteMainElement.querySelector(`.trip-controls`);
  render(tripControlsElement, new MenuView(MENU_LIST).getElement(), RenderPosition.AFTERBEGIN);
  render(tripControlsElement, new MenuView().getHeader(), RenderPosition.AFTERBEGIN);

  render(tripControlsElement, new FiltersView().getHeader(), RenderPosition.BEFOREEND);
  render(tripControlsElement, new FiltersView(FILTERS_LIST).getElement(), RenderPosition.BEFOREEND);
};

// --- Отрисовка в main ---
// Логика для отрисовки точек маршрута и формы редактирования
const renderPoint = (container, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new PointEditView(point);

  const replacePointToForm = () => {
    container.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };
  const replaceFormToPoint = () => {
    container.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());

  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderContent = () => {
  // Отрисовка сортировки
  const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
  render(tripEventsElement, new SortView(SORT_LIST).getElement(), RenderPosition.AFTERBEGIN);
  render(tripEventsElement, new SortView().getHeader(), RenderPosition.AFTERBEGIN);

  // Добавление контейнера (ul) для точек и форм
  render(tripEventsElement, new EventsListContainer().getElement(), RenderPosition.BEFOREEND);
  const eventsElementList = tripEventsElement.querySelector(`.trip-events__list`);
  // Отрисовка формы создания точки маршрута
  // render(eventsElementList, new NewPointView(generateTripPoints()).getElement(), RenderPosition.BEFOREEND);
  // Отрисовка точек
  for (let i = 0; i < pointsList.length; i++) {
    renderPoint(eventsElementList, pointListSort[i]);
  }
};

renderHeader();
renderContent();

