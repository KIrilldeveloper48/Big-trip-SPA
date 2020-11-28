import {createElement} from "../utils";

const createHiddenHeader = (text) => {
  return `<h2 class="visually-hidden">${text}</h2>`;
};

class HiddenHeader {
  constructor(text) {
    this._element = null;
    this._text = text;
  }

  getTemplate() {
    return createHiddenHeader(this._text);
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

export default HiddenHeader;
