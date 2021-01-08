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
import Api from './api';


const AUTORIZATION = `Basic i7ddr4g1080asus`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const siteMainElement = document.querySelector(`.page-body`);
const tripControlsElement = siteMainElement.querySelector(`.trip-controls`);
const mainHeaderElement = siteMainElement.querySelector(`.trip-main`);
const pointListElement = siteMainElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const menuComponent = new MenuView(MenuItem);
const menuHeaderComponent = new HiddenHeader(HiddenHeaderList.MENU);
const NewPointBtnComponent = new NewPointBtnView(MenuItem);

const filterPresenter = new Filter(tripControlsElement, filterModel, pointsModel);
const tripPresenter = new Trip(siteMainElement, pointsModel, filterModel, api);


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

tripPresenter.init();
filterPresenter.init();

// Promise.all([api.getOffers(), api.getDestinations(), api.getPoints()]).then((data) => {
//   pointsModel.setOffers(data[0]);
//   pointsModel.setDestinations(data[1]);
//   pointsModel.setPoints(UpdateType.INIT, data[2]);

//   render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
//   render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);
//   render(mainHeaderElement, NewPointBtnComponent, RenderPosition.BEFOREEND);

//   menuComponent.setMenuClickHandler(handleSiteMenuClick);
//   NewPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);
// })
//   .catch(() => {
//     pointsModel.setPoints(UpdateType.INIT, []);

//     render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
//     render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);
//     render(mainHeaderElement, NewPointBtnComponent, RenderPosition.BEFOREEND);

//     menuComponent.setMenuClickHandler(handleSiteMenuClick);
//     NewPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);
//   });


api.getPoints().then((point) => {
  pointsModel.setPoints(UpdateType.INIT, point);

  render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
  render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);

  menuComponent.setMenuClickHandler(handleSiteMenuClick);
})
 .catch(() => {
   pointsModel.setPoints(UpdateType.INIT, []);

   render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
   render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);

   menuComponent.setMenuClickHandler(handleSiteMenuClick);
 });

Promise.all([api.getOffers(), api.getDestinations()]).then((data) => {
  pointsModel.setOffers(data[0]);
  pointsModel.setDestinations(data[1]);

  render(mainHeaderElement, NewPointBtnComponent, RenderPosition.BEFOREEND);
  NewPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);
})
  .catch(() => {
    pointsModel.setOffers([]);
    pointsModel.setDestinations([]);
  });
