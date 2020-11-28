// Генерация разметки для списка с типом путешествия
export const generateTypesListTemplate = (typesList) => {
  return typesList.reduce((result, type) => {

    const typeLowerCase = type.toLowerCase();

    result += `<div class="event__type-item">
                  <input id="event-type-${typeLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeLowerCase}">
                  <label class="event__type-label  event__type-label--${typeLowerCase}" for="event-type-${typeLowerCase}-1">${type}</label>
                </div>`;
    return result;
  }, ``);
};

// Генерация разметки для списка городов
export const generateCitiesListTemplate = (citiesList) => {
  return citiesList.reduce((result, city) => {
    result += `<option value="${city}"></option>`;
    return result;
  }, ``);
};

// Генерация разметки для списка доступных доп. опций конкретной точки
export const generateOffersListTemplate = (offersList) => {
  if (offersList.length === 0) {
    return ``;
  }

  const offersListTemplate = offersList.reduce((result, offer) => {
    const isChecked = offer.checked ? `checked` : ``;
    const offerName = offer.name.toLowerCase().replace(` `, `-`);

    const offersListInputTemplate = `<input class="event__offer-checkbox  visually-hidden" 
                                    id="event-offer-${offerName}-1" type="checkbox" 
                                    name="event-offer-${offerName}" ${isChecked}>`;

    result += `<div class="event__offer-selector">
                ${offersListInputTemplate}
                <label class="event__offer-label" for="event-offer-${offerName}-1">
                  <span class="event__offer-title">${offer.name}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.cost}</span>
                </label>
              </div>`;
    return result;
  }, ``);

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersListTemplate}
            </div>
          </section>`;
};

// Получаем итоговую цену для точки исходя из выбранных предложений
export const getPointCost = (offersList) => {
  if (offersList.length === 0) {
    return 0;
  }

  const pointCost = offersList.reduce((result, offer) => {
    if (offer.checked) {
      result += offer.cost;
    }
    return result;
  }, 0);

  return pointCost;
};
