import {createElement} from "../utils";

// Получаем итоговую цену путешествия
const getTripCost = (pointsList) => {
  let tripCost = 0;
  pointsList.forEach((point) => {
    point.currentOffers.forEach((offer) => {
      if (offer.checked) {
        tripCost += offer.cost;
      }
    });
  });

  return tripCost;
};

const createTripCostTemplate = (serverData) => {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(serverData)}</span>
          </p>`;
};

class TripCost {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createTripCostTemplate(this._data);
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

export default TripCost;
