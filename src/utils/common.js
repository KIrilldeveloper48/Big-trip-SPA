import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItem = (items) => {
  if (items.length === 0) {
    return [];
  }
  return items[getRandomInteger(0, items.length - 1)];
};

export const getFormatedDate = (date, format) => {
  return dayjs(date).format(format);
};
