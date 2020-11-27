import dayjs from 'dayjs';
import {getRandomInteger} from '../utils';

import {TRIP_POINTS_TYPES, CITIES_LIST, OFFERS_LIST, POINT_DESCR, MLSECONDS_PER_MINUTE, MINUTES_PER_DAY, MINUTES_PER_HOUR, SentenceCount, PhotoCount} from './const';

// Генерация описания для точки
const generatePointDescr = () => {
  const {MIN: min, MAX: max} = SentenceCount;
  const possiblePointDescr = POINT_DESCR.split(`.`);

  let pointDescr = ``;

  for (let i = 0; i < getRandomInteger(min, max); i++) {
    // possiblePointDescr.length - 2 нужен потому, что метод split разделяя элементы по точке создаёт один пустой элемент в конце массива,
    // т.к. последнее предложение заканчивается точкой
    pointDescr += possiblePointDescr[getRandomInteger(0, possiblePointDescr.length - 2)].trim() + `. `;
  }

  return pointDescr.trim();
};

// Генерация списка фотографий для точки
const generatePointPhotos = () => {
  const {MIN: min, MAX: max} = PhotoCount;
  const pointPhotos = [];

  for (let i = 0; i < getRandomInteger(min, max); i++) {
    const photoPath = `http://picsum.photos/248/152?r=${Math.random()}`;
    pointPhotos.push(photoPath);
  }

  return pointPhotos;
};

// Получение выбранных опций
const getCurrentOffers = (currentType) => {
  if (OFFERS_LIST[currentType].length === 0) {
    return [];
  }
  let currentOffers = [];

  for (let offer of OFFERS_LIST[currentType]) {
    currentOffers.push({
      name: offer.name,
      cost: offer.cost,
      checked: getRandomInteger(0, 1)});
  }

  return currentOffers;
};

// Генерация стартовой даты
const generateStartDate = () => {
  const maxHoursGap = 30 * 24;
  const hoursGap = getRandomInteger(0, maxHoursGap);
  return dayjs().add(hoursGap, `hour`).toDate();
};

// Генерация конечной даты
const generateEndDate = (startDate) => {
  const maxMinuteGap = 10080;
  const minuteGap = getRandomInteger(1, maxMinuteGap);
  return dayjs(startDate).add(minuteGap, `minute`).toDate();
};

// Вычисление продолжительности нахождения в точке
const getTripPointDuration = (startDate, endDate) => {
  const durationInMinutes = (endDate.getTime() - startDate.getTime()) / MLSECONDS_PER_MINUTE;

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

// Генерация структуры данных для точек маршрута, форм создания точки и редактирования
export const generateTripPoints = () => {
  const currentType = TRIP_POINTS_TYPES[getRandomInteger(0, TRIP_POINTS_TYPES.length - 1)];
  const startDate = generateStartDate();
  const endDate = generateEndDate(startDate);
  const currentOffers = getCurrentOffers(currentType);
  return {
    typesList: TRIP_POINTS_TYPES,
    currentType,
    citiesList: CITIES_LIST,
    currentCity: CITIES_LIST[getRandomInteger(0, CITIES_LIST.length - 1)],
    offersList: OFFERS_LIST,
    currentOffers,
    descr: generatePointDescr(),
    photosList: generatePointPhotos(),
    startDate,
    endDate,
    duration: getTripPointDuration(startDate, endDate)
  };
};


