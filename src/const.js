export const MAX_CITY_VISIBLE = 3;

export const TYPE_LIST = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export const HiddenHeaderList = {
  FILTERS: `Filter events`,
  MENU: `Switch trip view`,
  SORT: `Trip events`
};

export const Keys = {
  ESC: `Esc`,
  ESCAPE: `Escape`
};

export const ErrorsMessage = {
  CITY: `The city you specified is not available. Please select a city from the list.`,
  COST: `Cost cannot be negative`
};

// Сортировка
export const SortListDisable = {
  EVENT: `Event`,
  OFFERS: `Offers`
};

export const SortType = {
  DEFAULT: `day`,
  TIME: `time`,
  PRICE: `price`
};

export const SORT_LIST = [`Day`, `Event`, `Time`, `Price`, `Offers`];


// Типы действий и обновлений
export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};


// Контролы
export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
  ADD_NEW_POINT: `add-new-point`
};


// Для статистики
export const CHART_DATA_TYPE = {
  MONEY: `MONEY`,
  TYPE: `TYPE`,
  TIME_SPEND: `TIME-SPEND`
};

export const ChartSymbols = {
  MONEY: `€ `,
  TYPE: `x`,
  TIME_SPEND: `D`
};


export const BAR_HEIGHT = 55;


// Дата и длительность

export const DateFormats = {
  FULL: `YYYY-M-DD`,
  FULL_TIME: `DD/MM/YY HH:mm`,
  TIME: `HH:mm`,
  MOUNTH: `M`,
  DAY: `D`,
  DAY_MOUNTH: `D MMM`,
  MOUNTH_DAY: `MMM D`,
};

const MLSECOND_PER_SECOND = 1000;
const SECOND_PER_MINUTE = 60;
export const MLSECONDS_PER_MINUTE = MLSECOND_PER_SECOND * SECOND_PER_MINUTE;
export const MINUTES_PER_DAY = 1440;
export const MINUTES_PER_HOUR = 60;


