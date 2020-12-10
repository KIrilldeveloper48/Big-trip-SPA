// Сортировка точек маршрута по дате
const getSortList = (a, b) => {
  return a.startDate.getTime() - b.startDate.getTime();
};

export const getPointListSortDate = (list) => {
  const listCopy = list.slice();
  return listCopy.sort(getSortList);
};
