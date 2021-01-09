import PointEditView from "../view/main-edit-point";
import PointView from "../view/main-point";

import {render, RenderPosition, replace, remove} from '../utils/render';
import {Keys, UpdateType, UserAction} from '../const';

const {ESCAPE: escapeKey, ESC: escKey} = Keys;
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class Point {
  constructor(pointContainer, changeData, changeMode, pointsModel) {
    this._pointsModel = pointsModel;
    this._offerList = pointsModel.getOffers();
    this._destinations = pointsModel.getDestinations();
    // Контейнер для отрисовки точек
    this._pointContainerElement = pointContainer.getElement();
    // Метод для отображения изменённых данных
    this._changeData = changeData;
    // Метод для смены режима отображения с editing на default
    this._changeMode = changeMode;
    // Эти свойства нужны для отслеживания состояния точки и формы редактирования - отрисованы они или нет
    this._pointComponent = null;
    this._pointEditComponent = null;
    // Режим отображения по умолчанию
    this._mode = Mode.DEFAULT;
    // Привязывание контекста
    this._openClickHandler = this._openClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._btnSubmitHandler = this._btnSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    // Запоминаем отрисованные компоненты (При первом вызове = null)
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    // Создаём новые экземпляры точки и формы редактировния
    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, this._offerList, this._destinations);

    // Вешаем обработчики
    this._pointComponent.setOpenClickHandler(this._openClickHandler);
    this._pointComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._pointEditComponent.setSubmitHandler(this._btnSubmitHandler);
    this._pointEditComponent.setCloseClickHandler(this._closeClickHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    // Если инициализация первичная - просто рендерим точку
    // Если инициализация повторная, то, в зависимости от режима отображения, обновляем или точку или форму редактирования
    // После чего удаляем старые версии
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainerElement, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    } else if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }


  // -------- Основные методы -------- //

  // Метод для возращения всех точек в режим отображения по умолчанию
  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  // Метод для удаления компонент
  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  // Логика по замене точки на форму
  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  // Логика по замене формы на точку
  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }


  // -------- Коллбэки -------- //

  // Для открытия формы
  _openClickHandler() {
    this._replacePointToForm();
  }

  // Для закрытия формы без сохранения изменений
  _closeClickHandler() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  // Для закрытия формы без сохранения изменений по нажатию ESC
  _escKeyDownHandler(evt) {
    if (evt.key === escapeKey || evt.key === escKey) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  // Для закрытия формы с сохранением измененй
  _btnSubmitHandler(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        point
    );
    this._replaceFormToPoint();
  }

  // Для удаления точки
  _deleteClickHandler(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  // Для добавления точки в избранное. В коллбек передаются данные о точке с добавленным свойством isFavorite
  _favoriteClickHandler() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }
}

export default Point;
