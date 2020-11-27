import dayjs from "dayjs";
import {createElement} from "../utils";
import {getPointCost} from "./common-template";


// Генерация разметки для выбранных предложений в точке
const createOffersListTemplate = (offersList) => {
  if (offersList.length === 0) {
    return ``;
  }

  return offersList.reduce((result, offer) => {
    if (offer.checked) {
      result += `<li class="event__offer">
                  <span class="event__offer-title">${offer.name}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.cost}</span>
                </li>`;
    }
    return result;
  }, ``);
};


export const createPointTemplate = (serverData) => {
  const {currentType, currentCity, currentOffers, startDate, endDate, duration} = serverData;
  return `<li class="trip-events__item">
          <div class="event">
            <time class="event__date" datetime="${dayjs(startDate).format(`YYYY-M-DD`)}">${dayjs(startDate).format(`D MMM`)}</time>
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${currentType} ${currentCity}</h3>
            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="${dayjs(startDate).format(`YYYY-M-DD`) + `T` + dayjs(startDate).format(`HH:mm`)}">${dayjs(startDate).format(`HH:mm`)}</time>
                &mdash;
                <time class="event__end-time" datetime="${dayjs(endDate).format(`YYYY-M-DD`) + `T` + dayjs(endDate).format(`HH:mm`)}">${dayjs(endDate).format(`HH:mm`)}</time>
              </p>
              <p class="event__duration">${duration}</p>
            </div>
            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${getPointCost(currentOffers)}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
              ${createOffersListTemplate(currentOffers)}
            </ul>
            <button class="event__favorite-btn event__favorite-btn--active" type="button">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </div>
          </li>`;
};

export default class Point {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createPointTemplate(this._data);
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
