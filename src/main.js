import {generateTripPoints} from './mocks/trip-point';
import Trip from "./presenter/Trip";
import {getPointListSortDate} from './utils/sorting';

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

const siteMainElement = document.querySelector(`.page-body`);

const tripPresenter = new Trip(siteMainElement);

tripPresenter.init(pointsList, getPointListSortDate);
