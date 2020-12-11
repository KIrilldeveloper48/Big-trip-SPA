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
import {render, RenderPosition} from '../utils/render';
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
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  // Инициализация
  init(pointList) {
    // Сортируем исходный массив, так как исходный порядок элементов нам нигде не требуется, везде используется уже отсортированный по датам
    this._pointList = pointList.sort(sortDate);
    // Отсортированный массив сохраняем, чтобы можно было восстановить сортировку по датам после других типов сортировки
    this._sourcedPointList = this._pointList.slice();
    // Отрисовываем менюшку
    this._renderHeaderControls();
    // Отрисовываем скрытый заголовок для контентной части
    this._renderH2ForTripEvents();

    // Запусаем проверку: если нет точек которые можно отрисовать - рисуем заглушку,
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
    const mainHeaderElement = this._tripContainer.querySelector(`.trip-main`);
    render(mainHeaderElement, new InfoView(this._pointList), RenderPosition.AFTERBEGIN);

    const tripInfoElement = mainHeaderElement.querySelector(`.trip-info`);
    render(tripInfoElement, new CostView(this._pointList), RenderPosition.BEFOREEND);
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
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  // Этот метод обновляет элемент массива и запускает отрисовку обновлённого элемента
  _handlePointChange(updatedPoint) {
    this._pointList = updateItem(this._pointList, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }
  // Этот метод проходится по всем презентарам в списке и у каждого вызывает метод сброса режима отображения
  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presentor) => presentor.resetView());
  }

  // Метод для сортировки массива с точками, в зависимости от выбранного типа сортировки
  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._pointList.sort(sortTime);
        break;
      case SortType.PRICE:
        this._pointList.sort(sortPrice);
        break;
      default:
        this._pointList = this._sourcedPointList.slice();
    }
    this._currentSortType = sortType;
  }

  // Коллбэк с логикой для отрисовки отсортированных точек
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
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
    // Отрисовка конетнера, куда будут рендериться точки
    render(this._pointsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < this._pointList.length; i++) {
      this._renderPoint(this._pointList[i]);
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
