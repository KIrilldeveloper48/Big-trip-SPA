import NewPointView from "../view/main-new-point";

import {remove, render, RenderPosition} from "../utils/render";
import {Keys, UpdateType, UserAction} from "../const";
import {isOnline} from "../utils/common";
import {toast} from "../utils/toast";

const {ESCAPE: escapeKey, ESC: escKey} = Keys;

class PointNew {
  constructor(pointListContainer, changeData, pointsModel) {
    this._pointsModel = pointsModel;
    this._offerList = this._pointsModel.getOffers();
    this._destinations = this._pointsModel.getDestinations();
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._newPointComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._newPointComponent !== null) {
      return;
    }
    this._newPointComponent = new NewPointView(this._offerList, this._destinations);
    this._newPointComponent.setSubmitHandler(this._handleFormSubmit);
    this._newPointComponent.setCloseClickHandler(this._handleCancelClick);

    render(this._pointListContainer, this._newPointComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._newPointComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }
    remove(this._newPointComponent);
    this._newPointComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._newPointComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._newPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
      });
    };

    this._newPointComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    if (!isOnline) {
      toast(`You can't save point offline`);
      return;
    }
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === escapeKey || evt.key === escKey) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default PointNew;
