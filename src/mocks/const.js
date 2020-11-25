import {getPointOffers} from './point-offers';

export const TRIP_POINTS_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
export const CITIES_LIST = [`Amsterdam`, `London`, `Paris`, `Krakow`, `Moscow`, `Nice`];
export const POINT_DESCR = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
export const SORT_LIST = [`Day`, `Event`, `Time`, `Price`, `Offers`];
export const FILTERS_LIST = [`Everything`, `Future`, `Past`];
export const MENU_LIST = [`Table`, `Stats`];
export const POSSIBLE_NAME = [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add breakfast`, `Book tickets`, `Lunch in city`, `Rent a boat`, `feed the pigeons`, `Enjoy the view`];
export const MLSECONDS_PER_MINUTE = 1000 * 60;
export const MINUTES_PER_DAY = 1440;
export const MINUTES_PER_HOUR = 60;
export const SortListDisable = {
  EVENT: `Event`,
  OFFERS: `Offers`
};
export const PossibleCost = {
  MIN: 5,
  MAX: 100
};
export const OptionsCount = {
  MIN: 0,
  MAX: 5
};
export const SentenceCount = {
  MIN: 1,
  MAX: 5
};
export const PhotoCount = {
  MIN: 1,
  MAX: 5
};

export const OFFERS_LIST = getPointOffers();


