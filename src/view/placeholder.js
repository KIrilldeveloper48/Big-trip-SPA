import {createElement} from '../utils';


const createPlaceholderTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`
  ;
};


class Placeholder {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createPlaceholderTemplate(this._data);
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

export default Placeholder;
