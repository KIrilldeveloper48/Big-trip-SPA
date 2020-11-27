import {createElement} from "../utils";

const createListEventsTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class EventsListContainer {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createListEventsTemplate(this._data);
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
