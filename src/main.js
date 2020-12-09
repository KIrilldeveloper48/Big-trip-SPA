import {generateTripPoints} from './mocks/trip-point';
import Trip from "./presenter/Trip";

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

const pointsList = getPointList();
const pointListSort = getPointListSort();

const siteMainElement = document.querySelector(`.page-body`);

const tripPresenter = new Trip(siteMainElement);

tripPresenter.init(pointListSort);
