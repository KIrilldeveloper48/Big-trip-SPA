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

export default class Menu {
  constructor(data) {
    this._element = null;
    this._data = data;
    this._header = `<h2 class="visually-hidden">Switch trip view</h2>`;
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

  getHeader() {
    return createElement(this._header);
  }

  removeElement() {
    this._element = null;
  }
}
