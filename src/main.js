import {generateTripPoints} from './mocks/trip-point';
import Trip from "./presenter/Trip";
import PointsModel from "./model/points";
import FilterModel from './model/filter';
import Filter from './presenter/Filter';

const POINTS_COUNT = 20;

// Получаем массив с точками маршрута
const getPointList = () => {
  let pointList = [];
  for (let i = 0; i < POINTS_COUNT; i++) {
    pointList.push(generateTripPoints());
  }

  return pointList;
};

const pointsList = getPointList();

// Модели
const pointsModel = new PointsModel();
pointsModel.setPoints(pointsList);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.page-body`);
const tripControlsElement = siteMainElement.querySelector(`.trip-controls`);

const filterPresenter = new Filter(tripControlsElement, filterModel, pointsModel);
const tripPresenter = new Trip(siteMainElement, pointsModel, filterModel);

tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
