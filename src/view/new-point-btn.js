import AbstractView from "./abstract";

const createNewPointBtnTenplate = (serverData) => {
  return `<button id="${serverData.ADD_NEW_POINT}" class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

class NewPointBtn extends AbstractView {
  constructor(serverData) {
    super(serverData);

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createNewPointBtnTenplate(this._data);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.id);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

}

export default NewPointBtn;
