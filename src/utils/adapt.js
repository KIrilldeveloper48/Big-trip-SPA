export const getCurrentOffers = (offers) => {
  return offers.map((offer) => {
    if (offer.checked) {
      delete offer.checked;
      return offer;
    }
    return Object.assign(
        {},
        offer,
        {
          checked: !offer.checked
        }
    );
  });
};
