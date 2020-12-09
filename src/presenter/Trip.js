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
import {SORT_LIST, FILTERS_LIST, MENU_LIST} from '../mocks/const';
import {generateTripPoints} from '../mocks/trip-point';
// Всп. функции
import {render, RenderPosition} from '../utils/render';
import {updateItem} from "../utils/common";
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
    // Датабиндинг
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  // Инициализация
  init(pointsList) {
    // Копируем массив с данными точек, чтобы сохранить исходный порядок элементов
    this._pointsList = pointsList.slice();
    // Отрисовываем менюшку
    this._renderHeaderControls();
    // Отрисовываем скрытый заголовок для контентной части
    this._renderH2ForTripEvents();

    // Запусаем проверку: если нет точек которые можно отрисовать - рисуем заглушку,
    // Иначе отрисовываем информацию о маршруте и стоимости, сортировку и сами точки
    if (this._pointsList.length === 0) {
      this._renderNoPoint();
    } else {
      this._renderHeaderInfo(this._pointsList);
      this._renderSort();
      this._renderPoints(this._pointsList);
    }
  }

  // Отрисовка информация для цены и маршруте путешествия
  _renderHeaderInfo(pointList) {
    const mainHeaderElement = this._tripContainer.querySelector(`.trip-main`);
    render(mainHeaderElement, new InfoView(pointList), RenderPosition.AFTERBEGIN);

    const tripInfoElement = mainHeaderElement.querySelector(`.trip-info`);
    render(tripInfoElement, new CostView(pointList), RenderPosition.BEFOREEND);
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
    this._pointsList = updateItem(this._pointsList, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }
  // Этот метод проходится по всем презентарам в списке и у каждого вызывает метод сброса режима отображения
  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presentor) => presentor.resetView());
  }

  // Удаление списка точек (как в объекте так и в DOM)
  _clearPointsList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  // Отрисовка всех точек
  _renderPoints(pointsList) {
    // Отрисовка конетнера, куда будут рендериться точки
    render(this._pointsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < pointsList.length; i++) {
      this._renderPoint(pointsList[i]);
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
