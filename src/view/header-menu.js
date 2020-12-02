import AbstractView from "./abstract";

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

class Menu extends AbstractView {
  getTemplate() {
    return createMenuTemplate(this._data);
  }
}

export default Menu;
