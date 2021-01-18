import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

import PointsModel from "./model/points";
import FilterModel from './model/filter';

import Trip from './presenter/trip';
import Filter from './presenter/filter';

import MenuView from './view/menu';
import StatisticsView from './view/statistics';
import HiddenHeader from './view/hidden-header';
import NewPointBtnView from './view/new-point-btn';

import {remove, render, RenderPosition} from './utils/render';
import {isOnline} from './utils/common';
import {FilterType, HiddenHeaderList, MenuItem, UpdateType} from './const';
import {toast} from './utils/toast';


const AUTORIZATION = `Basic i7ddr4g1080asus212`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_POINTS_PREFIX = `bigtrip-points-localstorage`;
const STORE_OFFERS_PREFIX = `bigtrip-offers-localstorage`;
const STORE_DESTINATION_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_VER = `v1`;
const STORE_POINTS_NAME = `${STORE_POINTS_PREFIX}-${STORE_VER}`;
const STORE_OFFERS_NAME = `${STORE_OFFERS_PREFIX}-${STORE_VER}`;
const STORE_DESTINATIONS_NAME = `${STORE_DESTINATION_PREFIX}-${STORE_VER}`;

const siteMainElement = document.querySelector(`.page-body`);
const tripControlsElement = siteMainElement.querySelector(`.trip-controls`);
const mainHeaderElement = siteMainElement.querySelector(`.trip-main`);
const pointListElement = siteMainElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTORIZATION);
const store = new Store(STORE_POINTS_NAME, STORE_OFFERS_NAME, STORE_DESTINATIONS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const menuComponent = new MenuView(MenuItem);
const menuHeaderComponent = new HiddenHeader(HiddenHeaderList.MENU);
const NewPointBtnComponent = new NewPointBtnView(MenuItem);

const filterPresenter = new Filter(tripControlsElement, filterModel, pointsModel);
const tripPresenter = new Trip(siteMainElement, pointsModel, filterModel, apiWithProvider);


const handlePointNewFormClose = () => {
  menuComponent.setMenuItem(MenuItem.TABLE);
  NewPointBtnComponent.getElement().disabled = false;

  if (pointsModel.getPoints().length === 0) {
    tripPresenter.renderNoPoint();
  }

};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);

      tripPresenter.init();
      filterPresenter.init();
      menuComponent.removeMenuItemActive();
      menuComponent.setMenuItem(MenuItem.TABLE);
      break;

    case MenuItem.STATS:
      tripPresenter.destroy();
      filterPresenter.init(true);
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

      if (!isOnline()) {
        toast(`You can't create new point offline`);
        menuComponent.setMenuItem(MenuItem.TABLE);
        break;
      }

      NewPointBtnComponent.getElement().disabled = true;
      menuComponent.removeMenuItemActive();
      menuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.createPoint(handlePointNewFormClose);
  }
};

tripPresenter.init();
filterPresenter.init();

Promise.all([apiWithProvider.getOffers(), apiWithProvider.getDestinations(), apiWithProvider.getPoints()]).then(([offers = [], destinations = [], points = []]) => {
  pointsModel.setOffers(offers);
  pointsModel.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);

  render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
  render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);
  render(mainHeaderElement, NewPointBtnComponent, RenderPosition.BEFOREEND);

  menuComponent.setMenuClickHandler(handleSiteMenuClick);
  NewPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);
})
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    pointsModel.setOffers([]);
    pointsModel.setDestinations([]);

    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    render(tripControlsElement, menuHeaderComponent, RenderPosition.AFTERBEGIN);
    render(mainHeaderElement, NewPointBtnComponent, RenderPosition.BEFOREEND);

    menuComponent.setMenuClickHandler(handleSiteMenuClick);
    NewPointBtnComponent.setMenuClickHandler(handleSiteMenuClick);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);

  if (!isOnline()) {
    document.title += ` [offline]`;
  }
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});


