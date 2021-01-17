class Store {
  constructor(pointsKey, offersKey, destinationsKey, storage) {
    this._storage = storage;
    this._storePointsKey = pointsKey;
    this._storeOffersKey = offersKey;
    this._storeDestinationsKey = destinationsKey;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storePointsKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(store)
    );
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._storeOffersKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setOffers(offers) {
    this._storage.setItem(
        this._storeOffersKey,
        JSON.stringify(offers)
    );
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._storeDestinationsKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setDestinations(dest) {
    this._storage.setItem(
        this._storeDestinationsKey,
        JSON.stringify(dest)
    );
  }

}

export default Store;
