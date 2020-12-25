// Генерация разметки для списка с типом путешествия
export const generateTypesListTemplate = (typesList) => {
  return typesList.reduce((result, type) => {

    const typeLowerCase = type.toLowerCase();

    result += `<div class="event__type-item">
                  <input id="event-type-${typeLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
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
    const offerName = offer.name.toLowerCase().replace(/ /g, `-`); // Первый параметр передаваемы в replace обозначает замену ВСЕХ подходящих подстрок (в нашем случае пробелов), а не только первое вхождение
    const offersListInputTemplate = `<input class="event__offer-checkbox  visually-hidden" 
                                    id="event-offer-${offerName}-1" type="checkbox" 
                                    name="event-offer-${offerName}" data-value="${offer.name}" ${isChecked}>`;

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


// Генерация разметки для описания точки
export const generateDestinationTemplate = (photos, descr) => {
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
