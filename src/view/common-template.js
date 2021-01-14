import {TYPE_LIST, pointTypeResource} from "../const";

export const generateTypesListTemplate = (currentType) => {
  return TYPE_LIST.reduce((result, type) => {

    const isChecked = type === currentType ? `checked` : ``;
    const typeFromResource = pointTypeResource[type];

    result += `<div class="event__type-item">
                  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
                  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeFromResource}</label>
                </div>`;
    return result;
  }, ``);
};

export const generateCitiesListTemplate = (citiesList) => {
  return citiesList.length === 0
    ? ``
    : citiesList.reduce((result, city) => {
      result += `<option value="${city}"></option>`;
      return result;
    }, ``);
};

export const generateOffersListTemplate = (offerList) => {
  if (offerList.length === 0) {
    return ``;
  }
  const offersListTemplate = offerList.reduce((result, offer) => {
    const isChecked = offer.checked ? `checked` : ``;
    const offerName = offer.title.toLowerCase().replace(/ /g, `-`);
    const offersListInputTemplate = `<input class="event__offer-checkbox  visually-hidden" 
                                      id="event-offer-${offerName}-1" type="checkbox" 
                                      name="event-offer-${offerName}" data-value="${offer.title}" ${isChecked}>`;

    result += `<div class="event__offer-selector">
                ${offersListInputTemplate}
                <label class="event__offer-label" for="event-offer-${offerName}-1">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
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

export const generateDestinationTemplate = (photos, descr) => {
  if (photos.length === 0 && descr.length === 0) {
    return ``;
  }

  const photosList = photos.reduce((result, photo) => {
    result += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
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
