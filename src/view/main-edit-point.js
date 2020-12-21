import SmartView from "./smart";

import {generateTypesListTemplate, generateCitiesListTemplate, generateOffersListTemplate} from "./common-template";
import {generatePointDescr, generatePointPhotos, getTripPointDuration} from './../mocks/trip-point';

import {getFormatedDate} from "../utils/common";
import {DateFormats} from "../const";
import {OFFERS_LIST} from "../mocks/const";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

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
const createEditPointTemplate = ({typesList, currentType, citiesList, cost, currentCity, currentOffers, descr, photosList, startDate, endDate}) => {
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
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
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

class EditPoint extends SmartView {
  constructor(data) {
    super(data);
    this._data = EditPoint.parseDataToUpdatedDate(data);
    this.startDatepicker = null;
    this.endDatepicker = null;

    // Привязывание контекста
    this._btnSubmitHandler = this._btnSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._costInputHandler = this._costInputHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    // Навешиваем обработчики на выбор типа, города и изменение стоимости
    this._setInnerHandlers();
    this._setDatepicker();
  }


  // -------- Основные методы -------- //

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  // Восстановление обработчиков
  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setSubmitHandler(this._callback.submit);
    this.setCloseClickHandler(this._callback.click);
  }

  // Восстановление исходной версии при выходе из редактирования без сохранения
  reset(data) {
    this.updateData(
        EditPoint.parseDataToUpdatedDate(data)
    );
  }

  // Метод для получения списка доступных опций для конкртеного типа путешествия
  _getOffers(currentType) {
    if (OFFERS_LIST[currentType].length === 0) {
      return [];
    }
    return OFFERS_LIST[currentType];
  }


  // -------- Обработчики -------- //

  _btnSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  _closeClickHandler() {
    this._callback.click();
  }

  _pointTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentType: evt.target.value,
      currentOffers: this._getOffers(evt.target.value)
    });
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentCity: evt.target.value,
      descr: generatePointDescr(),
      photosList: generatePointPhotos()
    });
  }

  _costInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      cost: Number(evt.target.value)
    }, true);
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const inputValue = evt.target.dataset.value;
    const currentOfferList = this._data.currentOffers;
    const modifiedOfferList = currentOfferList.map((currentOffer) => {
      return currentOffer.name === inputValue ?
        Object.assign(
            {},
            currentOffer,
            {
              checked: !currentOffer.checked
            }
        ) : currentOffer;
    });

    this.updateData({
      currentOffers: modifiedOfferList
    }, true);
  }

  _startDateChangeHandler([userDate]) {

    this.updateData({
      startDate: userDate,
      duration: getTripPointDuration(userDate, this._data.endDate)
    }, true);
  }

  _endDateChangeHandler([userDate]) {

    this.updateData({
      endDate: userDate,
      duration: getTripPointDuration(this._data.startDate, userDate)
    }, true);
  }

  // -------- Установка обработчиков -------- //

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._btnSubmitHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _setOffersChangeHandler() {
    if (this._data.currentOffers.length === 0) {
      return;
    }
    const offerList = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offerList.forEach((offer) => {
      offer.addEventListener(`change`, this._offerChangeHandler);
    });
  }

  _setPointTypeChangeHandler() {
    const typeList = this.getElement().querySelectorAll(`.event__type-input`);
    typeList.forEach((item) => {
      item.addEventListener(`change`, this._pointTypeChangeHandler);
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._costInputHandler);
    this._setPointTypeChangeHandler();
    this._setOffersChangeHandler();
  }

  _setDatepicker() {
    if (this._startDatepicker || this._endtDatepicker) {
      this._startDatepicker.destroy();
      this._endDatepicker.destroy();
      this._startDatepicker = null;
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler
        }
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.endDate,
          onChange: this._endDateChangeHandler
        }
    );
  }


  // -------- Статичные методы -------- //

  static parseDataToUpdatedDate(data) {
    return Object.assign(
        {},
        data
    );
  }
}

export default EditPoint;
