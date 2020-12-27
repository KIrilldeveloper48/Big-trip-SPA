import {MINUTES_PER_DAY, CHART_DATA_TYPE} from "../const";
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
  const timeSpendData = new Array(typeList.length).fill(0);

  const chartsData = {
    [CHART_DATA_TYPE.MONEY]: moneyData,
    [CHART_DATA_TYPE.TYPE]: typeData,
    [CHART_DATA_TYPE.TIME_SPEND]: timeSpendData
  };

  return points.reduce((result, point) => {
    const type = point.currentType.toUpperCase();
    const durationInDay = Math.floor(durationInMinutes(point.startDate, point.endDate) / MINUTES_PER_DAY);

    moneyData[typeMap.get(type)] += point.cost;
    typeData[typeMap.get(type)]++;
    timeSpendData[typeMap.get(type)] += durationInDay;

    return result;
  }, chartsData);

};
