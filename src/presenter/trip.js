import PointPresenter, {State as PointPresenterViewState} from "./point";
import PointNewPresenter from "./point-new";

import InfoView from "../view/trip-info";
import CostView from "../view/trip-cost";
import SortView from "../view/sort";
import EventsListContainer from "../view/events-list-container";
import HiddenHeader from '../view/hidden-header';
import Placeholder from "../view/placeholder";
import LoadingView from "../view/loading";

import {render, RenderPosition, remove, replace} from '../utils/render';
import {sortTime, sortPrice, sortDate} from "../utils/sorting";
import {filter} from "../utils/filter.js";

import {HiddenHeaderList, UpdateType, UserAction, SORT_LIST, SortType} from '../const';

class Trip {
  constructor(tripContainer, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripContainer = tripContainer;
    this._pointsContainer = tripContainer.querySelector(`.trip-events`);

    this._pointPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._isLoading = true;
    this._api = api;

    this._headerInfoComponent = null;
    this._headerCostComponent = null;
    this._sortComponent = null;
    this._noPointComponent = null;
    this._loadingComponent = null;
    this._eventsListComponent = new EventsListContainer();
    this._eventsListHeaderComponent = new HiddenHeader(HiddenHeaderList.SORT);

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = null;
  }


  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction, this._pointsModel);

    this._renderH2ForTripEvents();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._pointsModel.getPoints().length === 0) {
      this.renderNoPoint();
    } else {
      this._renderHeaderInfo();
      this._renderSort();
      this._renderPoints();
    }
  }


  destroy() {
    this._currentSortType = SortType.DEFAULT;
    this._clearListAndSort();
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    if (this._noPointComponent !== null) {
      remove(this._noPointComponent);
      render(this._pointsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
      this._pointNewPresenter.init(callback);
      return;
    }

    this._pointNewPresenter.init(callback);
  }

  renderNoPoint() {
    if (this._noPointComponent === null) {
      this._noPointComponent = new Placeholder();
    }
    render(this._pointsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }


  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }

    return filteredPoints.sort(sortDate);
  }

  _clearPointsList() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _clearListAndSort() {
    this._clearPointsList();

    if (this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }
    if (this._noPointComponent !== null) {
      remove(this._noPointComponent);
    }
    if (this._loadingComponent !== null) {
      remove(this._loadingComponent);
    }
  }

  _clearSortAndHeader() {
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    if (this._headerInfoComponent !== null) {
      remove(this._headerInfoComponent);
      this._headerInfoComponent = null;
    }

    if (this._headerCostComponent !== null) {
      remove(this._headerCostComponent);
      this._headerCostComponent = null;
    }
  }

  _renderHeaderInfo() {
    const pointList = this._pointsModel.getPoints().slice().sort(sortDate);
    const prevHeaderInfoComponent = this._headerInfoComponent;
    const prevHeaderCostComponent = this._headerCostComponent;

    this._headerInfoComponent = new InfoView(pointList);
    this._headerCostComponent = new CostView(pointList);

    if (prevHeaderInfoComponent === null || prevHeaderCostComponent === null) {
      const mainHeaderElement = this._tripContainer.querySelector(`.trip-main`);
      render(mainHeaderElement, this._headerInfoComponent, RenderPosition.AFTERBEGIN);

      const tripInfoElement = mainHeaderElement.querySelector(`.trip-info`);
      render(tripInfoElement, this._headerCostComponent, RenderPosition.BEFOREEND);
      return;
    } else {
      replace(this._headerInfoComponent, prevHeaderInfoComponent);
      const tripInfoElement = this._tripContainer.querySelector(`.trip-info`);
      render(tripInfoElement, this._headerCostComponent, RenderPosition.BEFOREEND);
    }

    remove(prevHeaderInfoComponent);
    remove(prevHeaderCostComponent);
  }

  _renderSort() {
    const prevSortComponent = this._sortComponent;
    this._sortComponent = new SortView(SORT_LIST, this._currentSortType);

    if (prevSortComponent === null) {
      render(this._pointsContainer, this._sortComponent, RenderPosition.BEFOREEND);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
      return;
    } else {
      replace(this._sortComponent, prevSortComponent);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    }
    remove(prevSortComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange, this._pointsModel);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    const pointList = this._getPoints();
    render(this._pointsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    pointList.forEach((point) => this._renderPoint(point));
  }

  _renderH2ForTripEvents() {
    render(this._pointsContainer, this._eventsListHeaderComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    this._loadingComponent = new LoadingView();
    render(this._pointsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderListAndSort() {
    this._renderSort();
    this._renderPoints();
  }

  _renderListAndHeader() {
    if (this._pointsModel.getPoints().length === 0) {
      this.renderNoPoint();
      this._clearSortAndHeader();
    } else {
      this._renderHeaderInfo();
      this._renderListAndSort();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearListAndSort();
    this._renderListAndSort();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);

        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;

      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();

        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
            this._pointNewPresenter.destroy();

          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;

      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._currentSortType = SortType.DEFAULT;
        this._clearListAndSort();
        this._renderListAndSort();
        break;
      case UpdateType.MAJOR:
        this._clearPointsList();
        this._renderListAndHeader();

        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this.init();
        break;
    }
  }

  _handlePointChange(updatedPoint) {
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presentor) => presentor.resetView());
  }
}

export default Trip;
