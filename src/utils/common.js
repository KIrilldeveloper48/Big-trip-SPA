import dayjs from 'dayjs';
import {MLSECONDS_PER_MINUTE, MINUTES_PER_DAY, MINUTES_PER_HOUR} from '../const';

export const ucFirst = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

export const getOffersForPoint = (currentOffers, offerList, type) => {
  if (offerList.length === 0) {
    return [];
  }

  const offersForType = offerList[type];

  if (currentOffers.length === 0) {
    return offersForType;
  }

  return offersForType.map((offer) => {

    for (let item of currentOffers) {

      if (offer.title === item.title) {
        return Object.assign(
            {},
            offer,
            {
              checked: !offer.checked
            }
        );
      }

    }
    return offer;
  });
};

// Дата и длительность
export const getFormatedDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDurationInMinutes = (startDate, endDate) => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / MLSECONDS_PER_MINUTE);
};

export const getFullDuration = (startDate, endDate) => {
  const durationInMinutes = getDurationInMinutes(startDate, endDate);

  const numberOfDays = Math.floor(durationInMinutes / MINUTES_PER_DAY);
  const numberOfHours = Math.floor((durationInMinutes - (numberOfDays * MINUTES_PER_DAY)) / MINUTES_PER_HOUR);
  const numberOfMinutes = durationInMinutes - (numberOfDays * MINUTES_PER_DAY + numberOfHours * MINUTES_PER_HOUR);

  let tripPointDuration = `${numberOfMinutes}M`;

  if (numberOfHours > 0) {
    tripPointDuration = `${numberOfHours}H ${tripPointDuration}`;
  } else if (numberOfDays > 0) {
    tripPointDuration = `${numberOfHours}H ${tripPointDuration}`;
  }

  if (numberOfDays > 0) {
    tripPointDuration = `${numberOfDays}D ${tripPointDuration}`;
  }

  return tripPointDuration;
};
