import {DateFormats} from "../const";
import {getFormatedDate} from "../utils/common";
import {generateTypesListTemplate, generateCitiesListTemplate, generateOffersListTemplate} from "./common-template";
import {generatePointDescr, generatePointPhotos} from './../mocks/trip-point';
import {OFFERS_LIST} from "../mocks/const";
import SmartView from "./smart";

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
  const {typesList, currentType, citiesList, cost, currentCity, currentOffers, descr, photosList, startDate, endDate} = serverData;
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
    this._data = this._parseDataToUpdatedDate(data);
    // Привязывание контекста
    this._submitHandler = this._submitHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
    this._pointTypeHandler = this._pointTypeHandler.bind(this);
    this._cityHandler = this._cityHandler.bind(this);
    this._costInputHandler = this._costInputHandler.bind(this);
    this._offerHandler = this._offerHandler.bind(this);
    // Навешиваем обработчики на выбор типа, города и изменение стоимости
    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  // Восстановление обработчиков
  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setEditClickHandler(this._callback.click);
  }

  // Восстановление исходной версии при выходе из редактирования без сохранения
  reset(data) {
    this.updateData(
        this._parseDataToUpdatedDate(data)
    );
  }

  // Метод для получения списка доступных опций для конкртеного типа путешествия
  _getOffers(currentType) {
    if (OFFERS_LIST[currentType].length === 0) {
      return [];
    }
    return OFFERS_LIST[currentType];
  }

  // Обработчики
  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  _clickHandler() {
    this._callback.click();
  }

  _pointTypeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentType: evt.target.value,
      currentOffers: this._getOffers(evt.target.value)
    });
  }

  _cityHandler(evt) {
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

  _offerHandler(evt) {
    evt.preventDefault();
    const inputValue = evt.target.dataset.value;
    const currentOfferList = this._data.currentOffers;
    const modifiedOfferList = [];
    for (let i = 0; i <= currentOfferList.length - 1; i++) {
      if (currentOfferList[i].name !== inputValue) {
        modifiedOfferList.push(currentOfferList[i]);
      } else {
        const modifiedOffer = Object.assign(
            {},
            currentOfferList[i],
            {
              checked: !currentOfferList[i].checked
            }
        );
        modifiedOfferList[i] = modifiedOffer;
      }
    }

    this.updateData({
      currentOffers: modifiedOfferList
    }, true);
  }

  // Установка обработчиков
  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._submitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  _setOffersHandler() {
    if (this._data.currentOffers.length === 0) {
      return;
    }
    const offerList = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offerList.forEach((offer) => {
      offer.addEventListener(`change`, this._offerHandler);
    });
  }

  _setPointTypeHandler() {
    const typeList = this.getElement().querySelectorAll(`.event__type-input`);
    typeList.forEach((item) => {
      item.addEventListener(`change`, this._pointTypeHandler);
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`#event-destination-1`).addEventListener(`change`, this._cityHandler);
    this.getElement().querySelector(`#event-price-1`).addEventListener(`input`, this._costInputHandler);
    this._setPointTypeHandler();
    this._setOffersHandler();
  }

  _parseDataToUpdatedDate(data) {
    return Object.assign(
        {},
        data
    );
  }
}

export default EditPoint;
