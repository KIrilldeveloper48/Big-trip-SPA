// Генерация разметки для меню
const generateMenuListTemplate = (menulist) => {
  let menuListTemplate = ``;
  for (let menuItem of menulist) {
    menuListTemplate += ` <a class="trip-tabs__btn" href="#">${menuItem}</a>`;
  }
  return menuListTemplate;
};

export const createTripMenuTemplate = (serverData) => {
  return `<h2 class="visually-hidden">Switch trip view</h2>
          <nav class="trip-controls__trip-tabs  trip-tabs">
          ${generateMenuListTemplate(serverData)}
          </nav>`;
};
