import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => new Date().getTime() <= point.startDate.getTime()),
  [FilterType.PAST]: (points) => points.filter((point) => new Date().getTime() > point.endDate.getTime())
}
;
