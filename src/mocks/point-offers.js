import {getRandomInteger} from './utils';
import {TRIP_POINTS_TYPES} from './const';

const generateListPointOffer = () => {
  const possibleCost = {
    min: 5,
    max: 100
  };

  const possibleName = [
    `Order Uber`,
    `Add luggage`,
    `Switch to comfort`,
    `Rent a car`,
    `Add breakfast`,
    `Book tickets`,
    `Lunch in city`,
    `Rent a boat`,
    `feed the pigeons`,
    `Enjoy the view`
  ];

  const optionsCount = {
    min: 0,
    max: 5
  };

  const listOffers = [];

  for (let i = 0; i < getRandomInteger(optionsCount.min, optionsCount.max); i++) {
    const randomOffer = {
      name: possibleName[getRandomInteger(0, possibleName.length - 1)],
      cost: getRandomInteger(possibleCost.min, possibleCost.max),
    };
    listOffers.push(randomOffer);
  }

  return listOffers;
};

export const getPointOffers = () => {
  const pointOffers = {};

  for (let item of TRIP_POINTS_TYPES) {
    pointOffers[item] = generateListPointOffer();
  }

  return pointOffers;
};
