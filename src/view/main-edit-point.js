import he from "he";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

import SmartView from "./smart";

import {generateTypesListTemplate, generateCitiesListTemplate, generateOffersListTemplate, generateDestinationTemplate} from "./common-template";
import {getFormatedDate, ucFirst, getFullDuration, getOffersForPoint} from "../utils/common";
import {DateFormats, cityErrorMessage, typesList} from "../const";


const {FULL_TIME: formateFullTime} = DateFormats;

const createEditPointTemplate = (data, citiesList, offerList) => {
  const {currentType, cost, currentCity, descr, photosList, startDate, endDate} = data;
  const costToString = String(cost);
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    ${generateTypesListTemplate(typesList, currentType)}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${ucFirst(currentType)}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(currentCity)}" list="destination-list-1">
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
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(costToString)}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>
            <section class="event__details">
            ${generateOffersListTemplate(offerList)}
 
            ${generateDestinationTemplate(photosList, descr)}
            </section>
          </form>
        </li>`;
};

class EditPoint extends SmartView {
  constructor(data, offerList, destinations) {
    super(data);
    this._data = EditPoint.parseDataToUpdatedData(data);

    this._destinations = destinations;
    this._offerList = offerList;
    this._citiesList = this._getCitiesList();

    this._offersForPoint = getOffersForPoint(this._data.currentOffers, this._offerList, this._data.currentType);
    this._offersForPointBck = this._offersForPoint.slice();

    this._cityInputElement = this.getElement().querySelector(`.event__input--destination`);

    this.startDatepicker = null;
    this.endDatepicker = null;

    this._btnSubmitHandler = this._btnSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._costInputHandler = this._costInputHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
  }


  // -------- Основные методы -------- //

  getTemplate() {
    return createEditPointTemplate(this._data, this._citiesList, this._offersForPoint);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setSubmitHandler(this._callback.submit);
    this.setCloseClickHandler(this._callback.click);
  }

  reset(data) {
    this._offersForPoint = this._offersForPointBck;
    this.updateData(
        EditPoint.parseDataToUpdatedData(data)
    );
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker || this._endtDatepicker) {
      this._removeDatepicker();
    }
  }

  _removeDatepicker() {
    this._startDatepicker.destroy();
    this._endDatepicker.destroy();
    this._startDatepicker = null;
    this._endDatepicker = null;
  }

  // -------- Вспомогательные методы -------- //

  _isCityValid(city) {
    return this._citiesList.indexOf(city) >= 0;
  }

  _getOffers(currentType) {

    return this._offerList.length === 0 || this._offerList[currentType].length === 0
      ? []
      : this._offerList[currentType];
  }

  _getCitiesList() {
    return this._destinations.length === 0
      ? []
      : this._destinations.map((destination) => destination.name);
  }

  _getPointDestination(city) {

    const pointDestination = {
      descr: ``,
      photos: []
    };


    for (let item of this._destinations) {
      if (item.name === city) {
        pointDestination.descr = item.description;
        pointDestination.photos = item.pictures;
        return pointDestination;
      }
    }
    return pointDestination;
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
    this._offersForPoint = this._getOffers(evt.target.value);
    this.updateData({
      currentType: evt.target.value,
      currentOffers: []
    });
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    const chosedCity = evt.target.value;

    if (!this._isCityValid(chosedCity)) {
      this._cityInputElement.setCustomValidity(cityErrorMessage);
      return;
    }

    const pointDestination = this._getPointDestination(chosedCity);

    this.updateData({
      currentCity: chosedCity,
      descr: pointDestination.descr,
      photosList: pointDestination.photos
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
    const currentOfferList = this._offersForPoint;

    const modifiedOfferList = currentOfferList.map((currentOffer) => {
      return currentOffer.title === inputValue ?
        Object.assign(
            {},
            currentOffer,
            {
              checked: !currentOffer.checked
            }
        ) : currentOffer;
    });

    this._offersForPoint = modifiedOfferList;

    const checkedOffers = modifiedOfferList.reduce((result, offer) => {

      if (offer.checked) {
        result.push(offer);
      }
      return result;

    }, []);

    this.updateData({
      currentOffers: checkedOffers
    }, true);
  }

  _startDateChangeHandler([userDate]) {
    this._endDatepicker.config.minDate = userDate;

    this.updateData({
      startDate: userDate,
      duration: getFullDuration(userDate, this._data.endDate)
    }, true);
  }

  _endDateChangeHandler([userDate]) {
    this._startDatepicker.config.maxDate = userDate;

    this.updateData({
      endDate: userDate,
      duration: getFullDuration(this._data.startDate, userDate)
    }, true);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseDataToUpdatedData(this._data));
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

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _setOffersChangeHandler() {
    if (this._offersForPoint.length === 0) {
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
    this._cityInputElement = this.getElement().querySelector(`.event__input--destination`);
    this._cityInputElement.addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._costInputHandler);
    this._setPointTypeChangeHandler();
    this._setOffersChangeHandler();
    this._setDatepicker();
  }

  _setDatepicker() {
    if (this._startDatepicker || this._endtDatepicker) {
      this._removeDatepicker();
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler,
          maxDate: this._data.endDate
        }
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.endDate,
          onChange: this._endDateChangeHandler,
          minDate: this._data.startDate
        }
    );
  }


  // -------- Статичные методы -------- //

  static parseDataToUpdatedData(data) {
    return Object.assign(
        {},
        data
    );
  }
}

export default EditPoint;
