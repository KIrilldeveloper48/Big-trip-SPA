// Дочерний презентер
import PointPresenter from "./Point";
// Вьюхи
import InfoView from "../view/header-info";
import CostView from "../view/header-cost";
import MenuView from "../view/header-menu";
import FiltersView from "../view/header-filters";
import SortView from "../view/main-sort";
import EventsListContainer from "../view/main-list-events";
import NewPointView from "../view/main-new-point";
import HiddenHeader from '../view/hidden-header';
import Placeholder from "../view/placeholder";
// Моковые данные
import {SORT_LIST, FILTERS_LIST, MENU_LIST, SortType} from '../mocks/const';
import {generateTripPoints} from '../mocks/trip-point';
// Всп. функции
import {render, RenderPosition, remove, replace} from '../utils/render';
import {updateItem} from "../utils/common";
import {sortTime, sortPrice, sortDate} from "../utils/sorting";
// Константы
import {HiddenHeaderList} from '../const';

const {FILTERS: filterHeader, MENU: menuHeader, SORT: sortHeader} = HiddenHeaderList;


class Trip {
  constructor(tripContainer) {
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
    this._menuComponent = new MenuView(MENU_LIST);
    this._filtersComponent = new FiltersView(FILTERS_LIST);
    this._sortComponent = new SortView(SORT_LIST);
    this._noPointComponent = new Placeholder();
    this._eventsListComponent = new EventsListContainer();
    this._newPointFormComponent = new NewPointView(generateTripPoints());
    // Скрытые заголовки
    this._menuHeaderComponent = new HiddenHeader(menuHeader);
    this._filtersHeaderComponent = new HiddenHeader(filterHeader);
    this._eventsListHeaderComponent = new HiddenHeader(sortHeader);
    // Привязывание контекста
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleHeaderInfoChange = this._handleHeaderInfoChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  // Инициализация
  init(pointList) {
    // Сохраняем исходный массив
    this._pointList = pointList.slice();
    // Отрисовываем менюшку
    this._renderHeaderControls();
    // Отрисовываем скрытый заголовок для контентной части
    this._renderH2ForTripEvents();

    // Запускаем проверку: если нет точек которые можно отрисовать - рисуем заглушку,
    // Иначе отрисовываем информацию о маршруте и стоимости, сортировку и сами точки
    if (this._pointList.length === 0) {
      this._renderNoPoint();
    } else {
      this._renderHeaderInfo();
      this._renderSort();
      this._renderPoints();
    }
  }

  // Отрисовка информация для цены и маршруте путешествия
  _renderHeaderInfo() {
    const pointList = this._getSortedPoints(SortType.DEFAULT);

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

  // Отрисовка меню и фильтров
  _renderHeaderControls() {
    const tripControlsElement = this._tripContainer.querySelector(`.trip-controls`);

    render(tripControlsElement, this._menuComponent, RenderPosition.AFTERBEGIN);
    render(tripControlsElement, this._menuHeaderComponent, RenderPosition.AFTERBEGIN);

    render(tripControlsElement, this._filtersComponent, RenderPosition.BEFOREEND);
    render(tripControlsElement, this._filtersHeaderComponent, RenderPosition.BEFOREEND);
  }
  // Отрисовка сортировки
  _renderSort() {
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
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handlePointChange, this._handleModeChange, this._handleHeaderInfoChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  // Этот метод обновляет элемент массива и запускает отрисовку обновлённого элемента
  _handlePointChange(updatedPoint) {
    this._pointList = updateItem(this._pointList, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  // Этот метод запускает повторную отрисовку информации о путешествии
  _handleHeaderInfoChange() {
    this._renderHeaderInfo();
  }
  // Этот метод проходится по всем презентарам в списке и у каждого вызывает метод сброса режима отображения
  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presentor) => presentor.resetView());
  }

  // Метод для назначения типа сортировки точек
  _setSortingType(sortType) {
    this._currentSortType = sortType;
  }

  // Метод для получения отсортированного массива с точками, в зависимости от выбранного типа сортировки
  _getSortedPoints(sortType) {
    let sortedPoints = this._pointList.slice();
    switch (sortType) {
      case SortType.TIME:
        sortedPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        sortedPoints.sort(sortPrice);
        break;
      default:
        sortedPoints.sort(sortDate);
    }
    return sortedPoints;
  }

  // Коллбэк с логикой для отрисовки отсортированных точек
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._setSortingType(sortType);
    this._clearPointsList();
    this._renderPoints();
  }

  // Удаление списка точек (как в объекте так и в DOM)
  _clearPointsList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  // Отрисовка всех точек
  _renderPoints() {
    const pointList = this._getSortedPoints(this._currentSortType);
    // Отрисовка конетнера, куда будут рендериться точки
    render(this._pointsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < this._pointList.length; i++) {
      this._renderPoint(pointList[i]);
    }
  }

  // Отрисовка скрытого заголовка для контентной части
  _renderH2ForTripEvents() {
    render(this._pointsContainer, this._eventsListHeaderComponent, RenderPosition.AFTERBEGIN);
  }

  // Отрисовка формы для создания новой точки
  _renderNewPointForm() {
    render(this._pointsContainer, this._newPointFormComponent, RenderPosition.BEFOREEND);
  }
}

export default Trip;
