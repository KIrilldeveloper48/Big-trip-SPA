import AbstractView from "./abstract";

const createMenuTemplate = ({TABLE: table, STATS: stats}) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a id="${table}" class="trip-tabs__btn trip-tabs__btn--active" href="#">${table}</a>
            <a id="${stats}" class="trip-tabs__btn" href="#">${stats}</a>
          </nav>`;
};

class Menu extends AbstractView {
  constructor(serverData) {
    super(serverData);

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._data);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[id=${menuItem}]`);
    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  removeMenuItemActive() {
    const menuItems = this.getElement().querySelectorAll(`A`);
    for (let item of menuItems) {
      if (item.classList.contains(`trip-tabs__btn--active`)) {
        item.classList.remove(`trip-tabs__btn--active`);
      }
    }
  }

  _getMenuItem(menuItem) {
    return this.getElement().querySelector(`[id=${menuItem}]`);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (this._getMenuItem(evt.target.id).classList.contains(`trip-tabs__btn--active`)) {
      return;
    }
    this._callback.menuClick(evt.target.id);
  }

}

export default Menu;
