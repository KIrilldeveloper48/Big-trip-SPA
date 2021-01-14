import {getDurationInMinutes} from "./common";
import {CHART_DATA_TYPE, MINUTES_PER_DAY} from "../const";

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

  points.reduce((result, point) => {
    const type = point.currentType.toUpperCase();
    const durationInDay = getDurationInMinutes(point.startDate, point.endDate);

    moneyData[typeMap.get(type)] += point.cost;
    typeData[typeMap.get(type)]++;
    timeSpendData[typeMap.get(type)] += durationInDay;

    return result;
  }, chartsData);

  chartsData[CHART_DATA_TYPE.TIME_SPEND] = chartsData[CHART_DATA_TYPE.TIME_SPEND].map((time) => {
    return Math.floor(time / MINUTES_PER_DAY);
  });

  return chartsData;

};
