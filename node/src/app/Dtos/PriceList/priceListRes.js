class PriceListResponse {
  toSick(dataPrice) {
    const data = {
      _id: dataPrice._id,
      price: dataPrice.price,
      type: dataPrice.type,
    };
    return data;
  }
}
module.exports = new PriceListResponse();
