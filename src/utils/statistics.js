import {MINUTES_PER_DAY} from "../const";
import {durationInMinutes} from "./common";

export const getTypesUniq = (points) => {
  const pointTypes = points.map((point)=> point.currentType.toUpperCase());
  return [...new Set(pointTypes)];
};

export const getChartsData = (typeList, points) => {
  const typeAndIndexList = typeList.map((type) => [type, typeList.indexOf(type)]);
  const typeMap = new Map(typeAndIndexList);

  const moneyData = new Array(typeList.length).fill(0);
  const typeData = new Array(typeList.length).fill(0);
  const timeSpend = new Array(typeList.length).fill(0);

  for (let point of points) {
    const type = point.currentType.toUpperCase();
    const durationInDay = Math.floor(durationInMinutes(point.startDate, point.endDate) / MINUTES_PER_DAY);

    moneyData[typeMap.get(type)] += point.cost;
    typeData[typeMap.get(type)]++;
    timeSpend[typeMap.get(type)] += durationInDay;
  }

  return {
    MONEY: moneyData,
    TYPE: typeData,
    TIME_SPEND: timeSpend
  };
}
;
