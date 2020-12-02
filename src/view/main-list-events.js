import AbstractView from "./abstract";

const createListEventsTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

class EventsListContainer extends AbstractView {
  getTemplate() {
    return createListEventsTemplate(this._data);
  }
}

export default EventsListContainer;
