import AbstractView from "./abstract.js";

// Получаем итоговую цену путешествия
const getTripCost = (pointsList) => {
  return pointsList.reduce((result, point) => {
    point.currentOffers.forEach((offer) => {
      if (offer.checked) {
        result += offer.cost;
      }
    });
    return result;
  }, 0);
};

const createTripCostTemplate = (serverData) => {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(serverData)}</span>
          </p>`;
};

class TripCost extends AbstractView {
  getTemplate() {
    return createTripCostTemplate(this._data);
  }
}

export default TripCost;
