// Получаем итоговую цену путешествия
const getTripCost = (pointsList) => {
  let tripCost = 0;
  for (let point of pointsList) {
    for (let offer of point.currentOffers) {
      if (offer.checked) {
        tripCost += offer.cost;
      }
    }
  }
  return tripCost;
};

export const createTripCostTemplate = (serverData) => {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(serverData)}</span>
          </p>`;
};
