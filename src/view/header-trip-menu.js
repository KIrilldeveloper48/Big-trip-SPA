// Генерация разметки для меню
const generateMenuListTemplate = (menulist) => {
  return menulist.reduce((result, menuItem) => {
    result += ` <a class="trip-tabs__btn" href="#">${menuItem}</a>`;
    return result;
  }, ``);
};

export const createTripMenuTemplate = (serverData) => {
  return `<h2 class="visually-hidden">Switch trip view</h2>
          <nav class="trip-controls__trip-tabs  trip-tabs">
          ${generateMenuListTemplate(serverData)}
          </nav>`;
};
