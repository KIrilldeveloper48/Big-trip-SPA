import {getFormatedDate} from '../utils/common';
import {DateFormats, maxCityVisible} from '../const';
import AbstractView from './abstract';

// Получаем маршрут путешествия
const getTitleInfo = (pointsList) => {

  if (pointsList.length > maxCityVisible) {
    return `${pointsList[0].currentCity} &mdash; ... &mdash; ${pointsList[pointsList.length - 1].currentCity}`;
  }

  const cities = pointsList.map(({currentCity}) => currentCity);

  return cities.join(` &mdash; `);
};

// Получаем дату начала и окончания путешествия
const getDateInfo = (pointsList) => {
  const {MOUNTH: formateMounth, DAY: formateDay, MOUNTH_DAY: fomrmateMounthDay} = DateFormats;
  const startDate = pointsList[0].startDate;
  const endDate = pointsList[pointsList.length - 1].endDate;
  const choiceFormatDate = getFormatedDate(startDate, formateMounth) !== getFormatedDate(endDate, formateMounth) ? getFormatedDate(endDate, fomrmateMounthDay) : getFormatedDate(endDate, formateDay);

  return `${getFormatedDate(startDate, fomrmateMounthDay)}&nbsp;&mdash;&nbsp;${choiceFormatDate}`;
};

const createInfoTemplate = (serverData) => {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getTitleInfo(serverData)}</h1>

              <p class="trip-info__dates">${getDateInfo(serverData)}</p>
            </div>
          </section>`;
};


class TripInfo extends AbstractView {
  getTemplate() {
    return createInfoTemplate(this._data);
  }
}

export default TripInfo;
