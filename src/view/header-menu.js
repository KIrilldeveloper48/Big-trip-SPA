import {createElement} from "../utils";

// Генерация разметки для меню
const generateMenuListTemplate = (menulist) => {
  return menulist.reduce((result, menuItem) => {
    result += ` <a class="trip-tabs__btn" href="#">${menuItem}</a>`;
    return result;
  }, ``);
};

const createMenuTemplate = (serverData) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            ${generateMenuListTemplate(serverData)}
          </nav>`;
};

class Menu {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createMenuTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Menu;
