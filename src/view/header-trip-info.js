import dayjs from 'dayjs';

// Получаем маршрут путешествия
const getTitleInfo = (pointsList) => {
  const maxCityVisible = 3;

  if (pointsList.length > maxCityVisible) {
    return `${pointsList[0].currentCity} &mdash; ... &mdash; ${pointsList[pointsList.length - 1].currentCity}`;
  }

  let titleInfo = ``;
  for (let point of pointsList) {
    if (point !== pointsList[pointsList.length - 1]) {
      titleInfo += `${point.currentCity} &mdash;`;
    } else {
      titleInfo += `${point.currentCity}`;
    }
  }
  return titleInfo;
};

// Получаем дату начала и окончания путешествия
const getDateInfo = (pointsList) => {
  const startTripDateMounth = dayjs(pointsList[0].startDate).format(`M`);
  const EndTripDateMounth = dayjs(pointsList[pointsList.length - 1].endDate).format(`M`);

  if (startTripDateMounth !== EndTripDateMounth) {
    return `${dayjs(pointsList[0].startDate).format(`MMM D`)}&nbsp;&mdash;&nbsp;${dayjs(pointsList[pointsList.length - 1].endDate).format(`MMM D`)}`;
  }
  return `${dayjs(pointsList[0].startDate).format(`MMM D`)}&nbsp;&mdash;&nbsp;${dayjs(pointsList[pointsList.length - 1].endDate).format(`D`)}`;
};

export const createTripInfoTemplate = (serverData) => {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getTitleInfo(serverData)}</h1>

              <p class="trip-info__dates">${getDateInfo(serverData)}</p>
            </div>
          </section>`;
};
