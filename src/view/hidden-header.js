import AbstractView from "./abstract";

const createHiddenHeader = (text) => {
  return `<h2 class="visually-hidden">${text}</h2>`;
};

class HiddenHeader extends AbstractView {
  getTemplate() {
    return createHiddenHeader(this._data);
  }
}

export default HiddenHeader;
