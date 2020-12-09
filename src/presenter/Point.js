import PointEditView from "../view/main-edit-point";
import PointView from "../view/main-point";

import {render, RenderPosition, replace, remove} from '../utils/render';
import {Keys} from '../const';

const {ESCAPE: escapeKey, ESC: escKey} = Keys;
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class Point {
  constructor(pointContainer, changeData, changeMode) {
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
    // Датабиндинг
    this._clickHandler = this._clickHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._submitHandler = this._submitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    // Запоминаем отрисованные компоненты (При первом вызове = null)
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    // Создаём новые экземпляры точки и формы редактировния
    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point);

    // Вешаем обработчики
    this._pointComponent.setClickHandler(this._clickHandler);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setSubmitHandler(this._submitHandler);
    this._pointEditComponent.setEditClickHandler(this._editClickHandler);

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

  // Метод для возращения всех точек в рнежим отображения по умолчанию
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

  // Обработчик нажатия на кнопку ESC
  _escKeyDownHandler(evt) {
    if (evt.key === escapeKey || evt.key === escKey) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  // ---Коллбэки---
  // Для открытия формы
  _clickHandler() {
    this._replacePointToForm();
  }

  // Для закрытия формы без сохранения изменений
  _editClickHandler() {
    this._replaceFormToPoint();
  }

  // Для закрытия формы с сохранением измененй
  _submitHandler(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }

  // Для добавления точки в избранное. В коллбек передаются данные о точке с добавленным свойством isFavorite со значением true
  _handleFavoriteClick() {
    this._changeData(
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
