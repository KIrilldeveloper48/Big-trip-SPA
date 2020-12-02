import AbstractView from './abstract';


const createPlaceholderTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`
  ;
};


class Placeholder extends AbstractView {
  getTemplate() {
    return createPlaceholderTemplate(this._data);
  }
}

export default Placeholder;
