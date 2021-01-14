import PointEditView from "../view/edit-point";
import PointView from "../view/point";

import {isOnline} from "../utils/common";
import {toast} from "../utils/toast";
import {render, RenderPosition, replace, remove} from '../utils/render';

import {Keys, UpdateType, UserAction} from '../const';


const {ESCAPE: escapeKey, ESC: escKey} = Keys;
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

class Point {
  constructor(pointContainer, changeData, changeMode, pointsModel) {
    this._pointsModel = pointsModel;
    this._offerList = pointsModel.getOffers();
    this._destinations = pointsModel.getDestinations();

    this._pointContainerElement = pointContainer.getElement();

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._mode = Mode.DEFAULT;

    this._openClickHandler = this._openClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._btnSubmitHandler = this._btnSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, this._offerList, this._destinations);

    this._pointComponent.setOpenClickHandler(this._openClickHandler);
    this._pointComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._pointEditComponent.setSubmitHandler(this._btnSubmitHandler);
    this._pointEditComponent.setCloseClickHandler(this._closeClickHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainerElement, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    } else if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  setViewState(state) {
    const resetFromState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isDeleting: false,
        isSaving: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;

      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;

      case State.ABORTING:
        this._pointEditComponent.shake(resetFromState);
        this._pointComponent.shake(resetFromState);
        break;
    }
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _openClickHandler() {
    if (!isOnline()) {
      toast(`You can't edit point offline`);
      return;

    }
    this._replacePointToForm();
  }

  _closeClickHandler() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === escapeKey || evt.key === escKey) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _btnSubmitHandler(point) {
    if (!isOnline()) {
      toast(`You can't save point offline`);
      return;
    }
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _deleteClickHandler(point) {
    if (!isOnline()) {
      toast(`You can't delete point offline`);
      return;
    }
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

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
