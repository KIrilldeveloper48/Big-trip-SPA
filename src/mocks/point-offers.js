import {getRandomInteger, getRandomItem} from '../utils/common';
import {OptionsCount, PossibleCost, POSSIBLE_NAME, TRIP_POINTS_TYPES} from './const';

const generateListPointOffer = () => {
  const {MIN: minCount, MAX: maxCount} = OptionsCount;
  const {MIN: minCost, MAX: maxCost} = PossibleCost;

  const offersList = [];

  for (let i = 0; i < getRandomInteger(minCount, maxCount); i++) {
    const randomOffer = {
      name: getRandomItem(POSSIBLE_NAME),
      cost: getRandomInteger(minCost, maxCost),
    };
    offersList.push(randomOffer);
  }

  return offersList;
};

export const getPointOffers = () => {
  const pointOffers = {};

  for (let item of TRIP_POINTS_TYPES) {
    pointOffers[item] = generateListPointOffer();
  }

  return pointOffers;
};
