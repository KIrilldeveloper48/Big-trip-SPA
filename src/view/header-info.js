import {createElement, getFormatedDate} from '../utils';
import {maxCityVisible} from '../const';

// Получаем маршрут путешествия
const getTitleInfo = (pointsList) => {

  if (pointsList.length > maxCityVisible) {
    return `${pointsList[0].currentCity} &mdash; ... &mdash; ${pointsList[pointsList.length - 1].currentCity}`;
  }

  return pointsList.reduce((result, point) => {
    const isDash = point !== pointsList[pointsList.length - 1] ? `&mdash; ` : ``;

    result += `${point.currentCity} ${isDash}`;

    return result;
  }, ``);
};

// Получаем дату начала и окончания путешествия
const getDateInfo = (pointsList) => {
  const startDate = pointsList[0].startDate;
  const endDate = pointsList[pointsList.length - 1].endDate;
  const choiceFormatDate = getFormatedDate(startDate, `M`) !== getFormatedDate(endDate, `M`) ? getFormatedDate(endDate, `MMM D`) : getFormatedDate(endDate, `D`);

  return `${getFormatedDate(startDate, `MMM D`)}&nbsp;&mdash;&nbsp;${choiceFormatDate}`;
};

const createInfoTemplate = (serverData) => {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getTitleInfo(serverData)}</h1>

              <p class="trip-info__dates">${getDateInfo(serverData)}</p>
            </div>
          </section>`;
};


class TripInfo {
  constructor(data) {
    this._element = null;
    this._data = data;
  }

  getTemplate() {
    return createInfoTemplate(this._data);
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

export default TripInfo;
