export const sortDate = (a, b) => {
  return a.startDate.getTime() - b.startDate.getTime();
};

export const sortTime = (a, b) => {
  const durationPointOne = a.endDate.getTime() - a.startDate.getTime();
  const durationPointTwo = b.endDate.getTime() - b.startDate.getTime();
  return durationPointTwo - durationPointOne;
};

export const sortPrice = (a, b) => {
  return b.cost - a.cost;
};
