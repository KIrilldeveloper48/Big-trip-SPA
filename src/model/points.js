import Observer from "../utils/observer";

import {getFullDuration} from "../utils/common";
import {getCurrentOffers} from "../utils/adapt";

class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  setOffers(offers) {
    this._offers = offers;
  }

  setDestinations(dest) {
    this._destinations = dest;
  }

  getPoints() {
    return this._points;
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }


  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          currentType: point.type,
          currentCity: point.destination.name,
          descr: point.destination.description,
          photosList: point.destination.pictures,
          cost: point.base_price,
          isFavorite: point.is_favorite,
          currentOffers: getCurrentOffers(point.offers),
          startDate: new Date(point.date_from),
          endDate: new Date(point.date_to),
          duration: getFullDuration(new Date(point.date_from), new Date(point.date_to))
        }
    );
    delete adaptedPoint.type;
    delete adaptedPoint.destination;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "type": point.currentType,
          "destination": {
            "name": point.currentCity,
            "description": point.descr,
            "pictures": point.photosList
          },
          "base_price": point.cost,
          "is_favorite": point.isFavorite,
          "offers": getCurrentOffers(point.currentOffers),
          "date_from": point.startDate.toISOString(),
          "date_to": point.endDate.toISOString(),
        }
    );

    delete adaptedPoint.currentType;
    delete adaptedPoint.currentCity;
    delete adaptedPoint.currentOffers;
    delete adaptedPoint.descr;
    delete adaptedPoint.photosList;
    delete adaptedPoint.cost;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.startDate;
    delete adaptedPoint.endDate;
    delete adaptedPoint.duration;

    return adaptedPoint;
  }

  static adaptOffersToClient(offers) {
    const adaptedOffers = {};
    offers.forEach((item) => {
      adaptedOffers[item.type] = item.offers;
    });

    return adaptedOffers;
  }
}

export default Points;
