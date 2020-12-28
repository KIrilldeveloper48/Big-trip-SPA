// Дочерний презентер
import PointPresenter from "./point";
// Вьюхи
import InfoView from "../view/header-info";
import CostView from "../view/header-cost";
import SortView from "../view/main-sort";
import EventsListContainer from "../view/main-list-events";
import HiddenHeader from '../view/hidden-header';
import Placeholder from "../view/placeholder";
// Моковые данные
import {SORT_LIST, SortType} from '../mocks/const';
// Всп. функции
import {render, RenderPosition, remove, replace} from '../utils/render';
import {sortTime, sortPrice, sortDate} from "../utils/sorting";
import {filter} from "../utils/filter.js";
// Константы
import {HiddenHeaderList, UpdateType, UserAction} from '../const';
import PointNewPresenter from "./point-new";
import {generateTripPoints} from "../mocks/trip-point";

class Trip {
  constructor(tripContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    // Основной конетнер для отрисовки
    this._tripContainer = tripContainer;
    // Контейнер для отрисовки контентной части
    this._pointsContainer = tripContainer.querySelector(`.trip-events`);
    // Будущий список с экземплярами точек. Ключ - айдишник конкретной точки, Свойство - экземпляр класса Point
    this._pointPresenter = {};
    // Изначальный тип сортировки (По дате)
    this._currentSortType = SortType.DEFAULT;
    // Компоненты для отрисовки
    this._headerInfoComponent = null;
    this._headerCostComponent = null;
    this._sortComponent = null;
    this._noPointComponent = new Placeholder();
    this._eventsListComponent = new EventsListContainer();
    // Скрытые заголовки

    this._eventsListHeaderComponent = new HiddenHeader(HiddenHeaderList.SORT);

    // Привязывание контекста
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);


    this._pointNewPresenter = new PointNewPresenter(generateTripPoints(), this._eventsListComponent, this._handleViewAction);
  }


  // -------- Инициализация -------- //
  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    // Отрисовываем скрытый заголовок для контентной части
    this._renderH2ForTripEvents();

    // Запускаем проверку: если нет точек которые можно отрисовать - рисуем заглушку,
    // Иначе отрисовываем информацию о маршруте и стоимости, сортировку и сами точки
    if (this._pointsModel.getPoints().length === 0) {
      this._renderNoPoint();
    } else {
      this._renderHeaderInfo();
      this._renderSort();
      this._renderPoints();
    }
  }


  // -------- Вспомогательные методы -------- //
  destroy() {
    this._currentSortType = SortType.DEFAULT;
    this._clearListAndSort();
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
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

  // Удаление списка точек (как в объекте так и в DOM)
  _clearPointsList() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _clearListAndSort() {
    this._clearPointsList();
    remove(this._sortComponent);
  }


  // -------- Рендер -------- //

  // Отрисовка информация для цены и маршруте путешествия
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

  // Отрисовка сортировки
  _renderSort() {
    this._sortComponent = new SortView(SORT_LIST, this._currentSortType);

    render(this._pointsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // Отрисовка заглушки, если нет точек
  _renderNoPoint() {
    render(this._pointsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  // Логика про отрисовке одной точки. Создаём новый экземпляр класса, в параметрнах передаём контейнер для отрисовки и функцию-коллбэк для обновления точки.
  // После каждого вызыва метода записываем новый экземпляр класса в список
  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  // Отрисовка всех точек
  _renderPoints() {
    const pointList = this._getPoints();
    // Отрисовка конетнера, куда будут рендериться точки
    render(this._pointsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    pointList.forEach((point) => this._renderPoint(point));
  }

  // Отрисовка скрытого заголовка для контентной части
  _renderH2ForTripEvents() {
    render(this._pointsContainer, this._eventsListHeaderComponent, RenderPosition.AFTERBEGIN);
  }

  _renderListAndHeader() {
    if (this._pointsModel.getPoints().length === 0) {
      this._renderNoPoint();
    } else {
      this._renderHeaderInfo();
      this._renderPoints();
    }
  }

  _renderListAndSort() {
    this._renderSort();
    this._renderPoints();
  }

  // -------- Коллбэки -------- //

  // Логика для отрисовки отсортированных точек
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
        this._pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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
    }
  }

  // Этот метод обновляет элемент массива и запускает отрисовку обновлённого элемента
  _handlePointChange(updatedPoint) {
    // Здесь будет обновление модели
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  // Этот метод проходится по всем презентарам в списке и у каждого вызывает метод сброса режима отображения
  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presentor) => presentor.resetView());
  }
}

export default Trip;
