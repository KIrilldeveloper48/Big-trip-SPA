import dayjs from 'dayjs';
import {getPointCost} from './main-trip-point';

// Генерация разметки для списка с типом путешествия
export const generateTypesListTemplate = (typesList) => {
  let typesListTemplate = ``;
  for (let type of typesList) {
    typesListTemplate += `<div class="event__type-item">
                            <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
                            <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
                          </div>`;
  }
  return typesListTemplate;
};

// Генерация разметки для списка городов
export const generateCitiesListTemplate = (citiesList) => {
  let citiesListTemplate = ``;
  for (let city of citiesList) {
    citiesListTemplate += `<option value="${city}"></option>`;
  }
  return citiesListTemplate;
};

// Генерация разметки для списка доступных доп. опций конкретной точки
export const generateOffersListTemplate = (offersList) => {
  if (offersList.length === 0) {
    return ``;
  }

  let offersListTemplate = ``;
  for (let offer of offersList) {
    if (offer.checked) {
      offersListTemplate += `<div class="event__offer-selector">
                              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name.toLowerCase().replace(` `, `-`)}-1" type="checkbox" name="event-offer-${offer.name.toLowerCase().replace(` `, `-`)}" checked>
                              <label class="event__offer-label" for="event-offer-${offer.name.toLowerCase().replace(` `, `-`)}-1">
                                <span class="event__offer-title">${offer.name}</span>
                                &plus;&euro;&nbsp;
                                <span class="event__offer-price">${offer.cost}</span>
                              </label>
                            </div>`;
    } else {
      offersListTemplate += `<div class="event__offer-selector">
                              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name.toLowerCase().replace(` `, `-`)}-1" type="checkbox" name="event-offer-${offer.name.toLowerCase().replace(` `, `-`)}">
                              <label class="event__offer-label" for="event-offer-${offer.name.toLowerCase().replace(` `, `-`)}-1">
                                <span class="event__offer-title">${offer.name}</span>
                                &plus;&euro;&nbsp;
                                <span class="event__offer-price">${offer.cost}</span>
                              </label>
                            </div>`;
    }
  }

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersListTemplate}
            </div>
          </section>`;
};

// Генерация разметки для описания точки
export const generateDestinationTemplate = (photos, descr) => {
  if (photos.length === 0 && descr.length === 0) {
    return ``;
  }

  let photosList = ``;
  for (let photo of photos) {
    photosList += `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }
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

export const createTripEditPointTemplate = (serverData) => {
  const {typesList, currentType, citiesList, currentCity, currentOffers, descr, photosList, startDate, endDate} = serverData;
  return `<form class="event event--edit" action="#" method="post">
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
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startDate).format(`DD/MM/YY HH:mm`)}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endDate).format(`DD/MM/YY HH:mm`)}">
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
          </form>`;
};
