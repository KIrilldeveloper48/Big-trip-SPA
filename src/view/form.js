import SmartView from "./smart";

import {generatePointDescr, generatePointPhotos, getTripPointDuration} from './../mocks/trip-point';

import {ValidationErrors} from "../const";
import {OFFERS_LIST} from "../mocks/const";
import flatpickr from "flatpickr";

const {CITY_ERROR_MESSAGE: cityErrorMessage} = ValidationErrors;

class Form extends SmartView {
  constructor(data) {
    super(data);
    console.log(data);
    // this._cityInputElement = this.getElement().querySelector(`.event__input--destination`);

    this.startDatepicker = null;
    this.endDatepicker = null;

    this._btnSubmitHandler = this._btnSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._costInputHandler = this._costInputHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  // -------- Основные методы -------- //

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setSubmitHandler(this._callback.submit);
    this.setCloseClickHandler(this._callback.click);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker || this._endDatepicker) {
      this._removeDatepicer();
    }
  }

  _removeDatepicer() {
    this._startDatepicker.destroy();
    this._endDatepicker.destroy();
    this._startDatepicker = null;
    this._endDatepicker = null;
  }

  // -------- Вспомогательные методы -------- //

  _validationCityChange(evt) {
    const chosedCity = evt.target.value;
    return this._data.citiesList.indexOf(chosedCity);
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

  _costInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      cost: Number(evt.target.value)
    }, true);
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
    if (this._validationCityChange(evt) >= 0) {
      this.updateData({
        currentCity: evt.target.value,
        descr: generatePointDescr(),
        photosList: generatePointPhotos()
      });
      return;
    }
    this._cityInputElement.setCustomValidity(cityErrorMessage);
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

  _setPointTypeChangeHandler() {
    const typeList = this.getElement().querySelectorAll(`.event__type-input`);
    typeList.forEach((item) => {
      item.addEventListener(`change`, this._pointTypeChangeHandler);
    });
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

  _setInnerHandlers() {
    // this._cityInputElement.addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._costInputHandler);
    this._setPointTypeChangeHandler();
    this._setOffersChangeHandler();
    this._setDatepicker();
  }

  _setDatepicker() {
    if (this._startDatepicker || this._endDatepicker) {
      this._removeDatepicer();
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
}
export default Form;
