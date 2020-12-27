import {generateTripPoints} from './mocks/trip-point';
import Trip from "./presenter/trip";
import PointsModel from "./model/points";
import FilterModel from './model/filter';
import Filter from './presenter/filter';
import MenuView from './view/header-menu';
import {FilterType, HiddenHeaderList, MenuItem, UpdateType} from './const';
import {remove, render, RenderPosition} from './utils/render';
import HiddenHeader from './view/hidden-header';
import NewPointBtnView from './view/new-point-btn';
import StatisticsView from './view/statistics';


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

const pointsModel = new PointsModel();
pointsModel.setPoints(pointsList);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.page-body`);
const tripControlsElement = siteMainElement.querySelector(`.trip-controls`);
const mainHeaderElement = siteMainElement.querySelector(`.trip-main`);
const pointListElement = siteMainElement.querySelector(`.trip-events`);


const menuComponent = new MenuView(MenuItem);
const menuHeaderComponent = new HiddenHeader(HiddenHeaderList.MENU);
render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);

const NewPointBtnComponent = new NewPointBtnView(MenuItem);
render(mainHeaderElement, NewPointBtnComponent, RenderPosition.BEFOREEND);


const filterPresenter = new Filter(tripControlsElement, filterModel, pointsModel);
const tripPresenter = new Trip(siteMainElement, pointsModel, filterModel);

const handlePointNewFormClose = () => {
  menuComponent.setMenuItem(MenuItem.TABLE);
  NewPointBtnComponent.getElement().disabled = false;
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);

      tripPresenter.init();
      menuComponent.removeMenuItemActive();
      menuComponent.setMenuItem(MenuItem.TABLE);
      break;

    case MenuItem.STATS:
      tripPresenter.destroy();
      menuComponent.removeMenuItemActive();
      menuComponent.setMenuItem(MenuItem.STATS);

      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pointListElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;

    case MenuItem.ADD_NEW_POINT:

      if (statisticsComponent !== null) {
        remove(statisticsComponent);
      }

      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
      tripPresenter.init();

      NewPointBtnComponent.getElement().disabled = true;
      menuComponent.removeMenuItemActive();
      menuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.createPoint(handlePointNewFormClose);
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);
NewPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);

tripPresenter.init();
filterPresenter.init();

