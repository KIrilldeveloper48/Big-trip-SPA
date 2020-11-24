import {getPointOffers} from './point-offers';

export const TRIP_POINTS_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
export const CITIES_LIST = [`Amsterdam`, `London`, `Paris`, `Krakow`, `Moscow`, `Nice`];
export let OFFERS_LIST = getPointOffers();
export const POINT_DESCR = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
export const SORT_LIST = [`Day`, `Event`, `Time`, `Price`, `Offers`];
export const FILTERS_LIST = [`Everything`, `Future`, `Past`];
export const MENU_LIST = [`Table`, `Stats`];
