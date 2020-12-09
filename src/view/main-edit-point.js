import {DateFormats} from "../const";
import {getFormatedDate} from "../utils/common";
import AbstractView from "./abstract";
import {getPointCost, generateTypesListTemplate, generateCitiesListTemplate, generateOffersListTemplate} from "./common-template";

// Генерация разметки для описания точки
const generateDestinationTemplate = (photos, descr) => {
  if (photos.length === 0 && descr.length === 0) {
    return ``;
  }

  const photosList = photos.reduce((result, photo) => {
    result += `<img class="event__photo" src="${photo}" alt="Event photo">`;
    return result;
  }, ``);

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${descr}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosList}
              </div>
            </div>
          </section>`;
};

const {FULL_TIME: formateFullTime} = DateFormats;
const createEditPointTemplate = (serverData) => {
  const {typesList, currentType, citiesList, currentCity, currentOffers, descr, photosList, startDate, endDate} = serverData;
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    ${generateTypesListTemplate(typesList)}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${currentType}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentCity}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${generateCitiesListTemplate(citiesList)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormatedDate(startDate, formateFullTime)}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormatedDate(endDate, formateFullTime)}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${getPointCost(currentOffers)}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>
            <section class="event__details">
            ${generateOffersListTemplate(currentOffers)}
 
            ${generateDestinationTemplate(photosList, descr)}
            </section>
          </form>
        </li>`;
};

class EditPoint extends AbstractView {
  constructor(data) {
    super(data);
    this._data = data;
    this._submitHandler = this._submitHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  _clickHandler() {
    this._callback.click();
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._submitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }
}

export default EditPoint;
